/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-14T17:58:32+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'
import type {
  NavigationState,
} from '@react-navigation/native'

import { configManager } from '../Config'
import type {
  Condition,
  NavigationAction,
  ResolveConditionsResult,
} from '../Model/Types'

const log = new Log('txo.react-conditional-navigation.Api.ConditionalNavigationManager')

export type ResolveCondition<CONDITION extends Condition, ROOT_STATE extends NavigationState> = (
  condition: CONDITION,
  navigationAction: NavigationAction,
  rootState: ROOT_STATE,
) => NavigationAction | undefined

class ConditionalNavigationManager<CONDITION extends Condition, ROOT_STATE extends NavigationState> {
  _conditionToResolveCondition: Record<string, ResolveCondition<CONDITION, ROOT_STATE>>
  _logicalClock = 0

  constructor () {
    this._conditionToResolveCondition = {}
  }

  resolveConditions (conditionList: CONDITION[], navigationAction: NavigationAction, rootState: ROOT_STATE): ResolveConditionsResult | undefined {
    if (!configManager.config.ignoreConditionalNavigation) {
      log.debug('RESOLVE CONDITIONS', { conditionList, navigationAction })
      for (const condition of conditionList) {
        const resolveCondition: ResolveCondition<CONDITION, ROOT_STATE> = this._conditionToResolveCondition[condition.key]
        if (resolveCondition) {
          const newNavigationAction: NavigationAction | undefined = resolveCondition(condition, navigationAction, rootState)
          if (newNavigationAction) {
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
                previousState: JSON.parse(JSON.stringify(rootState)),
              },
            }
          }
        }
      }
    }
  }

  registerResolveCondition (conditionKey: string, resolveCondition: ResolveCondition<CONDITION, ROOT_STATE>): () => void {
    this._conditionToResolveCondition[conditionKey] = resolveCondition
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- TODO: check if this is correct
    return () => { delete this._conditionToResolveCondition[conditionKey] }
  }

  tickLogicalClock (): number {
    return ++this._logicalClock
  }
}

export const conditionalNavigationManager = new ConditionalNavigationManager<Condition, NavigationState>()

export const registerResolveCondition = (
  conditionKey: string,
  resolveCondition: ResolveCondition<Condition, NavigationState>,
): () => void => conditionalNavigationManager.registerResolveCondition(conditionKey, resolveCondition)
