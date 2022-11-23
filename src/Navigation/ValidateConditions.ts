/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import {
  getActiveLeafRoute,
  getActiveRoutePath,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
  ResolveConditionsResult,
} from '../Model/Types'

export const onValidateConditionsAction = ({
  action,
  getState,
  originalOnAction,
  restArgs,
  screenConditionsMap,
}: OnActionAttributes): boolean => {
  const state = getState()
  const currentActiveScreenPath = getActiveRoutePath(state) ?? []
  if (state) {
    let resolveConditionsResult: ResolveConditionsResult | undefined
    for (const routeName of currentActiveScreenPath) {
      const screenConditions = screenConditionsMap[routeName]
      if (screenConditions && screenConditions.length > 0) {
        resolveConditionsResult = conditionalNavigationManager.resolveConditions(screenConditions, action, state)
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
