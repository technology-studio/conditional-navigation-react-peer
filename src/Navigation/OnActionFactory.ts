/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-28T09:10:38+02:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'

import {
  OnActionAttributes,
  NavigationAction,
} from '../Model/Types'
import type {
  OnAction,
  OnActionFactoryAttributes,
  BackNavigationAction,
  CancelFlowNavigationAction,
  FinishFlowAndContinueNavigationAction,
  RequireConditionsNavigationAction,
  ValidateConditionsNavigationAction,
  NavigateNavigationAction,
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

export const onActionFactory = (originalOnAction: OnAction<NavigationAction>) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction<NavigationAction>>): boolean => {
  const {
    nextOnAction,
    screenConditionConfigMap,
    getContext,
    getState,
    getRootState,
    setState,
    router,
    routerConfigOptions,
  } = attributes
  const [action, ...restArgs] = args

  log.debug('N: onAction', { screenConditionConfigMap, action })
  const onActionAttributes = {
    action,
    getContext,
    getState,
    getRootState,
    setState,
    nextOnAction,
    originalOnAction,
    restArgs,
    router,
    routerConfigOptions,
    screenConditionConfigMap,
  } satisfies OnActionAttributes<NavigationAction>

  switch (action.type) {
    case 'CANCEL_FLOW':
      return onCancelFlowAction(onActionAttributes as OnActionAttributes<CancelFlowNavigationAction>)
    case 'FINISH_FLOW_AND_CONTINUE':
      return onFinishFlowAndContinueAction(onActionAttributes as OnActionAttributes<FinishFlowAndContinueNavigationAction>)
    case 'BACK':
      return onBackAction(onActionAttributes as OnActionAttributes<BackNavigationAction>)
    case 'NAVIGATE':
      return onNavigateAction(onActionAttributes as OnActionAttributes<NavigateNavigationAction>)
    case 'REQUIRE_CONDITIONS':
      return onRequireConditionsAction(onActionAttributes as OnActionAttributes<RequireConditionsNavigationAction>)
    case 'VALIDATE_CONDITIONS':
      return onValidateConditionsAction(onActionAttributes as OnActionAttributes<ValidateConditionsNavigationAction>)
    default:
      return originalOnAction(...args)
  }
}
