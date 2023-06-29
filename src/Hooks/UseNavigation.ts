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
  BackPayload,
  Condition,
  NavigatePayload,
  DefaultNavigationProp,
  DefaultParamsMap,
} from '../Model/Types'

export type Navigation<
NAVIGATION_PROP extends DefaultNavigationProp,
PARAMS_MAP extends DefaultParamsMap,
> = Omit<NAVIGATION_PROP, 'navigate'> & {
  cancelFlow: () => void,
  finishFlowAndContinue: () => void,
  navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => void,
  requireConditions: (conditionList: Condition[]) => void,
  validateConditions: () => void,
  goBack: (payload?: BackPayload) => void,
  getRoot: () => Navigation<NAVIGATION_PROP, PARAMS_MAP>,
}

const navigationActionsFactory = <
  NAVIGATION_PROP extends DefaultNavigationProp,
  PARAMS_MAP extends DefaultParamsMap
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
  NAVIGATION_PROP extends DefaultNavigationProp,
  PARAMS_MAP extends DefaultParamsMap,
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

  const getRoot = useCallback(() => {
    let parent = _navigation.getParent<NAVIGATION_PROP>()
    while (parent != null) {
      const nextParent = parent.getParent<NAVIGATION_PROP>()
      if (nextParent == null) {
        break
      }
      parent = nextParent
    }

    return {
      ...parent ?? _navigation,
      ...navigationActionsFactory(parent ?? _navigation),
      getRoot,
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
    getRoot,
  }), [_navigation, cancelFlow, finishFlowAndContinue, getRoot, goBack, navigate, requireConditions, validateConditions])
  return navigation
}
