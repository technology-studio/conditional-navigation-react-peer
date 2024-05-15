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
export { ConditionalActions } from './Navigation/ConditionalActions'
export { onActionFactory } from './Navigation/OnActionFactory'
export { backHandlerManager } from './Api/BackHandlerManager'
export {
  type ResolveCondition,
  conditionalNavigationManager,
  registerResolveCondition,
} from './Api/ConditionalNavigationManager'
export {
  calculateStaticTreeDepth,
  getActiveLeafRoute,
} from './Api/NavigationUtils'
export { useAndroidBackForCustomOnBack } from './Hooks/UseAndroidBackForCustomOnBack'
export { useIsInitial } from './Hooks/UseIsInitial'
export {
  useNavigation,
} from './Hooks/UseNavigation'
export { navigationParams } from './Screens'
