/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-23T13:11:46+01:00
 * @Copyright: Technology Studio
**/

import { useMemo } from 'react'
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native'

import { calculateIsInitial } from '../Api/NavigationUtils'

export const useIsInitial = (): boolean => {
  const route = useRoute()
  const navigation = useNavigation()
  const isInitial = useMemo(() => {
    const state = navigation.getState()
    return calculateIsInitial(state, route)
  }, [navigation, route])
  return isInitial
}
