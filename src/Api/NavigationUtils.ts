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

export const getActiveLeafRoute = (state: NavigationState): Route<string> => {
  const { routes, index } = state
  const currentRoute = routes[index] as NavigationState | Route<string>
  if ('routes' in currentRoute) {
    return getActiveLeafRoute(currentRoute)
  }
  return currentRoute
}

export const getExistingRouteByRouteName = (state: NavigationState | PartialState<NavigationState> | undefined, routeName: string): PartialRoute<Route<string>> | Route<string> | undefined => {
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
    return getExistingRouteByRouteName(currentRoute, routeName)
  }
  return undefined
}

type Params = { screen?: string, params?: Params }

export const getNestedRoutePath = (params: Params | undefined): string[] | undefined => {
  if (!params) {
    return undefined
  }
  const { params: innerParams, screen } = params
  if (!screen) {
    return undefined
  }
  if (innerParams) {
    const nextScreen = getNestedRoutePath(innerParams)
    return nextScreen ? [screen, ...nextScreen] : [screen]
  }
  return [screen]
}

export const getRoutePathFromAction = (action: NavigationAction): string[] | undefined => {
  const { payload } = action
  if (!payload) {
    return undefined
  }
  const { params, name } = payload as { params?: Params, name: string }
  const routePath = getNestedRoutePath(params)
  return routePath ? [name, ...routePath] : [name]
}

export const getActiveRoutePath = (
  state: NavigationState | Route<string> | undefined,
  tempIndex = 0,
): string[] | undefined => {
  if (!state || !('type' in state)) {
    return undefined
  }
  const { routes, index, type } = state
  if (type === 'stack' && tempIndex < index) {
    const nextPath = getActiveRoutePath(state, tempIndex + 1)
    return nextPath ? [routes[tempIndex].name, ...nextPath] : [routes[tempIndex].name]
  } else if (type === 'tab' || type === 'stack') {
    const nextPath = getActiveRoutePath(routes[index])
    return nextPath ? [routes[index].name, ...nextPath] : [routes[index].name]
  }
  return undefined
}

export const getStateNearestRouteKeyByRouteName = (state: NavigationState | null | undefined, name: string): string | undefined => {
  const route = state?.routes?.find(route => route.name === name)
  return route ? route.key : undefined
}

export const calculateIsInitial = (state: NavigationState, currentRoute: Route<string>): boolean => {
  const { routes, type } = state
  const { name } = currentRoute
  if (type === 'tab') {
    return true
  }
  if (routes) {
    const containsSplashScreen = routes[0].name === 'SPLASH_SCREEN'
    let isInitial = false
    for (let index = 0; index < routes.length; index++) {
      const route = routes[index]
      if (route.name === name) {
        isInitial = index === (containsSplashScreen ? 1 : 0)
        break
      }
    }
    return isInitial
  }
  return false
}
