/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-15T13:11:31+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useContext,
} from 'react'
import type NavigationContainerRefContextType from '@react-navigation/core/lib/typescript/src/NavigationContainerRefContext'
import {
  NavigationContext,
} from '@react-navigation/core'

import type {
  NavigationAction,
  OnAction,
  OnActionFactoryAttributes,
  ConditionContext,
  UseOnActionOptions,
} from '../Model/Types'
import { screenConditionConfigMap } from '../Api/ConditionManager'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useOnActionObject = require('@react-navigation/core/src/useOnAction') as {
  default: (options: UseOnActionOptions) => OnAction<NavigationAction>,
}
const originalUseOnAction = useOnActionObject.default
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NavigationContainerRefContextObject = require('@react-navigation/core/src/NavigationContainerRefContext') as {
  default: typeof NavigationContainerRefContextType,
}
const NavigationContainerRefContext = NavigationContainerRefContextObject.default

let onActionFactory: ((onAction: OnAction<NavigationAction>) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction<NavigationAction>>) => boolean) | null = null
let getContext: () => ConditionContext

export const registerOnActionFactory = (_onActionFactory: typeof onActionFactory, _getContext: () => ConditionContext): void => {
  onActionFactory = _onActionFactory
  getContext = _getContext
}

useOnActionObject.default = function useOnAction (options: UseOnActionOptions): OnAction<NavigationAction> {
  const onAction = originalUseOnAction(options)
  const { getState, setState, router, routerConfigOptions } = options ?? {}
  const navigationContainerRefContext = useContext(NavigationContainerRefContext)
  const navigation = useContext(NavigationContext)

  const nextOnAction: typeof onAction = useCallback((...args: Parameters<OnAction<NavigationAction>>) => {
    if (onActionFactory != null) {
      return onActionFactory(onAction)({
        getContext,
        getState,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getRootState: () => navigationContainerRefContext!.getRootState(),
        nextOnAction,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        navigation: navigation!,
        screenConditionConfigMap,
        setState,
        router,
        routerConfigOptions,
      }, ...args)
    }

    return onAction(...args)
  }, [onAction, getState, navigationContainerRefContext, navigation, setState, router, routerConfigOptions])

  return nextOnAction
}
