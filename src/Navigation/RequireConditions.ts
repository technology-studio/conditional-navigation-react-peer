/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import {
  getAndCallConditionResultAction,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
  RequireConditionsNavigationAction,
} from '../Model/Types'

export const onRequireConditionsAction = ({
  action,
  getContext,
  getState,
  nextOnAction,
  restArgs,
}: OnActionAttributes<RequireConditionsNavigationAction>): boolean => {
  const { conditionList } = action
  const state = getState()
  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, state, getContext)
    if (resolveConditionsResult && state) {
      return getAndCallConditionResultAction(
        state,
        nextOnAction,
        resolveConditionsResult,
        restArgs,
      )
    }
  }
  return true
}
