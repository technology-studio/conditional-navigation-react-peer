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

const log = new Log('txo.conditional-navigation-react.Api.ConditionalNavigationManager')

export type ResolveCondition<CONDITION extends Condition> = (
  condition: CONDITION,
  navigationAction: NavigationAction,
  getContext: (() => ResolveConditionContext) | undefined,
) => NavigationAction | CommonActions.Action | undefined

class ConditionalNavigationManager {
  _conditionToResolveCondition: Record<string, ResolveCondition<Condition>>
  _logicalClock = 0

  constructor () {
    this._conditionToResolveCondition = {}
  }

  resolveConditions (
    conditionList: Condition[],
    navigationAction: NavigationAction,
    navigationState: NavigationState,
    getContext: (() => ResolveConditionContext) | undefined,
  ): ResolveConditionsResult | undefined {
    if (!configManager.config.ignoreConditionalNavigation) {
      log.debug('RESOLVE CONDITIONS', { conditionList, navigationAction })
      for (const condition of conditionList) {
        const resolveCondition: ResolveCondition<Condition> = this._conditionToResolveCondition[condition.key]
        if (resolveCondition != null) {
          const newNavigationAction = resolveCondition(condition, navigationAction, getContext) as NavigationAction | undefined
          if (newNavigationAction != null) {
            log.debug('NEW NAVIGATION ACTION', { preview: condition.key, newNavigationAction, navigationAction })
            return {
              navigationAction: {
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

  registerResolveCondition<CONDITION extends Condition = Condition>(conditionKey: string, resolveCondition: ResolveCondition<CONDITION>): () => void {
    this._conditionToResolveCondition[conditionKey] = resolveCondition as ResolveCondition<Condition>
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- TODO: check if this is correct
    return () => { delete this._conditionToResolveCondition[conditionKey] }
  }

  tickLogicalClock (): number {
    return ++this._logicalClock
  }
}

export const conditionalNavigationManager = new ConditionalNavigationManager()

export const registerResolveCondition = <CONDITION extends Condition = Condition>(
  conditionKey: string,
  resolveCondition: ResolveCondition<CONDITION>,
): () => void => conditionalNavigationManager.registerResolveCondition<CONDITION>(conditionKey, resolveCondition)
