/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2023-05-29T14:05:31+02:00
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'

import type {
  OnActionAttributes,
  CloseNavigationAction,
} from '../Model/Types'

const log = new Log('txo.conditional-navigation-react.Navigation.Close')

export const onCloseAction = ({
  action,
  originalOnAction,
  restArgs,
}: OnActionAttributes<CloseNavigationAction>): boolean => {
  // NOTE: this is a fallback for when close is not handled by custom handler
  log.debug('B - Close', { action })
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
