/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:60+01:00
 * @Copyright: Technology Studio
**/

import { last } from '@txo/functional'
import { Log } from '@txo/log'
import type { NavigationState } from '@react-navigation/native'

import {
  conditionalNavigationManager,
} from '../Api/ConditionalNavigationManager'
import type {
  NavigateNavigationAction,
  OnActionAttributes,
  WithConditionalNavigationState,
} from '../Model/Types'
import {
  onResolveConditionsResultAction,
  getExistingRouteByRouteName,
  getRoutePathFromNavigateAction,
  getResolveConditionsResult,
} from '../Api/NavigationUtils'
import { cloneState } from '../Api/StateHelper'

const log = new Log('txo.conditional-navigation-react.Navigation.Navigate')

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
}: OnActionAttributes<NavigateNavigationAction>): boolean => {
  const {
    payload,
    flow,
    reset,
    skipConditionalNavigation,
  } = action
  const navigationState = getRootState()

  const nextRoutePath = getRoutePathFromNavigateAction(action) ?? []
  const leafRouteName = last(nextRoutePath)
  log.debug('NAVIGATE', { action, navigationState })
  if (!(skipConditionalNavigation ?? false)) {
    const resolveConditionsResult = getResolveConditionsResult(
      action,
      navigationState,
      nextRoutePath,
      screenConditionConfigMap,
      getContext,
    )
    if (resolveConditionsResult != null) {
      return onResolveConditionsResultAction(
        navigationState,
        nextOnAction,
        resolveConditionsResult,
        restArgs,
      )
    }
  }

  const name = payload?.name
  if ((reset ?? false) && (name != null && name !== '')) {
    log.debug('NAVIGATE WITH RESET')
    const newState = {
      index: 0,
      routes: [
        {
          name,
          params: payload?.params,
        },
      ],
    } as unknown as NavigationState // NOTE: react-navigation adds missing parameters automatically
    setState(newState)
    const resolveConditionsResult = getResolveConditionsResult(
      action,
      newState,
      nextRoutePath,
      screenConditionConfigMap,
      getContext,
    )
    if (resolveConditionsResult != null) {
      return onResolveConditionsResultAction(
        newState,
        nextOnAction,
        resolveConditionsResult,
        restArgs,
      )
    }
    return true
  }

  if (flow ?? false) {
    const route = typeof navigationState.index === 'number' ? navigationState.routes[navigationState.index] : undefined
    if (route != null) {
      const conditionalNavigationState = {
        condition: { key: VOID },
        postponedAction: null,
        logicalTimestamp: conditionalNavigationManager.tickLogicalClock(),
        previousState: cloneState(navigationState),
      }
      const params = (route as WithConditionalNavigationState<typeof route>).params
      if (params != null) {
        params._conditionalNavigationState = conditionalNavigationState
      } else {
        (route as WithConditionalNavigationState<typeof route>).params = {
          _conditionalNavigationState: conditionalNavigationState,
        }
      }
    }
  }

  const destinationNode = getExistingRouteByRouteName(navigationState, leafRouteName)
  if ((destinationNode?.params?._conditionalNavigationState) != null) {
    delete destinationNode.params._conditionalNavigationState
  }

  return originalOnAction(action, ...restArgs)
}
