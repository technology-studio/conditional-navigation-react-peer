/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-15T13:11:31+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useContext,
} from 'react'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'
import type NavigationContainerRefContextType from '@react-navigation/core/lib/typescript/src/NavigationContainerRefContext'
import { NavigationContext } from '@react-navigation/core'

import type {
  NavigationAction,
  OnAction,
  OnActionFactoryAttributes,
  ResolveConditionContext,
  UseOnActionOptions,
} from '../Model/Types'
import { screenConditionConfigMap } from '../Api/ConditionManager'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useOnActionObject = require('@react-navigation/core/src/useOnAction')
const originalUseOnAction = useOnActionObject.default as typeof UseOnActionType
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NavigationContainerRefContextObject = require('@react-navigation/core/src/NavigationContainerRefContext')
const NavigationContainerRefContext = NavigationContainerRefContextObject.default as typeof NavigationContainerRefContextType

let onActionFactory: ((onAction: OnAction<NavigationAction>) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction<NavigationAction>>) => boolean) | null = null
let getContext: (() => ResolveConditionContext) | undefined

export const registerOnActionFactory = (_onActionFactory: typeof onActionFactory, _getContext: (() => ResolveConditionContext) | undefined): void => {
  onActionFactory = _onActionFactory
  getContext = _getContext
}

useOnActionObject.default = function useOnAction (options: UseOnActionOptions): OnAction<NavigationAction> {
  const onAction = originalUseOnAction(options) as OnAction<NavigationAction>
  const { getState, setState, router, routerConfigOptions } = options ?? {}
  const navigationContainerRefContext = useContext(NavigationContainerRefContext)
  const parentNavigationHelpers = useContext(NavigationContext)

  const nextOnAction: typeof onAction = useCallback((...args: Parameters<OnAction<NavigationAction>>) => {
    if (onActionFactory != null) {
      return onActionFactory(onAction)({
        getContext,
        getState,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getRootState: navigationContainerRefContext!.getRootState,
        nextOnAction,
        parentNavigationHelpers,
        screenConditionConfigMap,
        setState,
        router,
        routerConfigOptions,
      }, ...args)
    }

    return onAction(...args)
  }, [getState, navigationContainerRefContext, onAction, parentNavigationHelpers, router, routerConfigOptions, setState])

  return nextOnAction
}
