/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T14:11:71+01:00
 * @Copyright: Technology Studio
**/

import { CommonActions } from '@react-navigation/native'

import type {
  Condition,
  NavigatePayload,
  NavigationAction,
} from '../Model/Types'

export const ConditionalActions = {
  cancelFlow: (): NavigationAction => ({
    type: 'CANCEL_FLOW',
  }),
  finishFlowAndContinue: (): NavigationAction => ({
    type: 'FINISH_FLOW_AND_CONTINUE',
  }),
  navigate: (payload: NavigatePayload): NavigationAction => ({
    ...CommonActions.navigate({
      name: payload.routeName,
      params: payload.params,
    }) as NavigationAction,
    ...payload.options ?? {},
  }),
  requireConditions: (conditionList?: Condition[]): NavigationAction => ({
    type: 'REQUIRE_CONDITIONS',
    conditionList,
  }),
  validateConditions: (): NavigationAction => ({
    type: 'VALIDATE_CONDITIONS',
  }),
}
