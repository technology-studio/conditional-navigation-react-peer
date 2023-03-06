/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-21T16:11:22+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useEffect,
} from 'react'
import type {
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native'
import { BackHandler } from 'react-native'

import { backHandlerManager } from '../Api/BackHandlerManager'

export const useAndroidBackNavigation = (navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>): void => {
  const onBackPressHandler = useCallback((): boolean => {
    const navigationState = navigationRef.getRootState()
    if (navigationState == null || navigationState.index === 0) {
      return false
    }
    if (backHandlerManager.handlerList.length > 0) {
      const isHandled = backHandlerManager.handlerList.some(handler => handler())
      if (isHandled) {
        return isHandled
      }
    }
    navigationRef.goBack()
    return true
  }, [navigationRef])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPressHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPressHandler)
    }
  }, [navigationRef, onBackPressHandler])
}
