/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-08T18:41:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 */

import { ConfigManager } from '@txo/config-manager'

export type Config = {
  ignoreConditionalNavigation: boolean,
}

export const configManager = new ConfigManager<Config>({
  ignoreConditionalNavigation: false,
})
