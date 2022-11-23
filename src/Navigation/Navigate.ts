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
  OnActionAttributes, ResolveConditionsResult,
} from '../Model/Types'
import {
  getActiveLeafRoute,
  getExistingRouteByRouteName,
  getRoutePathFromAction,
} from '../Api/NavigationUtils'

const log = new Log('txo.react-conditional-navigation.Navigation.Navigate')

const VOID = 'void'

export const onNavigateAction = ({
  action,
  getState,
  nextOnAction,
  originalOnAction,
  restArgs,
  screenConditionsMap,
  setState,
}: OnActionAttributes): boolean => {
  const {
    payload,
  } = action
  const {
    flow,
    reset,
    skipConditionalNavigation,
  } = payload?.params ?? {}
  const state = getState()

  const nextRoutePath = getRoutePathFromAction(action) ?? []
  const leafRouteName = last(nextRoutePath)
  log.debug('NAVIGATE', { action, state })
  if (!skipConditionalNavigation) {
    if (state) {
      let resolveConditionsResult: ResolveConditionsResult | undefined
      for (const routeName of nextRoutePath) {
        const screenConditions = screenConditionsMap[routeName]
        if (screenConditions && screenConditions.length > 0) {
          resolveConditionsResult = conditionalNavigationManager.resolveConditions(screenConditions, action, state)
        }
      }
      log.debug('N: RESOLVE CONDITIONS RESULT', { resolveConditionsResult, action, _conditionToResolveCondition: conditionalNavigationManager._conditionToResolveCondition })
      if (resolveConditionsResult) {
        const activeLeafNavigationNode = getActiveLeafRoute(state)
        activeLeafNavigationNode.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
        return nextOnAction(resolveConditionsResult.navigationAction, ...restArgs)
      }
    }
  }

  if (reset) {
    log.debug('NAVIGATE WITH RESET')
    const { reset, ...paramsWithoutReset } = payload?.params ?? {}
    const newState = {
      index: 0,
      routes: [
        { name: leafRouteName, params: paramsWithoutReset },
      ],
    }
    setState(newState)
    return true
  }

  if (flow) {
    const route = state && typeof state.index === 'number' ? state.routes[state.index] : undefined
    if (route) {
      route.conditionalNavigation = {
        condition: { key: VOID },
        postponedAction: null,
        logicalTimestamp: conditionalNavigationManager.tickLogicalClock(),
        previousState: JSON.parse(JSON.stringify(state)),
      }
    }
  }

  const destinationNode = getExistingRouteByRouteName(state, leafRouteName)
  if (destinationNode?.conditionalNavigation) {
    delete destinationNode.conditionalNavigation
  }

  return originalOnAction(action, ...restArgs)
}
