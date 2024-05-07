/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2024-05-07T13:45:44+02:00
 * @Copyright: Technology Studio
**/

import {
  useEffect,
  useRef,
} from 'react'

import { backHandlerManager } from '../Api/BackHandlerManager'
import {
  type DefaultNavigationProp,
  type DefaultParamsMap,
  type Navigation,
} from '../Model/Types'

export const useAndroidBackForCustomOnBack = <NAVIGATION extends Navigation<DefaultNavigationProp, DefaultParamsMap>>(onBack: (() => boolean) | null, navigation: NAVIGATION): void => {
  const backRequestRegistrationRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    if (onBack != null) {
      backRequestRegistrationRef.current = backHandlerManager.register(onBack)
      const unregisterFocusListener = navigation.addListener('focus', () => {
        backRequestRegistrationRef.current?.()
        backRequestRegistrationRef.current = backHandlerManager.register(onBack)
      })
      const unregisterBlurListener = navigation.addListener('blur', () => {
        backRequestRegistrationRef.current?.()
      })

      return () => {
        backRequestRegistrationRef.current?.()
        unregisterFocusListener()
        unregisterBlurListener()
      }
    }
  }, [onBack, navigation])
}
