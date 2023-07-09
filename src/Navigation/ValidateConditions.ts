/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import {
  getActiveRoutePath,
  onResolveConditionsResultAction,
  getResolveConditionsResult,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
  ValidateConditionsNavigationAction,
} from '../Model/Types'

export const onValidateConditionsAction = ({
  action,
  getContext,
  getRootState,
  originalOnAction,
  restArgs,
  screenConditionConfigMap,
}: OnActionAttributes<ValidateConditionsNavigationAction>): boolean => {
  const state = getRootState()
  const currentActiveScreenPath = getActiveRoutePath(state)
  const resolveConditionsResult = getResolveConditionsResult(
    action,
    state,
    currentActiveScreenPath,
    screenConditionConfigMap,
    getContext,
  )
  if (resolveConditionsResult != null) {
    return onResolveConditionsResultAction(
      state,
      originalOnAction,
      resolveConditionsResult,
      restArgs,
    )
  }
  return true
}
