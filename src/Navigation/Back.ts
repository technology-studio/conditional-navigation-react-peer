/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-07T12:11:78+01:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'

import type {
  BackNavigationAction,
  OnActionAttributes,
} from '../Model/Types'

const log = new Log('txo.conditional-navigation-react.Navigation.Back')

export const onBackAction = ({
  action,
  originalOnAction,
  restArgs,
}: OnActionAttributes<BackNavigationAction>): boolean => {
  log.debug('B', { action })
  if ('count' in action && typeof action.count === 'number') {
    const {
      count,
    } = action
    const { count: _, ...originalAction } = action
    let result = false
    for (let i = 0; i < count; i++) {
      result = originalOnAction(originalAction, ...restArgs)
    }
    return result
  }
  return originalOnAction(action, ...restArgs)
}
