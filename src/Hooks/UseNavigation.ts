/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-23T13:11:85+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useMemo,
} from 'react'
import type { NavigationProp } from '@react-navigation/native'
import { useNavigation as useRNNavigation } from '@react-navigation/native'

import { ConditionalActions } from '../Navigation/ConditionalActions'
import type {
  BackPayload,
  Condition,
  NavigatePayload,
} from '../Model/Types'

export type Navigation<
NAVIGATION_PROP,
PARAMS_MAP extends Record<string, Record<string, unknown> | undefined>
> = Omit<NAVIGATION_PROP, 'navigate' | 'getParent'> & {
  cancelFlow: () => void,
  finishFlowAndContinue: () => void,
  navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => void,
  requireConditions: (conditionList: Condition[]) => void,
  validateConditions: () => void,
  goBack: (payload?: BackPayload) => void,
  getParent: (id?: string | undefined) => Navigation<NAVIGATION_PROP, PARAMS_MAP> | undefined,
}

const navigationActionsFactory = <
  NAVIGATION_PROP extends NavigationProp<Record<string, unknown>>,
  PARAMS_MAP extends Record<string, Record<string, unknown> | undefined>
>(navigation: NAVIGATION_PROP): {
    cancelFlow: () => void,
    finishFlowAndContinue: () => void,
    navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => void,
    requireConditions: (conditionList: Condition[]) => void,
    validateConditions: () => void,
    goBack: (payload?: BackPayload) => void,
  } => ({
    cancelFlow: () => {
      navigation.dispatch({
        ...ConditionalActions.cancelFlow(),
      })
    },
    finishFlowAndContinue: () => {
      navigation.dispatch({
        ...ConditionalActions.finishFlowAndContinue(),
      })
    },
    requireConditions: (...args: Parameters<typeof ConditionalActions.requireConditions>) => {
      navigation.dispatch({
        ...ConditionalActions.requireConditions(...args),
      })
    },
    validateConditions: () => {
      navigation.dispatch({
        ...ConditionalActions.validateConditions(),
      })
    },
    navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => {
      navigation.dispatch({
        ...ConditionalActions.navigate(payload),
      })
    },
    goBack: (payload?: BackPayload) => {
      navigation.dispatch({
        ...ConditionalActions.goBack(payload),
      })
    },
  })

export const useNavigation = <
  NAVIGATION_PROP extends NavigationProp<Record<string, unknown>, keyof Record<string, unknown>, string | undefined>,
  PARAMS_MAP extends Record<string, Record<string, unknown> | undefined>
  >(): Navigation<NAVIGATION_PROP, PARAMS_MAP> => {
  const _navigation = useRNNavigation<NAVIGATION_PROP>()
  const {
    cancelFlow,
    finishFlowAndContinue,
    requireConditions,
    validateConditions,
    navigate,
    goBack,
  } = useMemo(() => navigationActionsFactory(_navigation), [_navigation])
  const getParent = useCallback((id?: string | undefined) => {
    const parent = _navigation.getParent(id)
    if (parent == null) {
      return undefined
    }
    const navigationActions = navigationActionsFactory(parent)
    return {
      ...parent,
      ...navigationActions,
      getParent,
    }
  }, [_navigation])

  const navigation: Navigation<NAVIGATION_PROP, PARAMS_MAP> = useMemo(() => ({
    ..._navigation,
    cancelFlow,
    finishFlowAndContinue,
    requireConditions,
    validateConditions,
    navigate,
    goBack,
    getParent,
  }), [_navigation, cancelFlow, finishFlowAndContinue, getParent, goBack, navigate, requireConditions, validateConditions])
  return navigation
}
