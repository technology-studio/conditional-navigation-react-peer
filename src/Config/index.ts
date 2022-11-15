/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-08T18:41:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 */

import { ConfigManager } from '@txo/config-manager'

import type {
  Condition,
  NavigatorType,
} from '../Model/Types'

export type Config = {
  ignoreConditionalNavigation: boolean,
  routeNameToNavigatorTypeMap: Record<string, NavigatorType>,
  screenConditionsMap: Record<string, Condition[]>,
}

export const configManager = new ConfigManager<Config>({
  ignoreConditionalNavigation: false,
  routeNameToNavigatorTypeMap: {},
  screenConditionsMap: {},
})
