/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-10-18T17:23:43+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 */

export {
  registerScreenConditions,
  screenConditionConfigMap,
} from './Api/ConditionManager'
export { configManager } from './Config'
export { registerOnActionFactory } from './Containers/ReactNavigationInjection'
export {
  InjectedNavigationContainer,
  navigationRef,
} from './Containers/InjectedNavigationContainer'
export { ROOT_NAVIGATOR_ID } from './Model'
export * from './Model/Types'
// import { navigationManager } from './Api/NavigationManager'
// import { isInitialNavigationOptions } from './Api/NavigationOptionsHelper'
// import type { NavigationProps } from './Screens/Types'
// import {
//   navigationParams,
// } from './Screens'
// import {
//   type NavigatePayload,
//   type NavigationAction,
//   type NavigationAllAction,
//   type NavigationBackAction,
//   type NavigationCancelFlowAction,
//   type NavigationFinishFlowAndContinueAction,
//   type NavigationNavigateAction,
//   type NavigationRequireConditionsAction,
//   type NavigationSetParamsAction,
//   type NavigationValidateConditionsAction,
//   types as navigationTypes,
// } from './Redux/Types/NavigationReduxTypes'
// import { creators as navigationActionCreators } from './Redux/NavigationRedux'
// import type {
//   Condition,
//   NavigatorType,
// } from './Model/Types'
// import { navigatorTypes } from './Model/Types'
// import {
//   combineReducers,
//   createNavigationMiddleware,
//   createNavigationReducer,
// } from './Redux'
// import type {
//   RootStateFragment,
//   State as NavigationState,
// } from './Redux/Types'
export { ConditionalActions } from './Navigation/ConditionalActions'
export { onActionFactory } from './Navigation/OnActionFactory'
export { backHandlerManager } from './Api/BackHandlerManager'
export {
  type ResolveCondition,
  conditionalNavigationManager,
  registerResolveCondition,
} from './Api/ConditionalNavigationManager'
export { calculateStaticTreeDepth } from './Api/NavigationUtils'
export { useIsInitial } from './Hooks/UseIsInitial'
export {
  type Navigation,
  useNavigation,
} from './Hooks/UseNavigation'
export { navigationParams } from './Screens'

// export {
//   combineReducers,
//   conditionalNavigationManager,
//   configManager,
//   createNavigationMiddleware,
//   createNavigationReducer,
//   isInitialNavigationOptions,
//   navigationActionCreators,
//   navigationManager,
//   navigationParams,
//   navigationTypes,
//   navigatorTypes,
//   registerResolveCondition,
// }

// export type {
//   Condition,
//   NavigatePayload,
//   NavigationAction,
//   NavigationAllAction,
//   NavigationBackAction,
//   NavigationCancelFlowAction,
//   NavigationFinishFlowAndContinueAction,
//   NavigationNavigateAction,
//   NavigationProps,
//   NavigationRequireConditionsAction,
//   NavigationSetParamsAction,
//   NavigationState,
//   NavigationValidateConditionsAction,
//   NavigatorType,
//   ResolveCondition,
//   RootStateFragment,
// }
