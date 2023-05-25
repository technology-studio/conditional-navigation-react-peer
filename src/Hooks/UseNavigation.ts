/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-23T13:11:85+01:00
 * @Copyright: Technology Studio
**/

import {
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

type NavigationPropExtend = NavigationProp<Record<string, unknown>, keyof Record<string, unknown>, string | undefined>
type ParamsMapExtend = Record<string, Record<string, unknown> | undefined>

export type Navigation<
NAVIGATION_PROP extends NavigationPropExtend,
PARAMS_MAP extends ParamsMapExtend,
> = Omit<NAVIGATION_PROP, 'navigate' | 'getParent'> & {
  cancelFlow: () => void,
  finishFlowAndContinue: () => void,
  navigate: <ROUTE_NAME extends keyof PARAMS_MAP>(payload: NavigatePayload<PARAMS_MAP, ROUTE_NAME>) => void,
  requireConditions: (conditionList: Condition[]) => void,
  validateConditions: () => void,
  goBack: (payload?: BackPayload) => void,
  getParent: (id?: string | undefined) => Navigation<NAVIGATION_PROP, PARAMS_MAP> | undefined,
  getRoot: () => Navigation<NAVIGATION_PROP, PARAMS_MAP>,
}

const navigationActionsFactory = <
  NAVIGATION_PROP extends NavigationPropExtend,
  PARAMS_MAP extends ParamsMapExtend
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

type GetParentFn<
  NAVIGATION_PROP extends NavigationPropExtend,
  PARAMS_MAP extends ParamsMapExtend
> = (id?: string | undefined) => Navigation<NAVIGATION_PROP, PARAMS_MAP> | undefined

const getParentFactory = <
  NAVIGATION_PROP extends NavigationPropExtend,
  PARAMS_MAP extends ParamsMapExtend
>(navigation: NAVIGATION_PROP): GetParentFn<NAVIGATION_PROP, PARAMS_MAP> => {
  const _getParent: GetParentFn<NAVIGATION_PROP, PARAMS_MAP> = (id?: string | undefined) => {
    const parent = navigation.getParent<NAVIGATION_PROP>(id)
    if (parent == null) {
      return undefined
    }
    const navigationActions = navigationActionsFactory(parent)

    return {
      ...parent,
      ...navigationActions,
      getParent: _getParent,
      getRoot: getRootFactory(parent),
    }
  }
  return _getParent
}

type GetRootFn<
  NAVIGATION_PROP extends NavigationPropExtend,
  PARAMS_MAP extends ParamsMapExtend
> = () => Navigation<NAVIGATION_PROP, PARAMS_MAP>
const getRootFactory = <
  NAVIGATION_PROP extends NavigationPropExtend,
  PARAMS_MAP extends ParamsMapExtend
>(
    navigation: NAVIGATION_PROP,
  ): GetRootFn<NAVIGATION_PROP, PARAMS_MAP> => {
  const getRoot: GetRootFn<NAVIGATION_PROP, PARAMS_MAP> = () => {
    let parent = navigation.getParent<NAVIGATION_PROP>()
    while (parent != null) {
      const nextParent = parent.getParent<NAVIGATION_PROP>()
      if (nextParent == null) {
        break
      }
      parent = nextParent
    }

    return {
      ...parent ?? navigation,
      ...navigationActionsFactory(parent ?? navigation),
      getParent: getParentFactory(parent ?? navigation),
      getRoot,
    }
  }
  return getRoot
}

export const useNavigation = <
  NAVIGATION_PROP extends NavigationPropExtend,
  PARAMS_MAP extends ParamsMapExtend,
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

  const navigation: Navigation<NAVIGATION_PROP, PARAMS_MAP> = useMemo(() => ({
    ..._navigation,
    cancelFlow,
    finishFlowAndContinue,
    requireConditions,
    validateConditions,
    navigate,
    goBack,
    getParent: getParentFactory<NAVIGATION_PROP, PARAMS_MAP>(_navigation),
    getRoot: getRootFactory<NAVIGATION_PROP, PARAMS_MAP>(_navigation),
  }), [_navigation, cancelFlow, finishFlowAndContinue, goBack, navigate, requireConditions, validateConditions])
  return navigation
}
