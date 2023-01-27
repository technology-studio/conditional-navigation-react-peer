/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-07T12:11:78+01:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'

import type {
  OnActionAttributes,
} from '../Model/Types'

const log = new Log('txo.react-conditional-navigation.Navigation.Back')

export const onBackAction = ({
  action,
  originalOnAction,
  restArgs,
}: OnActionAttributes): boolean => {
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
