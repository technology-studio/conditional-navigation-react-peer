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

export type AbstractNavigationAction = RNNavigationAction & {
  payload?: Record<string, unknown> & {
    name?: string,
    params?: Record<string, unknown>,
  },
}

export type RequireConditionsNavigationAction = AbstractNavigationAction & {
  type: 'REQUIRE_CONDITIONS',
  conditionList: Condition[],
}

export type NavigateNavigationAction = AbstractNavigationAction & {
  type: 'NAVIGATE',
  flow?: boolean,
  reset?: boolean,
  skipConditionalNavigation?: boolean,
}

export type BackNavigationAction = AbstractNavigationAction & {
  type: 'BACK',
  count?: number,
}

export type FinishFlowAndContinueNavigationAction = AbstractNavigationAction & {
  type: 'FINISH_FLOW_AND_CONTINUE',
}

export type CancelFlowNavigationAction = AbstractNavigationAction & {
  type: 'CANCEL_FLOW',
}

export type ValidateConditionsNavigationAction = AbstractNavigationAction & {
  type: 'VALIDATE_CONDITIONS',
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

export type NavigationAction = | RequireConditionsNavigationAction
| NavigateNavigationAction
| BackNavigationAction
| FinishFlowAndContinueNavigationAction
| CancelFlowNavigationAction
| ValidateConditionsNavigationAction

export type UseOnActionOptions = Parameters<typeof UseOnActionType>[0] & {
  router: Router<NavigationState, AbstractNavigationAction>,
}

export type OnAction<ACTION extends NavigationAction> = (action: ACTION, ...restArgs: unknown[]) => boolean

export type OnActionAttributes<ACTION extends NavigationAction> = {
  action: ACTION,
  getContext: (() => ResolveConditionContext) | undefined,
  getState: UseOnActionOptions['getState'],
  getRootState: () => NavigationState,
  nextOnAction: OnAction<NavigationAction>,
  originalOnAction: OnAction<NavigationAction>,
  restArgs: unknown[],
  router: Router<NavigationState, AbstractNavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionConfigMap: Record<string, ConditionConfig>,
  setState: UseOnActionOptions['setState'],
}

export type OnActionFactoryAttributes = {
  getContext: (() => ResolveConditionContext) | undefined,
  getState: UseOnActionOptions['getState'],
  getRootState: () => NavigationState,
  nextOnAction: OnAction<NavigationAction>,
  router: Router<NavigationState, AbstractNavigationAction>,
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

export type BackPayload = {
  count: number,
}

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
