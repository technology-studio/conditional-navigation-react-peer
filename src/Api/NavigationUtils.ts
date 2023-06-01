/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:69+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction as RNNavigationAction,
  NavigationState,
  PartialRoute,
  PartialState,
  Route,
} from '@react-navigation/native'
import { isNotEmptyString } from '@txo/functional'
import { Log } from '@txo/log'

import type {
  Condition,
  ConditionConfig,
  NavigationAction,
  OnAction,
  ResolveConditionContext,
  ResolveConditionsResult,
  WithConditionalNavigationState,
} from '../Model/Types'

import { conditionalNavigationManager } from './ConditionalNavigationManager'

const log = new Log('txo.conditional-navigation-react.Api.NavigationUtils')

export const getActiveLeafRoute = (state: NavigationState): WithConditionalNavigationState<Route<string>> => {
  const { routes, index } = state
  const currentRoute = routes[index] as NavigationState | WithConditionalNavigationState<Route<string>>
  if ('routes' in currentRoute) {
    return getActiveLeafRoute(currentRoute)
  }
  return currentRoute
}

export const getExistingRouteByRouteName = (state: NavigationState | PartialState<NavigationState> | undefined, routeName: string):
| WithConditionalNavigationState<PartialRoute<Route<string>>>
| WithConditionalNavigationState<Route<string>>
| undefined => {
  if (state == null) {
    return undefined
  }
  const { routes, index } = state
  const currentRoute = typeof index === 'number' ? routes[index] as NavigationState | WithConditionalNavigationState<Route<string>> : undefined
  if (currentRoute == null) {
    return undefined
  }
  if ('name' in currentRoute && currentRoute.name === routeName) {
    return currentRoute
  } else if ('routes' in currentRoute && currentRoute.routes != null) {
    return getExistingRouteByRouteName(currentRoute, routeName)
  }
  return undefined
}

type Params = { screen?: string, params?: Params }

export const getNestedRoutePath = (params: Params | undefined): string[] | undefined => {
  if (params == null) {
    return undefined
  }
  const { params: innerParams, screen } = params
  if (screen == null || screen === '') {
    return undefined
  }
  if (innerParams != null) {
    const nextScreenList = getNestedRoutePath(innerParams)
    return (nextScreenList != null) ? [screen, ...nextScreenList] : [screen]
  }
  return [screen]
}

export const getRoutePathFromAction = (action: RNNavigationAction): string[] | undefined => {
  const { payload } = action
  if (payload == null) {
    return undefined
  }
  const { params, name } = payload as { params?: Params, name: string }
  const routePath = getNestedRoutePath(params)
  return (routePath != null) ? [name, ...routePath] : [name]
}

export const getActiveRoutePath = (
  state: NavigationState | Route<string> | undefined,
  tempIndex = 0,
): string[] | undefined => {
  if ((state == null) || !('type' in state)) {
    return undefined
  }
  const { routes, index, type } = state
  if (type === 'stack' && tempIndex < index) {
    const nextPath = getActiveRoutePath(state, tempIndex + 1)
    return (nextPath != null) ? [routes[tempIndex].name, ...nextPath] : [routes[tempIndex].name]
  } else if (type === 'tab' || type === 'stack') {
    const nextPath = getActiveRoutePath(routes[index])
    return (nextPath != null) ? [routes[index].name, ...nextPath] : [routes[index].name]
  }
  return undefined
}

export const calculateIsInitial = (state: NavigationState, currentRoute: Route<string>): boolean => {
  const { routes, type } = state
  const { name } = currentRoute
  if (type === 'tab') {
    return true
  }
  if (routes != null) {
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

export const getScreenNavigationConditions = (
  conditionConfig: ConditionConfig | undefined,
): Condition[] | undefined => {
  const { conditions } = conditionConfig ?? {}
  if (typeof conditions === 'function') {
    return conditions()
  }
  return conditions
}

export const onResolveConditionsResultAction = (
  state: NavigationState,
  onAction: OnAction<NavigationAction>,
  resolveConditionsResult: ResolveConditionsResult,
  restArgs: unknown[],
): boolean => {
  const activeLeafRoute = getActiveLeafRoute(state)
  if (activeLeafRoute.params == null) {
    activeLeafRoute.params = {
      _conditionalNavigationState: resolveConditionsResult.conditionalNavigationState,
    }
  } else {
    activeLeafRoute.params._conditionalNavigationState = resolveConditionsResult.conditionalNavigationState
  }
  return onAction(resolveConditionsResult.navigationAction, ...restArgs)
}

export const getResolveConditionsResult = (
  action: NavigationAction,
  state: NavigationState,
  routePath: string[],
  screenConditionConfigMap: Record<string, ConditionConfig>,
  getContext: (() => ResolveConditionContext) | undefined,
): ResolveConditionsResult | undefined => {
  if (state != null) {
    for (const routeName of routePath) {
      const screenParam = action.payload?.params?.screen as string | undefined
      const routeNameWithScreenParam = isNotEmptyString(screenParam)
        ? `${routeName}.${screenParam}`
        : routeName
      const screenConditions = getScreenNavigationConditions(screenConditionConfigMap[routeNameWithScreenParam])
      log.debug('RESOLVE CONDITIONS', { routeNameWithScreenParam, screenConditions, action, state })
      if ((screenConditions != null) && screenConditions.length > 0) {
        return conditionalNavigationManager.resolveConditions(screenConditions, action, state, getContext)
      }
    }
  }
}
