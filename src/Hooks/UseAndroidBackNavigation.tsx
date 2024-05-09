/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-21T16:11:22+01:00
 * @Copyright: Technology Studio
**/

import {
  useEffect,
} from 'react'
import type {
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native'
import {
  BackHandler,
  Platform,
} from 'react-native'
import { is } from '@txo/types'

import { backHandlerManager } from '../Api/BackHandlerManager'
import { calculateIsInitial } from '../Api/NavigationUtils'

export const useAndroidBackNavigation = (navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>): void => {
  useEffect(() => {
    const onBackPressHandler = (): boolean => {
      const currentRoute = is(navigationRef.getCurrentRoute())
      const isInitial = calculateIsInitial(navigationRef.getRootState(), currentRoute)
      if (backHandlerManager.handlerList.length > 0) {
        return backHandlerManager.handlerList.some(handler => handler())
      }
      if (isInitial) {
        if (Platform.OS === 'android') {
          BackHandler.exitApp()
        }
        return true
      }
      navigationRef.goBack()
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', onBackPressHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPressHandler)
    }
  }, [navigationRef])
}
