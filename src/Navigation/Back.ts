/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-07T12:11:78+01:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'
import type {
  NavigationState,
  Route,
} from '@react-navigation/native'

import type {
  OnActionAttributes,
} from '../Model/Types'
import {
  getActiveLeafRoute,
  getStateNearestRouteKeyByRouteName,
} from '../Api/NavigationUtils'

const log = new Log('txo.react-conditional-navigation.Navigation.Back')

const getBackedState = (
  state: NavigationState | undefined,
  numberOfBacks: number | undefined,
  destinationKey?: string,
): NavigationState | undefined => {
  if (numberOfBacks === 0 || !state) {
    return state
  }
  let activeRoute = state.routes[state.index] as NavigationState | Route<string>
  if ('type' in activeRoute && activeRoute.type === 'tab') {
    activeRoute.index = activeRoute.index > 0 ? activeRoute.index - 1 : 0
  }
  if (!activeRoute.type) {
    if (state.index > 0) {
      state.index = state.index - 1
      state.routes.pop()
    }
  }
  if (numberOfBacks === undefined && destinationKey) {
    activeRoute = state.routes[state.index]
    const isDestinationKeyMatching = activeRoute.key === destinationKey
    log.debug('B: check if matches', {
      activeRoute, destinationKey, isDestinationKeyMatching, state,
    })
    if (isDestinationKeyMatching) {
      return state
    } else {
      return getBackedState(state, numberOfBacks, destinationKey)
    }
  }
  return getBackedState(
    state,
    typeof numberOfBacks === 'number' ? numberOfBacks - 1 : numberOfBacks,
    destinationKey,
  )
}

export const onBackAction = ({
  action,
  getState,
  originalOnAction,
  restArgs,
  setState,
}: OnActionAttributes): boolean => {
  const {
    payload,
  } = action
  const {
    backToRouteName,
    count,
    key,
    routeName,
  } = payload?.params ?? {}
  log.debug('B', { action })
  const stateDeepCopy = JSON.parse(JSON.stringify(getState()))
  if (backToRouteName) {
    const newKey = routeName
      ? getStateNearestRouteKeyByRouteName(stateDeepCopy, routeName)
      : key

    if (newKey) {
      const newState = getBackedState(stateDeepCopy, undefined, newKey)
      log.debug('B: new state', { newState })
      setState(newState)
      return true
    }
    return false
  }
  if (count === 1 || !count) {
    return originalOnAction(action, ...restArgs)
  }
  const backedState = getBackedState(stateDeepCopy, count)
  const activeLeafNavigationNode = getActiveLeafRoute(backedState)
  activeLeafNavigationNode.conditionalNavigation = undefined
  log.debug(`B: count: ${String(count)}`, { backedState })
  setState(backedState)
  return true
}
