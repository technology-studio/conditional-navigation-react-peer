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
import type { RequiredKeys } from 'utility-types'

export type NavigationAction = RNNavigationAction & {
  payload?: Record<string, unknown> & {
    name?: string,
    params?: Record<string, unknown>,
  },
  // requireConditions
  conditionList?: Condition[],
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
  getContext: (() => ResolveConditionContext) | undefined,
  getState: UseOnActionOptions['getState'],
  getRootState: () => NavigationState,
  nextOnAction: OnAction,
  originalOnAction: OnAction,
  restArgs: RestArgs,
  router: Router<NavigationState, NavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionConfigMap: Record<string, ConditionConfig>,
  setState: UseOnActionOptions['setState'],
}

export type OnActionFactoryAttributes = {
  getContext: (() => ResolveConditionContext) | undefined,
  getState: UseOnActionOptions['getState'],
  getRootState: () => NavigationState,
  nextOnAction: OnAction,
  router: Router<NavigationState, NavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionConfigMap: Record<string, ConditionConfig>,
  setState: UseOnActionOptions['setState'],
}

type NavigatePayloadOptions = {
  flow?: boolean,
  reset?: boolean,
  skipConditionalNavigation?: boolean,
}

export type NavigatePayload<PARAMS_MAP, ROUTE_NAME extends keyof PARAMS_MAP = keyof PARAMS_MAP> = ROUTE_NAME extends keyof PARAMS_MAP
  ? RequiredKeys<PARAMS_MAP[ROUTE_NAME]> extends never
    ? {
        routeName: ROUTE_NAME,
        params?: PARAMS_MAP[ROUTE_NAME],
        options?: NavigatePayloadOptions,
      } | {
        routeName: string,
        params: { screen: ROUTE_NAME, params?: PARAMS_MAP[ROUTE_NAME] },
        options?: NavigatePayloadOptions,
      } | {
        routeName: string,
        params: {
          screen: string,
          params: { screen: ROUTE_NAME, params?: PARAMS_MAP[ROUTE_NAME] },
        },
        options?: NavigatePayloadOptions,
      }
    : {
        routeName: ROUTE_NAME,
        params: PARAMS_MAP[ROUTE_NAME],
        options?: NavigatePayloadOptions,
      } | {
        routeName: string,
        params: { screen: ROUTE_NAME, params: PARAMS_MAP[ROUTE_NAME] },
        options?: NavigatePayloadOptions,
      } | {
        routeName: string,
        params: {
          screen: string,
          params: { screen: ROUTE_NAME, params: PARAMS_MAP[ROUTE_NAME] },
        },
        options?: NavigatePayloadOptions,
      }
  : never

export type ConditionConfig = {
  conditions?: (() => Condition[]) | Condition[],
  statusConditions?: (() => Condition[]) | Condition[],
}

export type NavigationProps<PARAMS extends Record<string, unknown>> = {
  route?: Route<string, PARAMS>,
}

export type WithConditionalNavigationState<TYPE> = TYPE & {
  conditionalNavigation?: ConditionalNavigationState,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResolveConditionContext {}
