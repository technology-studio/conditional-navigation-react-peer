/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import {
  getActiveRoutePath,
  onResolveConditionsResultAction,
  getScreenNavigationConditions,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
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
    for (const routeName of currentActiveScreenPath) {
      const screenConditions = getScreenNavigationConditions(screenConditionConfigMap[routeName])
      if (screenConditions && screenConditions.length > 0) {
        const resolveConditionsResult = conditionalNavigationManager.resolveConditions(screenConditions, action, state, getContext)
        if (resolveConditionsResult) {
          return onResolveConditionsResultAction(
            state,
            originalOnAction,
            resolveConditionsResult,
            restArgs,
          )
        }
      }
    }
  }
  return true
}
