/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-24T15:10:50+02:00
 * @Copyright: Technology Studio
**/

import React, {
  useEffect,
} from 'react'
import {
  NavigationContainer,
  createNavigationContainerRef,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { useFlipper } from '@react-navigation/devtools'

import { useAndroidBackNavigation } from '../Hooks/UseAndroidBackNavigation'
import {
  onActionFactory,
} from '../Navigation/OnActionFactory'
import type { ResolveConditionContext } from '../Model/Types'

import { registerOnActionFactory } from './ReactNavigationInjection'

type Props = {
  children: React.ReactNode,
  getContext: () => ResolveConditionContext,
  isDarkThemeEnabled: boolean,
  onReady?: () => void,
  onStateChange?: () => void,
}

export const navigationRef = createNavigationContainerRef()

export const InjectedNavigationContainer = ({
  children,
  getContext,
  isDarkThemeEnabled,
  onReady,
  onStateChange,
}: Props): JSX.Element => {
  useFlipper(navigationRef)
  useAndroidBackNavigation(navigationRef)

  useEffect(() => {
    registerOnActionFactory(onActionFactory, getContext)
  }, [getContext])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={isDarkThemeEnabled ? DarkTheme : DefaultTheme}
      onReady={onReady}
      onStateChange={onStateChange}
    >
      {children}
    </NavigationContainer>
  )
}
