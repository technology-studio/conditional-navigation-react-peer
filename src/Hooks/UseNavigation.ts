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
  Condition,
  NavigatePayload,
} from '../Model/Types'

export type Navigation<
NAVIGATION_PROP,
PARAMS_MAP extends Record<string, Record<string, unknown> | undefined>
> = Omit<NAVIGATION_PROP, 'navigate'> & {
  cancelFlow: () => void,
  finishFlowAndContinue: () => void,
  navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => void,
  requireConditions: (conditionList?: Condition[]) => void,
  validateConditions: () => void,
}

export const useNavigation = <
  NAVIGATION_PROP extends NavigationProp<Record<string, unknown>>,
  PARAMS_MAP extends Record<string, Record<string, unknown> | undefined>
  >(): Navigation<NAVIGATION_PROP, PARAMS_MAP> => {
  const _navigation = useRNNavigation<NAVIGATION_PROP>()
  const cancelFlow = useCallback(() => {
    _navigation.dispatch({
      ...ConditionalActions.cancelFlow(),
    })
  }, [_navigation])
  const finishFlowAndContinue = useCallback(() => {
    _navigation.dispatch({
      ...ConditionalActions.finishFlowAndContinue(),
    })
  }, [_navigation])
  const requireConditions = useCallback((...args: Parameters<typeof ConditionalActions.requireConditions>) => {
    _navigation.dispatch({
      ...ConditionalActions.requireConditions(...args),
    })
  }, [_navigation])
  const validateConditions = useCallback(() => {
    _navigation.dispatch({
      ...ConditionalActions.validateConditions(),
    })
  }, [_navigation])
  const navigate = useCallback((payload: NavigatePayload<PARAMS_MAP>) => {
    _navigation.dispatch({
      ...ConditionalActions.navigate(payload),
    })
  }, [_navigation])
  // TODO: add goBack

  const navigation: Navigation<NAVIGATION_PROP, PARAMS_MAP> = useMemo(() => ({
    ..._navigation,
    cancelFlow,
    finishFlowAndContinue,
    requireConditions,
    validateConditions,
    navigate,
  }), [_navigation, cancelFlow, finishFlowAndContinue, navigate, requireConditions, validateConditions])
  return navigation
}
