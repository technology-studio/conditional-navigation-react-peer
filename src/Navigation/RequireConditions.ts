/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import { getActiveLeafRoute } from '../Api/NavigationUtils'
import type { OnActionAttributes } from '../Model/Types'

export const onRequireConditionsAction = ({
  action,
  getState,
  nextOnAction,
  restArgs,
}: OnActionAttributes): boolean => {
  const { conditionList } = action
  const state = getState()
  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, state)
    if (resolveConditionsResult && state) {
      const activeLeafNavigationNode = getActiveLeafRoute(state)
      activeLeafNavigationNode.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
      return nextOnAction(resolveConditionsResult.navigationAction, ...restArgs)
    }
  }
  return true
}
