/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T12:11:73+01:00
 * @Copyright: Technology Studio
**/

import type {
  NavigationState,
} from '@react-navigation/native'
import { Log } from '@txo/log'

import type {
  OnActionAttributes,
  ConditionalNavigationState,
  WithConditionalNavigationState,
} from '../Model/Types'

const log = new Log('txo.react-conditional-navigation.Navigation.Flow')

const findLatestConditionNavigationState = (
  routes: NavigationState['routes'],
): ConditionalNavigationState | undefined => routes.reduce<{
  latestConditionalNavigation: ConditionalNavigationState | undefined,
  latestLogicalTimestamp: number,
}>(({ latestConditionalNavigation, latestLogicalTimestamp }, route) => {
  const conditionalNavigation: ConditionalNavigationState | undefined = (route as WithConditionalNavigationState<typeof route>).conditionalNavigation
  if (conditionalNavigation) {
    const { logicalTimestamp } = conditionalNavigation
    log.debug('findLatest', { conditionalNavigation, logicalTimestamp, latestLogicalTimestamp, latestConditionalNavigation })
    if (logicalTimestamp > latestLogicalTimestamp) {
      return {
        latestConditionalNavigation: conditionalNavigation,
        latestLogicalTimestamp: logicalTimestamp,
      }
    }
  }
  return {
    latestConditionalNavigation,
    latestLogicalTimestamp,
  }
}, { latestConditionalNavigation: undefined, latestLogicalTimestamp: 0 }).latestConditionalNavigation

export const abstractOnFlowActionFactory = (type: 'CANCEL_FLOW' | 'FINISH_FLOW_AND_CONTINUE') => ({
  getState,
  nextOnAction,
  restArgs,
  setState,
}: OnActionAttributes): boolean => {
  const state = getState()
  if (state?.routes) {
    const { previousState, postponedAction } = findLatestConditionNavigationState(state.routes) ?? {}
    log.debug(`${type}: onAction - abstractOnFlowActionFactory`, { type, previousState, state })
    if (previousState) {
      setState(previousState)
      return type === 'FINISH_FLOW_AND_CONTINUE'
        ? postponedAction ? nextOnAction(postponedAction, ...restArgs) : true
        : true
    }
  }
  return false
}

export const onCancelFlowAction = abstractOnFlowActionFactory('CANCEL_FLOW')

// TODO: if the coresponding conditional navigation state was destroyed, we shouldn't pick the one before
// we can solve it in the future by creating clockTimestampHistory array and we will be popping the last one and trying to find conditional navigation state with the same clockTimestamp
export const onFinishFlowAndContinueAction = abstractOnFlowActionFactory('FINISH_FLOW_AND_CONTINUE')
