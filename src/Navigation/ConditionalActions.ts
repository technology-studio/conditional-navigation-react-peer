/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T14:11:71+01:00
 * @Copyright: Technology Studio
**/

import {
  CommonActions,
} from '@react-navigation/native'

import type {
  BackPayload,
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
  navigate: <
    PARAMS_MAP extends Record<string, Record<string, unknown> | undefined>,
    ROUTE_NAME extends keyof PARAMS_MAP = keyof PARAMS_MAP
  >(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>): NavigationAction => ({
    ...CommonActions.navigate({
      name: payload.routeName as string,
      params: 'params' in payload ? payload.params : undefined,
    }) as NavigationAction,
    ...payload.options ?? {},
  }),
  goBack: (payload?: BackPayload): NavigationAction => ({
    ...CommonActions.goBack() as NavigationAction,
    ...payload ?? {},
  }),
}
