/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:69+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationState,
  PartialRoute,
  PartialState,
  Route,
} from '@react-navigation/native'
import { Log } from '@txo/log'
import {
  clearUndefinedAttributes,
  first,
} from '@txo/functional'
import { is } from '@txo/types'

import type {
  Condition,
  ConditionConfig,
  NavigationAction,
  OnAction,
  ResolveConditionContext,
  ResolveConditionsResult,
  WithConditionalNavigationState,
  StaticTreeNavigator,
  StaticTreeNodeDeclaration,
  StaticTreeNode,
  NavigateNavigationAction,
  StaticTreeNavigatorDeclaration,
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

export const getRoutePathFromNavigateAction = (action: NavigateNavigationAction): string[] => {
  const { payload } = action
  const { params, name } = payload as { params?: Params, name: string }
  const routePath = getNestedRoutePath(params)
  return (routePath != null) ? [name, ...routePath] : [name]
}

const getActiveRoutePathInternal = (
  state: NavigationState | Route<string> | undefined,
  tempIndex = 0,
): string[] | undefined => {
  if (state != null && 'state' in state && state.state != null) {
    return getActiveRoutePathInternal(state.state as NavigationState, tempIndex)
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
    const nextPath = getActiveRoutePathInternal(state, tempIndex + 1)
    return (nextPath != null) ? [routes[tempIndex].name, ...nextPath] : [routes[tempIndex].name]
  } else if (type === 'tab' || type === 'stack') {
    const nextPath = getActiveRoutePathInternal(routes[index])
    return (nextPath != null) ? [routes[index].name, ...nextPath] : [routes[index].name]
  }
  return undefined
}

export const getActiveRoutePath = (state: NavigationState): string[] => {
  const routePath = getActiveRoutePathInternal(state)
  if (routePath == null) {
    throw new Error('Missing active route path.')
  }
  return routePath
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
    activeLeafRoute.params = {}
  }
  activeLeafRoute.params._conditionalNavigationState = resolveConditionsResult.conditionalNavigationState
  return onAction(resolveConditionsResult.navigationAction, ...restArgs)
}

export const getResolveConditionsResult = (
  action: NavigationAction,
  state: NavigationState,
  routePath: string[],
  screenConditionConfigMap: Record<string, ConditionConfig>,
  getContext: () => ResolveConditionContext,
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

const findStaticTreeScreenInternal = (
  tree: StaticTreeNavigator,
  routeName: string,
  isRoot = true,
): StaticTreeNode | undefined => {
  if (tree.routeName === routeName) {
    return tree
  }
  let foundScreen: StaticTreeNode | undefined
  if ('children' in tree) {
    for (const screen of tree.children) {
      if (screen.routeName === routeName) {
        foundScreen = screen
        break
      } else if ('children' in screen) {
        foundScreen = findStaticTreeScreenInternal(screen, routeName, false)
        if (foundScreen != null) {
          break
        }
      }
    }
  }
  return foundScreen
}

export const findStaticTreeScreen = (
  tree: StaticTreeNavigator,
  routeName: string,
): StaticTreeNode => {
  const foundScreen = findStaticTreeScreenInternal(tree, routeName)
  if (foundScreen == null) {
    throw new Error(`Missing static tree screen for route name: ${routeName}`)
  }
  return foundScreen
}

const getRouteNameByStateKeyInternal = (
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
      const routeName = getRouteNameByStateKeyInternal(route.state as NavigationState, stateKey, false)
      if (routeName != null) {
        return routeName
      }
    }
  }
}

export const getRouteNameByStateKey = (
  rootState: NavigationState,
  stateKey: string,
): string => {
  const routeName = getRouteNameByStateKeyInternal(rootState, stateKey)
  if (routeName == null) {
    throw new Error(`Missing route name for state key: ${stateKey}`)
  }
  return routeName
}

export const findStaticNavigatorByStateKey = (
  tree: StaticTreeNavigator,
  state: NavigationState,
  stateKey: string,
): StaticTreeNavigator => {
  let routeName: string
  try {
    routeName = getRouteNameByStateKey(state, stateKey)
  } catch (e) {
    log.debug('Missing route name for state key, using root navigator', { stateKey, state })
    routeName = ROOT_NAVIGATOR_ID
  }
  return findStaticTreeScreen(tree, routeName) as StaticTreeNavigator
}

const createParams = (path: string[], originalParams: Record<string, unknown> | undefined): Params | undefined => {
  if (path.length === 0) {
    return originalParams
  }
  const [routeName, ...restPath] = path
  if (restPath.length === 0) {
    return {
      screen: routeName,
      ...((originalParams != null) ? { params: originalParams } : {}),
    }
  }
  return {
    screen: routeName,
    params: createParams(restPath, originalParams),
  }
}

const createNavigateActionForPath = (path: string[], originalAction: NavigateNavigationAction): NavigateNavigationAction => {
  const [routeName, ...restPath] = path
  const nextParams = createParams(restPath, originalAction.payload?.params)
  return {
    type: 'NAVIGATE',
    payload: nextParams != null
      ? { name: routeName, params: nextParams }
      : { name: routeName },
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

export const getCommonStaticNavigatorWithPaths = ({
  currentStaticTreeScreen,
  finalStaticTreeScreen,
}: {
  currentStaticTreeScreen: StaticTreeNode,
  finalStaticTreeScreen: StaticTreeNode,
}): {
  commonStaticNavigator: StaticTreeNavigator,
  targetPathFromCommonNavigator: string[],
  sourcePathFromCommonNavigator: string[],
} => {
  let leftDepth = currentStaticTreeScreen.depth
  let rightDepth = finalStaticTreeScreen.depth
  let leftParent: StaticTreeNode = currentStaticTreeScreen
  let rightParent: StaticTreeNode = finalStaticTreeScreen
  const leftPath: string[] = [leftParent.routeName]
  const rightPath: string[] = [rightParent.routeName]
  const biggerDepth = Math.max(leftDepth, rightDepth)
  for (let i = biggerDepth; i > 0; i--) {
    if (leftDepth === i) {
      leftParent = is(leftParent.getParent())
    }
    if (rightDepth === i) {
      rightParent = is(rightParent.getParent())
    }
    if (leftParent?.routeName === rightParent?.routeName) {
      break
    }
    if (leftDepth === i) {
      leftPath.unshift(is(leftParent.routeName))
      leftDepth--
    }
    if (rightDepth === i) {
      rightPath.unshift(rightParent.routeName)
      rightDepth--
    }
  }

  return {
    commonStaticNavigator: leftParent as StaticTreeNavigator,
    targetPathFromCommonNavigator: rightPath,
    sourcePathFromCommonNavigator: leftPath,
  }
}

export const transformForNearestExistingNavigator = (
  action: NavigationAction,
  getRootState: () => NavigationState,
  tree: StaticTreeNavigator,
): NavigationAction => {
  if (
    (action.isTransformed ?? false) ||
    (action.type !== 'NAVIGATE')
  ) {
    return action
  }

  const navigationState = getRootState()
  const activeRouteName = getActiveLeafRoute(navigationState).name
  const targetRouteName = first(getRoutePathFromNavigateAction(action))

  if (activeRouteName === targetRouteName) {
    return action
  }
  const currentStaticTreeScreen = findStaticTreeScreen(tree, activeRouteName)
  const finalStaticTreeScreen = findStaticTreeScreen(tree, targetRouteName)
  if (currentStaticTreeScreen.getParent()?.id === finalStaticTreeScreen.getParent()?.id) {
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

  const nextAction = createNavigateActionForPath(targetPathFromCommonNavigator, action)

  log.debug('TRANSFORMED ACTION', {
    originalAction: action,
    nextAction,
  })

  return {
    ...nextAction,
    navigatorId: commonStaticNavigator.id,
    isTransformed: true,
    ...(clearUndefinedAttributes({
      skipConditionalNavigation: action.skipConditionalNavigation,
      flow: action.flow,
      reset: action.reset,
    })),
  }
}

const isStaticTreeNavigator = (node: StaticTreeNodeDeclaration): node is StaticTreeNavigatorDeclaration => (
  'children' in node
)

export const calculateStaticTreeDepth = (tree: StaticTreeNodeDeclaration, parent?: StaticTreeNavigator, depth = 0): StaticTreeNode => {
  if (isStaticTreeNavigator(tree)) {
    const { children, ...rest } = tree
    const nextTree: StaticTreeNavigator = {
      ...rest,
      children: [],
      getParent: () => parent,
      depth,
    }
    nextTree.children = children.map((screen) => (
      calculateStaticTreeDepth(screen, nextTree, depth + 1)
    ))
    return nextTree
  }
  return {
    ...tree,
    getParent: () => parent,
    depth,
  }
}
