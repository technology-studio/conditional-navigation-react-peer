/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationAction as RNNavigationAction,
  Route,
  Router,
  RouterConfigOptions,
} from '@react-navigation/native'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'
import type { NavigationState } from '@react-navigation/routers'
import type { DefaultRootState } from '@txo-peer-dep/redux'

export type NavigationAction = RNNavigationAction & {
  conditionList?: Condition[],
  payload?: Record<string, unknown> & {
    params?: Record<string, unknown>,
  },
  // navigate
  flow?: boolean,
  reset?: boolean,
  skipConditionalNavigation?: boolean,
  // back
  backToRouteName?: boolean,
  count?: number,
  key?: string,
  routeName?: string,
}

export type ConditionalNavigationState = {
  condition: Condition,
  logicalTimestamp: number,
  postponedAction: NavigationAction | null,
  previousState: NavigationState,
}

export type ResolveConditionsResult = {
  navigationAction: NavigationAction,
  conditionalNavigationState: ConditionalNavigationState,
}

export type Condition = {
  key: string,
}

export enum NavigatorType {
  STACK = 'STACK',
  TAB = 'TAB',
}

declare module '@react-navigation/routers' {
  export interface NavigationLeafRoute {
    conditionalNavigation?: ConditionalNavigationState,
  }
}

export type UseOnActionOptions = Parameters<typeof UseOnActionType>[0] & {
  router: Router<NavigationState, NavigationAction>,
}
export type OnAction = (action: NavigationAction, visitedNavigators?: Set<string>) => boolean
type RestArgs = Parameters<OnAction> extends [Parameters<OnAction>[0], ...infer R] ? R : never

export type OnActionAttributes = {
  action: NavigationAction,
  getState: UseOnActionOptions['getState'],
  nextOnAction: OnAction,
  originalOnAction: OnAction,
  restArgs: RestArgs,
  router: Router<NavigationState, NavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionConfigMap: Record<string, ConditionConfig>,
  setState: UseOnActionOptions['setState'],
}

export type OnActionFactoryAttributes = {
  getState: UseOnActionOptions['getState'],
  nextOnAction: OnAction,
  router: Router<NavigationState, NavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionConfigMap: Record<string, ConditionConfig>,
  setState: UseOnActionOptions['setState'],
}

export type NavigatePayload = {
  routeName: string,
  params?: Record<string, unknown>,
  options?: {
    flow?: boolean,
    reset?: boolean,
    skipConditionalNavigation?: boolean,
  },
}

export type ConditionConfig = {
  conditions?: ((state: DefaultRootState) => Condition[]) | Condition[],
  statusConditions?: ((state: DefaultRootState) => Condition[]) | Condition[],
}

export type NavigationProps<PARAMS extends Record<string, unknown>> = {
  route?: Route<string, PARAMS>,
}

export type WithConditionalNavigationState<TYPE> = TYPE & {
  conditionalNavigation?: ConditionalNavigationState,
}
