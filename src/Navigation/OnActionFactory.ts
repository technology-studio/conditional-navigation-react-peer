/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-28T09:10:38+02:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'

import type {
  OnActionAttributes,
  OnAction,
  OnActionFactoryAttributes,
} from '../Model/Types'

import { onBackAction } from './Back'
import {
  onCancelFlowAction,
  onFinishFlowAndContinueAction,
} from './Flow'
import { onRequireConditionsAction } from './RequireConditions'
import { onValidateConditionsAction } from './ValidateConditions'
import { onNavigateAction } from './Navigate'

const log = new Log('txo.react-conditional-navigation.Navigation.onActionFactory')

export const onActionFactory = (originalOnAction: OnAction) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction>): boolean => {
  const {
    nextOnAction,
    screenConditionsMap,
    getState,
    setState,
    router,
    routerConfigOptions,
  } = attributes
  const [action, ...restArgs] = args

  const { type } = action ?? {}
  log.debug('N: onAction', { screenConditionsMap, action })
  const onActionAttributes: OnActionAttributes = { action, getState, setState, nextOnAction, originalOnAction, restArgs, router, routerConfigOptions, screenConditionsMap }
  const onActionMap = {
    CANCEL_FLOW: onCancelFlowAction,
    FINISH_FLOW_AND_CONTINUE: onFinishFlowAndContinueAction,
    GO_BACK: onBackAction,
    NAVIGATE: onNavigateAction,
    REQUIRE_CONDITIONS: onRequireConditionsAction,
    VALIDATE_CONDITIONS: onValidateConditionsAction,
  }

  const onAction = type in onActionMap ? onActionMap[type as keyof typeof onActionMap] : undefined
  return onAction ? onAction(onActionAttributes) : originalOnAction(...args)
}
