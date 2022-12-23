/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-12-13T19:12:01+01:00
 * @Copyright: Technology Studio
**/

import type { NavigationState } from '@react-navigation/native'

export const cloneState = (navigationState: NavigationState): NavigationState => JSON.parse(JSON.stringify(navigationState))
