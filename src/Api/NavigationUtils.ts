/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:69+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction,
  NavigationState,
  PartialRoute,
  PartialState,
  Route,
} from '@react-navigation/native'

export const getActiveLeafNavigationNode = (state: NavigationState): Route<string> => {
  const { routes, index } = state
  const currentRoute = routes[index] as NavigationState | Route<string>
  if ('routes' in currentRoute) {
    return getActiveLeafNavigationNode(currentRoute)
  }
  return currentRoute
}

export const getExistingNavigationNodeByRouteName = (state: NavigationState | PartialState<NavigationState> | undefined, routeName: string): PartialRoute<Route<string>> | Route<string> | undefined => {
  if (!state) {
    return undefined
  }
  const { routes, index } = state
  const currentRoute = typeof index === 'number' ? routes[index] as NavigationState | Route<string> : undefined
  if (!currentRoute) {
    return undefined
  }
  if ('name' in currentRoute && currentRoute.name === routeName) {
    return currentRoute
  } else if ('routes' in currentRoute && currentRoute.routes) {
    return getExistingNavigationNodeByRouteName(currentRoute, routeName)
  }
  return undefined
}

type Params = { screen?: string, params?: Params }

export const getNextNestedScreenList = (params: Params | undefined): string[] | undefined => {
  if (!params) {
    return undefined
  }
  const { params: innerParams, screen } = params
  if (!screen) {
    return undefined
  }
  if (innerParams) {
    const nextScreen = getNextNestedScreenList(innerParams)
    return nextScreen ? [screen, ...nextScreen] : [screen]
  }
  return [screen]
}

export const getNavigationPathFromAction = (action: NavigationAction): string[] | undefined => {
  const { payload } = action
  if (!payload) {
    return undefined
  }
  const { params, name } = payload as { params?: Params, name: string }
  const nextScreen = getNextNestedScreenList(params)
  return nextScreen ? [name, ...nextScreen] : [name]
}

export const getActiveScreenPath = (
  state: NavigationState | Route<string> | undefined,
  tempIndex = 0,
): string[] | undefined => {
  if (!state || !('type' in state)) {
    return undefined
  }
  const { routes, index, type } = state
  if (type === 'stack' && tempIndex < index) {
    const nextPath = getActiveScreenPath(state, tempIndex + 1)
    return nextPath ? [routes[tempIndex].name, ...nextPath] : [routes[tempIndex].name]
  } else if (type === 'tab' || type === 'stack') {
    const nextPath = getActiveScreenPath(routes[index])
    return nextPath ? [routes[index].name, ...nextPath] : [routes[index].name]
  }
  return undefined
}