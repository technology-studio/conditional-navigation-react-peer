/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import {
  onResolveConditionsResultAction,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
  RequireConditionsNavigationAction,
} from '../Model/Types'

export const onRequireConditionsAction = ({
  action,
  getContext,
  getRootState,
  nextOnAction,
  restArgs,
}: OnActionAttributes<RequireConditionsNavigationAction>): boolean => {
  const { conditionList } = action
  const state = getRootState()
  if (conditionList != null) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, state, getContext)
    if (resolveConditionsResult != null) {
      return onResolveConditionsResultAction(
        state,
        nextOnAction,
        resolveConditionsResult,
        restArgs,
      )
    }
  }
  return true
}
