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
import { Log } from '@txo/log'
import {
  isNotEmptyString, last,
} from '@txo/functional'
import { is } from '@txo/types'

import type {
  Condition,
  ConditionConfig,
  NavigationAction,
  OnAction,
  ResolveConditionContext,
  ResolveConditionsResult,
  StaticScreenTree,
  StaticScreenTreeWithDepth,
  WithConditionalNavigationState,
  StaticScreenTreeNavigatorWithDepth,
} from '../Model/Types'
import { ROOT_NAVIGATOR_ID } from '../Model'

import { conditionalNavigationManager } from './ConditionalNavigationManager'

const log = new Log('txo.conditional-navigation-react.Api.NavigationUtils')

export const getActiveLeafRoute = (state: NavigationState): WithConditionalNavigationState<Route<string>> => {
  const { routes, index } = state
  const currentRoute = routes[index] as NavigationState | WithConditionalNavigationState<Route<string>>
  if ('routes' in currentRoute) {
    return getActiveLeafRoute(currentRoute)
  }
  if ('state' in currentRoute) {
    return getActiveLeafRoute(currentRoute.state as NavigationState)
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
  if (state != null && 'state' in state && state.state != null) {
    return getActiveRoutePath(state.state as NavigationState, tempIndex)
  }
  if ((state == null) || !('type' in state)) {
    return undefined
  }
  const {
    routes,
    index,
    type,
  } = state
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
      const screenConditions = getScreenNavigationConditions(screenConditionConfigMap[routeName])
      log.debug(`RESOLVE CONDITIONS: ${routeName}`, { screenConditions, action, state, routePath })
      if ((screenConditions != null) && screenConditions.length > 0) {
        return conditionalNavigationManager.resolveConditions(screenConditions, action, state, getContext)
      }
    }
  }
}

export const findStaticScreenTree = (
  tree: StaticScreenTreeWithDepth,
  routeName: string,
): StaticScreenTreeWithDepth | undefined => {
  if (tree.routeName === routeName) {
    return tree
  }
  if ('screens' in tree) {
    for (const screen of tree.screens) {
      let foundScreen
      if (screen.routeName === routeName) {
        foundScreen = screen
      }
      if ('screens' in screen) {
        foundScreen = findStaticScreenTree(screen, routeName)
      }
      if (foundScreen != null) {
        return foundScreen
      }
    }
  }
}

export const getRouteNameForStateKey = (
  state: NavigationState,
  stateKey: string,
  isRoot = true,
): string | undefined => {
  if (isRoot && state.key === stateKey) {
    return ROOT_NAVIGATOR_ID
  }
  const { routes } = state
  for (const route of routes) {
    if (route.state?.key === stateKey) {
      return route.name
    }
    if (route.state?.routes != null) {
      const routeName = getRouteNameForStateKey(route.state as NavigationState, stateKey, false)
      if (routeName != null) {
        return routeName
      }
    }
  }
}

export const findStaticNavigatorForStateKey = (
  tree: StaticScreenTreeWithDepth,
  state: NavigationState,
  stateKey: string,
): StaticScreenTreeNavigatorWithDepth | undefined => {
  const routeName = getRouteNameForStateKey(state, stateKey)
  if (routeName == null) {
    return undefined
  }
  return findStaticScreenTree(tree, routeName) as StaticScreenTreeNavigatorWithDepth
}

const createParams = (path: string[]): Params | undefined => {
  if (path.length === 0) {
    return undefined
  }
  const [routeName, ...restPath] = path
  if (restPath.length === 0) {
    return {
      screen: routeName,
    }
  }
  return {
    screen: routeName,
    params: createParams(restPath),
  }
}

const createNavigateActionForPath = (path: string[], originalAction: NavigationAction): NavigationAction => {
  const pathFromAction = getRoutePathFromAction(originalAction)
  const [routeName, ...restPath] = path
  const nextPath = pathFromAction != null ? [...restPath, ...pathFromAction] : restPath
  return {
    type: 'NAVIGATE',
    payload: {
      name: routeName,
      params: createParams(nextPath),
    },
  }
}

const arePathsStartingEqually = (leftPath: string[], rightPath: string[]): boolean => {
  const shorter = leftPath.length < rightPath.length ? leftPath : rightPath
  for (let i = 0; i < shorter.length; i++) {
    if (leftPath[i] !== rightPath[i]) {
      return false
    }
  }
  return true
}

const getCommonStaticNavigatorWithPaths = ({
  currentStaticTreeScreen,
  finalStaticTreeScreen,
}: {
  currentStaticTreeScreen?: StaticScreenTreeWithDepth,
  finalStaticTreeScreen?: StaticScreenTreeWithDepth,
}): {
  commonStaticNavigator: StaticScreenTreeNavigatorWithDepth | undefined,
  targetPathFromCommonNavigator: string[],
  sourcePathFromCommonNavigator: string[],
} => {
  let leftDepth = currentStaticTreeScreen?.depth ?? 0
  let rightDepth = finalStaticTreeScreen?.depth ?? 0
  let leftParent = currentStaticTreeScreen
  let rightParent = finalStaticTreeScreen
  const leftPath: string[] = []
  const rightPath: string[] = []
  const biggerDepth = Math.max(leftDepth, rightDepth)
  for (let i = biggerDepth; i > 1; i--) {
    if (leftDepth === i) {
      leftParent = leftParent?.getParent()
      leftPath.unshift(is(leftParent?.routeName))
      leftDepth--
    }
    if (rightDepth === i) {
      rightParent = rightParent?.getParent()
      rightPath.unshift(is(rightParent?.routeName))
      rightDepth--
    }
    if (leftParent?.routeName === rightParent?.routeName) {
      break
    }
  }

  return {
    commonStaticNavigator: leftParent as StaticScreenTreeNavigatorWithDepth | undefined,
    targetPathFromCommonNavigator: rightPath,
    sourcePathFromCommonNavigator: leftPath,
  }
}

export const transformForNearestExistingNavigator = (
  action: NavigationAction,
  getRootState: () => NavigationState,
  tree: StaticScreenTreeNavigatorWithDepth,
): NavigationAction => {
  if (action.isTransformed ?? false) {
    return action
  }

  const navigationState = getRootState()
  const activeRouteName = getActiveLeafRoute(navigationState).name
  const targetRouteName = last(getRoutePathFromAction(action) ?? [])

  const currentStaticTreeScreen = isNotEmptyString(activeRouteName)
    ? findStaticScreenTree(tree, activeRouteName)
    : undefined
  const finalStaticTreeScreen = findStaticScreenTree(tree, targetRouteName)

  if (currentStaticTreeScreen === finalStaticTreeScreen) {
    return action
  }

  const {
    commonStaticNavigator,
    sourcePathFromCommonNavigator,
    targetPathFromCommonNavigator,
  } = getCommonStaticNavigatorWithPaths({
    currentStaticTreeScreen,
    finalStaticTreeScreen,
  })

  if (arePathsStartingEqually(sourcePathFromCommonNavigator, targetPathFromCommonNavigator)) {
    return action
  }

  let nextAction
  if (action.type === 'NAVIGATE') {
    nextAction = createNavigateActionForPath(targetPathFromCommonNavigator, action)
  } else {
    nextAction = action
  }

  log.debug('TRANSFORMED ACTION', {
    originalAction: action,
    nextAction,
  })

  return {
    ...nextAction,
    navigatorId: commonStaticNavigator?.id,
    isTransformed: true,
  }
}

export const calculateStaticTreeOrder = (tree: StaticScreenTree, parent?: StaticScreenTreeNavigatorWithDepth, depth = 0): StaticScreenTreeWithDepth => {
  const treeWithDepth: StaticScreenTreeWithDepth = {
    ...tree as StaticScreenTreeWithDepth,
    getParent: () => parent,
    depth,
  }
  if ('screens' in treeWithDepth && 'screens' in tree) {
    const { screens } = tree
    treeWithDepth.screens = screens.map((screen) => (
      calculateStaticTreeOrder(screen, treeWithDepth, depth + 1)
    ))
  }
  return treeWithDepth
}
