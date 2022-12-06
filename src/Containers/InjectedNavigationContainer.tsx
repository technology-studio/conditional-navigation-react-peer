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
} from '@react-navigation/native'
import { useFlipper } from '@react-navigation/devtools'

import { useAndroidBackNavigation } from '../Hooks/UseAndroidBackNavigation'
import {
  onActionFactory,
} from '../Navigation/OnActionFactory'

import { registerOnActionFactory } from './ReactNavigationInjection'

type Props = {
  children: React.ReactNode,
}

export const navigationRef = createNavigationContainerRef()

export const InjectedNavigationContainer = ({ children }: Props): JSX.Element => {
  useFlipper(navigationRef)
  useAndroidBackNavigation(navigationRef)

  useEffect(() => {
    registerOnActionFactory(onActionFactory)
  }, [])

  return (
    <NavigationContainer ref={navigationRef}>
      {children}
    </NavigationContainer>
  )
}
