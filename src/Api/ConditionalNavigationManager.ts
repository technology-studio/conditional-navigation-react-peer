/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-14T17:58:32+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'
import type {
  CommonActions,
  NavigationState,
} from '@react-navigation/native'

import { configManager } from '../Config'
import type {
  Condition,
  NavigationAction,
  ResolveConditionContext,
  ResolveConditionsResult,
} from '../Model/Types'

import { cloneState } from './StateHelper'

const log = new Log('txo.react-conditional-navigation.Api.ConditionalNavigationManager')

export type ResolveCondition<CONDITION extends Condition> = (
  condition: CONDITION,
  navigationAction: NavigationAction,
  getContext: (() => ResolveConditionContext) | undefined,
) => NavigationAction | CommonActions.Action | undefined

class ConditionalNavigationManager<CONDITION extends Condition> {
  _conditionToResolveCondition: Record<string, ResolveCondition<CONDITION>>
  _logicalClock = 0

  constructor () {
    this._conditionToResolveCondition = {}
  }

  resolveConditions (
    conditionList: CONDITION[],
    navigationAction: NavigationAction,
    navigationState: NavigationState,
    getContext: (() => ResolveConditionContext) | undefined,
  ): ResolveConditionsResult | undefined {
    if (!configManager.config.ignoreConditionalNavigation) {
      log.debug('RESOLVE CONDITIONS', { conditionList, navigationAction })
      for (const condition of conditionList) {
        const resolveCondition: ResolveCondition<CONDITION> = this._conditionToResolveCondition[condition.key]
        if (resolveCondition != null) {
          const newNavigationAction = resolveCondition(condition, navigationAction, getContext) as NavigationAction | undefined
          if (newNavigationAction != null) {
            log.debug('NEW NAVIGATION ACTION', { preview: condition.key, newNavigationAction, navigationAction })
            return {
              navigationAction: {
                // NOTE: spread previous navigation action to keep react-navigation specific properties (e.g. source, target)
                ...navigationAction,
                payload: undefined,
                ...newNavigationAction,
              },
              conditionalNavigationState: {
                condition,
                postponedAction: navigationAction,
                logicalTimestamp: this.tickLogicalClock(),
                previousState: cloneState(navigationState),
              },
            }
          }
        }
      }
    }
  }

  registerResolveCondition (conditionKey: string, resolveCondition: ResolveCondition<CONDITION>): () => void {
    this._conditionToResolveCondition[conditionKey] = resolveCondition
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- TODO: check if this is correct
    return () => { delete this._conditionToResolveCondition[conditionKey] }
  }

  tickLogicalClock (): number {
    return ++this._logicalClock
  }
}

export const conditionalNavigationManager = new ConditionalNavigationManager<Condition>()

export const registerResolveCondition = (
  conditionKey: string,
  resolveCondition: ResolveCondition<Condition>,
): () => void => conditionalNavigationManager.registerResolveCondition(conditionKey, resolveCondition)
