/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import {
  getActiveLeafRoute,
  getActiveRoutePath,
  getScreenNavigationConditions,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
  ResolveConditionsResult,
  ValidateConditionsNavigationAction,
} from '../Model/Types'

export const onValidateConditionsAction = ({
  action,
  getContext,
  getState,
  originalOnAction,
  restArgs,
  screenConditionConfigMap,
}: OnActionAttributes<ValidateConditionsNavigationAction>): boolean => {
  const state = getState()
  const currentActiveScreenPath = getActiveRoutePath(state) ?? []
  if (state) {
    let resolveConditionsResult: ResolveConditionsResult | undefined
    for (const routeName of currentActiveScreenPath) {
      const screenConditions = getScreenNavigationConditions(screenConditionConfigMap[routeName])
      if (screenConditions && screenConditions.length > 0) {
        resolveConditionsResult = conditionalNavigationManager.resolveConditions(screenConditions, action, state, getContext)
      }
    }
    if (resolveConditionsResult) {
      const activeLeafRoute = getActiveLeafRoute(state)
      activeLeafRoute.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
      return originalOnAction(resolveConditionsResult.navigationAction, ...restArgs)
    }
  }
  return true
}
