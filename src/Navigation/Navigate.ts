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
  NavigateNavigationAction,
  OnActionAttributes,
  WithConditionalNavigationState,
} from '../Model/Types'
import {
  onResolveConditionsResultAction,
  getExistingRouteByRouteName,
  getRoutePathFromAction,
  getResolveConditionsResult,
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
}: OnActionAttributes<NavigateNavigationAction>): boolean => {
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
        { name, params: payload?.params },
      ],
    }
    setState(newState)
    return true
  }

  if (flow ?? false) {
    const route = typeof navigationState.index === 'number' ? navigationState.routes[navigationState.index] : undefined
    if (route != null) {
      (route as WithConditionalNavigationState<typeof route>).conditionalNavigation = {
        condition: { key: VOID },
        postponedAction: null,
        logicalTimestamp: conditionalNavigationManager.tickLogicalClock(),
        previousState: cloneState(navigationState),
      }
    }
  }

  const destinationNode = getExistingRouteByRouteName(navigationState, leafRouteName)
  if ((destinationNode?.conditionalNavigation) != null) {
    delete destinationNode.conditionalNavigation
  }

  return originalOnAction(action, ...restArgs)
}
