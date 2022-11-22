/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-02T14:11:60+01:00
 * @Copyright: Technology Studio
**/

import { last } from '@txo/functional'
import { Log } from '@txo/log'

import {
  conditionalNavigationManager,
} from '../Api/ConditionalNavigationManager'
import type {
  OnActionAttributes,
  Condition,
} from '../Model/Types'
import {
  getActiveLeafNavigationNode,
  getActiveScreenPath,
  getExistingNavigationNodeByRouteName,
  getNavigationPathFromAction,
} from '../Api/NavigationUtils'

const log = new Log('txo.react-conditional-navigation.Navigation.Navigate')

const VOID = 'void'

export const onNavigateAction = ({
  action,
  getState,
  nextOnAction,
  originalOnAction,
  restArgs,
  screenConditionsMap,
  setState,
}: OnActionAttributes): boolean => {
  const {
    payload,
  } = action
  const {
    flow,
    reset,
    skipConditionalNavigation,
  } = payload?.params ?? {}
  const state = getState()

  const currentActiveScreenPath = getActiveScreenPath(state)
  const desiredScreenPath = [
    ...currentActiveScreenPath ?? [],
    ...getNavigationPathFromAction(action) ?? [],
  ]
  const finalScreenName = last(desiredScreenPath)

  log.debug('NAVIGATE', { action, state, currentActiveScreenPath })
  if (!skipConditionalNavigation) {
    const conditions = desiredScreenPath?.reduce<Condition[] | undefined>((conditions, screenName) => {
      const screenConditions = screenConditionsMap[screenName]
      return screenConditions?.length > 0 && !conditions
        ? screenConditions
        : conditions
    }, undefined)
    if (conditions && state) {
      const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditions, action, state)
      log.debug('N: RESOLVE CONDITIONS RESULT', { conditions, resolveConditionsResult, action, _conditionToResolveCondition: conditionalNavigationManager._conditionToResolveCondition })
      if (resolveConditionsResult && state) {
        const activeLeafNavigationNode = getActiveLeafNavigationNode(state)
        activeLeafNavigationNode.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
        return nextOnAction(resolveConditionsResult.navigationAction, ...restArgs)
      }
    }
  }

  if (reset) {
    log.debug('NAVIGATE WITH RESET')
    const { reset, ...paramsWithoutReset } = payload?.params ?? {}
    const newState = {
      index: 0,
      routes: [
        { name: finalScreenName, params: paramsWithoutReset },
      ],
    }
    setState(newState)
    return true
  }

  if (flow) {
    const route = state && typeof state.index === 'number' ? state.routes[state.index] : undefined
    if (route) {
      route.conditionalNavigation = {
        condition: { key: VOID },
        postponedAction: null,
        logicalTimestamp: conditionalNavigationManager.getAndIncrementLogicalClock(),
        previousState: JSON.parse(JSON.stringify(state)),
      }
    }
  }

  const destinationNode = getExistingNavigationNodeByRouteName(state, finalScreenName)
  if (destinationNode?.conditionalNavigation) {
    destinationNode.conditionalNavigation = undefined
  }

  return originalOnAction(action, ...restArgs)
}