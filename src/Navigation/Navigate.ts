/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:60+01:00
 * @Copyright: Technology Studio
**/

import { last } from '@txo/functional'
import { Log } from '@txo/log'

import {
  conditionalNavigationManager,
} from '../Api/ConditionalNavigationManager'
import type {
  OnActionAttributes,
  WithConditionalNavigationState,
} from '../Model/Types'
import {
  getActiveLeafRoute,
  getExistingRouteByRouteName,
  getRoutePathFromAction,
  getScreenNavigationConditions,
} from '../Api/NavigationUtils'
import { cloneState } from '../Api/StateHelper'

const log = new Log('txo.react-conditional-navigation.Navigation.Navigate')

const VOID = 'void'

export const onNavigateAction = ({
  action,
  getContext,
  getRootState,
  nextOnAction,
  originalOnAction,
  restArgs,
  screenConditionConfigMap,
  setState,
}: OnActionAttributes): boolean => {
  const {
    payload,
    flow,
    reset,
    skipConditionalNavigation,
  } = action
  const navigationState = getRootState()

  const nextRoutePath = getRoutePathFromAction(action) ?? []
  const leafRouteName = last(nextRoutePath)
  log.debug('NAVIGATE', { action, navigationState })
  if (!skipConditionalNavigation) {
    if (navigationState) {
      for (const routeName of nextRoutePath) {
        const screenConditions = getScreenNavigationConditions(screenConditionConfigMap[routeName])
        if (screenConditions && screenConditions.length > 0) {
          const resolveConditionsResult = conditionalNavigationManager.resolveConditions(screenConditions, action, navigationState, getContext)
          log.debug('N: RESOLVE CONDITIONS RESULT', { resolveConditionsResult, action, _conditionToResolveCondition: conditionalNavigationManager._conditionToResolveCondition, screenConditionConfigMap })
          if (resolveConditionsResult) {
            const activeLeafRoute = getActiveLeafRoute(navigationState)
            activeLeafRoute.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
            return nextOnAction(resolveConditionsResult.navigationAction, ...restArgs)
          }
        }
      }
    }
  }

  const name = payload?.name
  if (reset && name) {
    log.debug('NAVIGATE WITH RESET')
    const newState = {
      index: 0,
      routes: [
        { name, params: payload?.params },
      ],
    }
    setState(newState)
    return true
  }

  if (flow) {
    const route = navigationState && typeof navigationState.index === 'number' ? navigationState.routes[navigationState.index] : undefined
    if (route) {
      (route as WithConditionalNavigationState<typeof route>).conditionalNavigation = {
        condition: { key: VOID },
        postponedAction: null,
        logicalTimestamp: conditionalNavigationManager.tickLogicalClock(),
        previousState: cloneState(navigationState),
      }
    }
  }

  const destinationNode = getExistingRouteByRouteName(navigationState, leafRouteName)
  if (destinationNode?.conditionalNavigation) {
    delete destinationNode.conditionalNavigation
  }

  return originalOnAction(action, ...restArgs)
}
