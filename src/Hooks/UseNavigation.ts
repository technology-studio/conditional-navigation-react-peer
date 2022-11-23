/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-23T13:11:85+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useMemo,
} from 'react'
import { useNavigation as useRNNavigation } from '@react-navigation/native'

import { ConditionalActions } from '../Navigation/ConditionalActions'
import type {
  Condition,
  NavigatePayload,
} from '../Model/Types'

type Navigation = ReturnType<typeof useRNNavigation> & {
  cancelFlow: () => void,
  finishFlowAndContinue: () => void,
  navigate: (payload: NavigatePayload) => void,
  requireConditions: (conditionList?: Condition[]) => void,
  validateConditions: () => void,
}

export const useNavigation = (): Navigation => {
  const _navigation = useRNNavigation()
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
  const navigate = useCallback((payload: NavigatePayload) => {
    _navigation.dispatch({
      ...ConditionalActions.navigate(payload),
    })
  }, [_navigation])
  // TODO: add goBack
  const navigation = useMemo(() => ({
    ..._navigation,
    cancelFlow,
    finishFlowAndContinue,
    requireConditions,
    validateConditions,
    navigate,
  }), [_navigation, cancelFlow, finishFlowAndContinue, navigate, requireConditions, validateConditions])
  return navigation
}
