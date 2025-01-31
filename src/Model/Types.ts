/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-07-17T03:01:48+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationProp,
  NavigationAction as RNNavigationAction,
  Route,
  Router,
  RouterConfigOptions,
} from '@react-navigation/native'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'
import type { NavigationState } from '@react-navigation/routers'
import type { RequiredKeys } from 'utility-types'

export type DefaultNavigationProp = NavigationProp<Record<string, unknown>, keyof Record<string, unknown>, string | undefined>
export type DefaultParamsMap = Record<string, Record<string, unknown> | undefined>

export type AbstractNavigationAction = RNNavigationAction & {
  isTransformed?: boolean,
  navigatorId?: string,
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

export type CloseNavigationAction = AbstractNavigationAction & {
  type: 'CLOSE',
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
  | CloseNavigationAction

// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- get first parameter - options
export type UseOnActionOptions = Parameters<typeof UseOnActionType>[0] & {
  router: Router<NavigationState, AbstractNavigationAction>,
}

export type OnAction<ACTION extends NavigationAction> = (action: ACTION, ...restArgs: unknown[]) => boolean

export type OnActionAttributes<ACTION extends NavigationAction> = {
  action: ACTION,
  getContext: () => ConditionContext,
  getState: UseOnActionOptions['getState'],
  getRootState: () => NavigationState,
  nextOnAction: OnAction<NavigationAction>,
  originalOnAction: OnAction<NavigationAction>,
  navigation: DefaultNavigationProp,
  restArgs: unknown[],
  router: Router<NavigationState, AbstractNavigationAction>,
  routerConfigOptions: RouterConfigOptions,
  screenConditionConfigMap: Record<string, ConditionConfig>,
  setState: UseOnActionOptions['setState'],
}

export type OnActionFactoryAttributes = {
  getContext: () => ConditionContext,
  getState: UseOnActionOptions['getState'],
  getRootState: () => NavigationState,
  nextOnAction: OnAction<NavigationAction>,
  navigation: DefaultNavigationProp,
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

export type ConditionsOrGetConditions = ((getContext: () => ConditionContext) => Condition[]) | Condition[]

export type ConditionConfig = {
  conditions?: ConditionsOrGetConditions,
  statusConditions?: ConditionsOrGetConditions,
}

export type Navigation<
NAVIGATION_PROP extends DefaultNavigationProp,
PARAMS_MAP extends DefaultParamsMap,
> = Omit<NAVIGATION_PROP, 'navigate'> & {
  cancelFlow: () => void,
  finishFlowAndContinue: () => void,
  navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => void,
  requireConditions: (conditionList: Condition[]) => void,
  validateConditions: () => void,
  goBack: (payload?: BackPayload) => void,
  getRoot: () => Navigation<NAVIGATION_PROP, PARAMS_MAP>,
}

export type NavigationProps<PARAMS extends Record<string, unknown>> = {
  route?: Route<string, PARAMS>,
}

export type WithConditionalNavigationState<
  TYPE,
  PARAMS extends Record<string, unknown> | undefined = Record<string, unknown> | undefined
> = Omit<TYPE, 'params'> & (
  undefined extends PARAMS
    ? { params?: PARAMS & { _conditionalNavigationState?: ConditionalNavigationState } }
    : { params: PARAMS & { _conditionalNavigationState?: ConditionalNavigationState } }
)

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- this is extended in the dependants
export interface ConditionContext {}

export type CustomActionHandler = () => (NavigationAction & { navigatorId: string }) | undefined | null

type StaticTreeNodeBaseDeclaration = {
  routeName: string,
}

export type StaticTreeNavigatorDeclaration = StaticTreeNodeBaseDeclaration & {
  type: 'NAVIGATOR',
  id: string,
  children: StaticTreeNodeDeclaration[],
  handlerMap?: Record<string, CustomActionHandler>,
}

type StaticTreeScreenDeclaration = StaticTreeNodeBaseDeclaration & {
  type: 'SCREEN',
}

export type StaticTreeNodeDeclaration = StaticTreeNavigatorDeclaration | StaticTreeScreenDeclaration

export type StaticTreeNavigator = Omit<StaticTreeNavigatorDeclaration, 'children'> & {
  children: StaticTreeNode[],
  depth: number,
  getParent: () => StaticTreeNavigator | undefined,
}

export type StaticTreeScreen = StaticTreeScreenDeclaration & {
  depth: number,
  getParent: () => StaticTreeNavigator | undefined,
}

export type StaticTreeNode = StaticTreeNavigator | StaticTreeScreen
