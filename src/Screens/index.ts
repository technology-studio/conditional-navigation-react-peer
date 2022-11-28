/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-24T13:11:47+01:00
 * @Copyright: Technology Studio
**/

import type { NavigationProps } from '../Model/Types'

export const navigationParams = <PARAMS extends Record<string, unknown>>(props: NavigationProps<PARAMS>): PARAMS => (
  (props.route?.params ?? {}) as PARAMS
)
