/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-25T15:11:91+01:00
 * @Copyright: Technology Studio
**/

import type {
  ConditionConfig,
} from '../Model/Types'

export const screenConditionConfigMap: Record<string, ConditionConfig> = {}

export const registerScreenConditions = (
  routeName: string,
  conditionConfig: ConditionConfig,
): void => {
  screenConditionConfigMap[routeName] = conditionConfig
}
