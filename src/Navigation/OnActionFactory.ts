/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-28T09:10:38+02:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'
import { isNotEmptyString } from '@txo/functional'

import type {
  OnActionAttributes,
  NavigationAction,
  OnAction,
  OnActionFactoryAttributes,
  BackNavigationAction,
  CancelFlowNavigationAction,
  CloseNavigationAction,
  FinishFlowAndContinueNavigationAction,
  RequireConditionsNavigationAction,
  ValidateConditionsNavigationAction,
  NavigateNavigationAction,
  CustomActionHandler,
  StaticScreenTreeNavigatorWithDepth,
} from '../Model/Types'
import {
  findStaticNavigatorForStateKey,
  transformForNearestExistingNavigator,
} from '../Api/NavigationUtils'
import { configManager } from '../Config'

import { onBackAction } from './Back'
import {
  onCancelFlowAction,
  onFinishFlowAndContinueAction,
} from './Flow'
import { onCloseAction } from './Close'
import { onRequireConditionsAction } from './RequireConditions'
import { onValidateConditionsAction } from './ValidateConditions'
import { onNavigateAction } from './Navigate'

const log = new Log('txo.conditional-navigation-react.Navigation.onActionFactory')

const getHandlerWithPathFromParents = (staticScreenTreeNavigator: StaticScreenTreeNavigatorWithDepth, actionType: string): CustomActionHandler | undefined => {
  const handler = staticScreenTreeNavigator.handlerMap?.[actionType]
  if (handler != null) {
    return handler
  }
  const parent = staticScreenTreeNavigator.getParent()
  if (parent == null) {
    return undefined
  }
  return getHandlerWithPathFromParents(parent, actionType)
}

const onExplicitNavigatorAction = (onActionAttributes: OnActionAttributes<NavigationAction & { navigatorId?: string }>): boolean => {
  const {
    action,
    getState,
    getRootState,
    nextOnAction,
    parentNavigationHelpers,
    restArgs,
  } = onActionAttributes

  const { staticScreenTree } = configManager.config
  const rootState = getRootState()
  const navigatorState = getState()
  const isRootNavigator = navigatorState.key === rootState.key
  const staticNavigator = findStaticNavigatorForStateKey(staticScreenTree, rootState, navigatorState.key)
  const navigatorId = staticNavigator?.id
  const shouldConsumeAction = isNotEmptyString(action.navigatorId)
    ? navigatorId === action.navigatorId || isRootNavigator
    : true

  const handler: CustomActionHandler | undefined = staticNavigator != null
    ? getHandlerWithPathFromParents(staticNavigator, action.type)
    : undefined
  const handlerResult = handler?.()

  log.debug('ON EXPLICIT NAVIGATOR ACTION', {
    action,
    navigatorId,
    handlerResult,
    shouldConsumeAction,
    staticScreenTree,
  })

  if (shouldConsumeAction && action.navigatorId != null) {
    return false
  }
  if (
    handlerResult === undefined &&
    action.navigatorId != null &&
    action.navigatorId !== navigatorId
  ) {
    parentNavigationHelpers?.dispatch(action)
    return true
  }
  if (handler == null) {
    return false
  }
  if (handlerResult === null) {
    return true
  }
  if (handlerResult != null) {
    if (handlerResult.navigatorId !== navigatorId) {
      parentNavigationHelpers?.dispatch(handlerResult)
      return true
    }
    return nextOnAction(handlerResult, ...restArgs)
  }
  return false
}

export const onActionFactory = (originalOnAction: OnAction<NavigationAction>) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction<NavigationAction>>): boolean => {
  const {
    nextOnAction,
    screenConditionConfigMap,
    getContext,
    getState,
    getRootState,
    parentNavigationHelpers,
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
    nextOnAction: (action) => {
      const nextAction = transformForNearestExistingNavigator(
        action,
        getRootState,
        configManager.config.staticScreenTree,
      )
      log.debug('N: nextOnAction - transformed action', { nextAction, action })
      return nextOnAction(nextAction)
    },
    originalOnAction: (action, ...restArgs) => {
      const nextAction = transformForNearestExistingNavigator(
        action,
        getRootState,
        configManager.config.staticScreenTree,
      )
      log.debug('N: originalOnAction - transformed action', { nextAction, action })
      return nextAction !== action
        ? nextOnAction(nextAction)
        : originalOnAction(nextAction, ...restArgs)
    },
    parentNavigationHelpers,
    restArgs,
    router,
    routerConfigOptions,
    screenConditionConfigMap,
  } satisfies OnActionAttributes<NavigationAction>

  if (onExplicitNavigatorAction(onActionAttributes)) {
    return true
  }

  switch (action.type) {
    case 'CANCEL_FLOW':
      return onCancelFlowAction(onActionAttributes as OnActionAttributes<CancelFlowNavigationAction>)
    // NOTE: this is a fallback for when close is not handled by custom handler
    case 'CLOSE':
      return onCloseAction(onActionAttributes as OnActionAttributes<CloseNavigationAction>)
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
