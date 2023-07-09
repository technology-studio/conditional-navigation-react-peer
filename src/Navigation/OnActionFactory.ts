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
  StaticTreeNavigator,
} from '../Model/Types'
import {
  findStaticNavigatorByStateKey,
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

const getHandlerResultWithPathFromParents = (staticTreeNavigator: StaticTreeNavigator, actionType: string): (NavigationAction & { navigatorId: string }) | undefined | null => {
  const handler = staticTreeNavigator.handlerMap?.[actionType]
  if (handler != null) {
    const handlerResult = handler()
    if (handlerResult !== undefined) {
      return handlerResult
    }
  }
  const parent = staticTreeNavigator.getParent()
  if (parent == null) {
    return undefined
  }
  return getHandlerResultWithPathFromParents(parent, actionType)
}

const getCurrentStaticTreeNavigator = (
  onActionAttributes: OnActionAttributes<NavigationAction>,
): StaticTreeNavigator => {
  const {
    getState,
    getRootState,
  } = onActionAttributes
  const { staticScreenTree } = configManager.config
  const rootState = getRootState()
  const navigatorState = getState()
  return findStaticNavigatorByStateKey(staticScreenTree, rootState, navigatorState.key)
}

const onExplicitNavigatorAction = (
  currentStaticTreeNavigator: StaticTreeNavigator,
  onActionAttributes: OnActionAttributes<NavigationAction & { navigatorId?: string }>,
): boolean => {
  const {
    action,
    nextOnAction,
    navigation,
    restArgs,
  } = onActionAttributes

  log.debug('ON EXPLICIT NAVIGATOR ACTION', {
    action,
    currentStaticTreeNavigator,
  })

  const handlerResult = getHandlerResultWithPathFromParents(currentStaticTreeNavigator, action.type)
  if (handlerResult === null) {
    return true
  }
  if (handlerResult != null) {
    if (handlerResult.navigatorId !== currentStaticTreeNavigator.id) {
      navigation.dispatch(handlerResult)
      return true
    }
    return nextOnAction(handlerResult, ...restArgs)
  }
  return false
}

const isActionForAnotherNavigator = (
  currentStaticTreeNavigator: StaticTreeNavigator,
  action: NavigationAction,
): boolean => (
  isNotEmptyString(action.navigatorId) && currentStaticTreeNavigator.id !== action.navigatorId
)

export const onActionFactory = (originalOnAction: OnAction<NavigationAction>) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction<NavigationAction>>): boolean => {
  const {
    nextOnAction,
    screenConditionConfigMap,
    getContext,
    getState,
    getRootState,
    navigation,
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
    navigation,
    restArgs,
    router,
    routerConfigOptions,
    screenConditionConfigMap,
  } satisfies OnActionAttributes<NavigationAction>

  const currentStaticTreeNavigator = getCurrentStaticTreeNavigator(onActionAttributes)

  if (isActionForAnotherNavigator(currentStaticTreeNavigator, action)) {
    return false
  }

  if (onExplicitNavigatorAction(currentStaticTreeNavigator, onActionAttributes)) {
    return true
  }

  let onActionResult

  switch (action.type) {
    case 'CANCEL_FLOW':
      onActionResult = onCancelFlowAction(onActionAttributes as OnActionAttributes<CancelFlowNavigationAction>)
      break
    // NOTE: this is a fallback for when close is not handled by custom handler
    case 'CLOSE':
      onActionResult = onCloseAction(onActionAttributes as OnActionAttributes<CloseNavigationAction>)
      break
    case 'FINISH_FLOW_AND_CONTINUE':
      onActionResult = onFinishFlowAndContinueAction(onActionAttributes as OnActionAttributes<FinishFlowAndContinueNavigationAction>)
      break
    case 'BACK':
      onActionResult = onBackAction(onActionAttributes as OnActionAttributes<BackNavigationAction>)
      break
    case 'NAVIGATE':
      onActionResult = onNavigateAction(onActionAttributes as OnActionAttributes<NavigateNavigationAction>)
      break
    case 'REQUIRE_CONDITIONS':
      onActionResult = onRequireConditionsAction(onActionAttributes as OnActionAttributes<RequireConditionsNavigationAction>)
      break
    case 'VALIDATE_CONDITIONS':
      onActionResult = onValidateConditionsAction(onActionAttributes as OnActionAttributes<ValidateConditionsNavigationAction>)
      break
    default:
      onActionResult = originalOnAction(...args)
  }

  if (!onActionResult && action.navigatorId === currentStaticTreeNavigator.id) {
    throw new Error(`Fallbacking action ${action.type} forced to current navigator ${action.navigatorId} should never happen`)
  }

  return onActionResult
}
