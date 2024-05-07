/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-21T16:11:22+01:00
 * @Copyright: Technology Studio
**/

import {
  useEffect,
} from 'react'
import {
  BackHandler,
  Platform,
} from 'react-native'

import { backHandlerManager } from '../Api/BackHandlerManager'
import {
  type DefaultNavigationProp,
  type DefaultParamsMap,
  type Navigation,
} from '../Model/Types'

export const useAndroidBackNavigation = <NAVIGATION extends Navigation<DefaultNavigationProp, DefaultParamsMap>>(
  isInitial: boolean,
  navigation: NAVIGATION,
): void => {
  useEffect(() => {
    const onBackPressHandler = (): boolean => {
      if (backHandlerManager.handlerList.length > 0) {
        return backHandlerManager.handlerList.some(handler => handler())
      }
      if (isInitial) {
        if (Platform.OS === 'android') {
          BackHandler.exitApp()
        }
        return true
      }
      navigation.goBack()
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', onBackPressHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPressHandler)
    }
  }, [isInitial, navigation])
}
