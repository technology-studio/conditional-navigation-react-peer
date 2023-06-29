/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2023-05-29T12:05:04+02:00
 * @Copyright: Technology Studio
**/

import type { NavigationState } from '@react-navigation/routers/src/types'

import {
  calculateStaticTreeOrder,
  findStaticScreenTree,
  findStaticNavigatorForStateKey,
  getRouteNameForStateKey,
} from '../../src/Api/NavigationUtils'
import {
  type StaticScreenTreeNavigatorWithDepth,
  type StaticScreenTreeNavigator,
  type StaticScreenTreeWithDepth,
} from '../../src/Model/Types'
import {
  ROOT_NAVIGATOR_ID,
} from '../../src/Model'
import {
  ConditionalActions,
} from '../../src/Navigation/ConditionalActions'

const tree: StaticScreenTreeWithDepth = {
  routeName: ROOT_NAVIGATOR_ID,
  id: ROOT_NAVIGATOR_ID,
  depth: 0,
  getParent: () => undefined,
  screens: [
    {
      routeName: 'SPLASH_SCREEN',
      type: 'SCREEN',
      depth: 1,
      getParent: () => undefined,
    },
    {
      routeName: 'HAPPY_END_SCREEN',
      type: 'SCREEN',
      depth: 1,
      getParent: () => undefined,
    },
    {
      routeName: 'MAIN_SCREEN',
      id: 'mainScreen',
      type: 'NAVIGATOR',
      handlerMap: {},
      depth: 1,
      getParent: () => undefined,
      screens: [
        {
          routeName: 'EXAMPLE_TAB',
          id: 'EXAMPLE_TAB',
          type: 'NAVIGATOR',
          handlerMap: {},
          depth: 2,
          getParent: () => undefined,
          screens: [
            {
              routeName: 'SCREEN7',
              type: 'SCREEN',
              depth: 3,
              getParent: () => undefined,
            },
            {
              routeName: 'SCREEN8',
              type: 'SCREEN',
              depth: 3,
              getParent: () => undefined,
            },
          ],
        },
        {
          routeName: 'HAPPY_END_TAB',
          type: 'SCREEN',
          depth: 2,
          getParent: () => undefined,
        },
      ],
    },
    {
      routeName: 'SECOND_TAB_SCREEN',
      id: 'secondTabScreen',
      type: 'NAVIGATOR',
      handlerMap: {},
      depth: 1,
      getParent: () => undefined,
      screens: [
        {
          routeName: 'SECOND_EXAMPLE_TAB',
          type: 'SCREEN',
          depth: 2,
          getParent: () => undefined,
        },
        {
          routeName: 'SECOND_HAPPY_END_TAB',
          type: 'SCREEN',
          depth: 2,
          getParent: () => undefined,
        },
      ],
    },
    {
      routeName: 'SECOND_STACK',
      id: 'secondStack',
      type: 'NAVIGATOR',
      // handlerMap: {},
      handlerMap: {
        CLOSE: () => ({
          ...ConditionalActions.goBack(),
          navigatorId: ROOT_NAVIGATOR_ID,
        }),
      },
      depth: 1,
      getParent: () => undefined,
      screens: [
        {
          routeName: 'SCREEN3',
          type: 'SCREEN',
          depth: 2,
          getParent: () => undefined,
        },
        {
          routeName: 'SCREEN4',
          type: 'SCREEN',
          depth: 2,
          getParent: () => undefined,
        },
      ],
    },
  ],
  type: 'NAVIGATOR',
  handlerMap: {},
}

// NOTE: navigated to MAIN_SCREEN -> HAPPY_END_TAB -> SECOND_STACK -> SCREEN3 -> SCREEN4
const state: NavigationState = {
  stale: false,
  type: 'stack',
  key: 'stack-saoN1PLMXksuZ5Va5TQ79',
  index: 1,
  routeNames: [
    'SPLASH_SCREEN',
    'HAPPY_END_SCREEN',
    'SANDBOX_SCREEN',
    'SECOND_SANDBOX_SCREEN',
    'ERROR_DETAIL_SCREEN',
    'SELECT_SCREEN',
    'ABOUT_APPLICATION_SCREEN',
    'MAIN_SCREEN',
    'SECOND_TAB_SCREEN',
    'SECOND_STACK',
  ],
  routes: [
    {
      name: 'MAIN_SCREEN',
      params: {
        screen: 'HAPPY_END_TAB',
      },
      key: 'MAIN_SCREEN-N7SThzaLDA-mOX1SfiSWE',
      state: {
        stale: false,
        type: 'tab',
        key: 'tab-8wkFsNNXjCnC2KVF33GGw',
        index: 0,
        routeNames: [
          'EXAMPLE_TAB',
          'HAPPY_END_TAB',
        ],
        history: [
          {
            type: 'route',
            key: 'EXAMPLE_TAB-RNfP5-ovRnD900yJViv2_',
          },
          {
            type: 'route',
            key: 'HAPPY_END_TAB-pc-zGB-Nk-rxY3raCH5E4',
          },
        ],
        routes: [
          {
            name: 'EXAMPLE_TAB',
            key: 'EXAMPLE_TAB-RNfP5-ovRnD900yJViv2_',
            state: {
              stale: false,
              type: 'stack',
              key: 'stack-URHY8NIrsbbyrHLTeStUX',
              index: 0,
              routeNames: [
                'SCREEN7',
                'SCREEN8',
              ],
              routes: [
                {
                  name: 'SCREEN7',
                  key: 'SCREEN7-Qr-31WMQy52UGxFRmVsV2',
                },
              ],
            },
          },
          {
            name: 'HAPPY_END_TAB',
            key: 'HAPPY_END_TAB-pc-zGB-Nk-rxY3raCH5E4',
          },
        ],
      },
    },
    {
      key: 'SECOND_STACK-mAmaf2oyMG22z6NPDkRVe',
      name: 'SECOND_STACK',
      state: {
        stale: false,
        type: 'stack',
        key: 'stack-9x-M96FX1Pv-1-XbVNbeJ',
        index: 2,
        routeNames: [
          'SCREEN3',
          'SCREEN4',
        ],
        routes: [
          {
            key: 'SCREEN3-ukYDsZujUiL_RdZ0EmbXH',
            name: 'SCREEN3',
          },
          {
            key: 'SCREEN4-XIYJYiYfSTmeha0s8dzC-',
            name: 'SCREEN4',
          },
          {
            key: 'THIRD_STACK-cjbkyNZxjxN6O1BaT-INF',
            name: 'THIRD_STACK',
            state: {
              stale: false,
              type: 'stack',
              key: 'stack-TrcrV6x8MEXXElnpJiLhT',
              index: 1,
              routeNames: [
                'SCREEN5',
                'SCREEN6',
              ],
              routes: [
                {
                  key: 'SCREEN5-eHvApW0u_mqX3IY97wiB7',
                  name: 'SCREEN5',
                },
                {
                  key: 'SCREEN6-bFVi5AUDlYivNMqCHhdQ0',
                  name: 'SCREEN6',
                },
              ],
            },
          },
        ],
      },
    },
  ],
}

const treeWithoutOrder: StaticScreenTreeNavigator = {
  routeName: ROOT_NAVIGATOR_ID,
  id: ROOT_NAVIGATOR_ID,
  screens: [
    {
      routeName: 'SPLASH_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'HAPPY_END_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'SANDBOX_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'SECOND_SANDBOX_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'ERROR_DETAIL_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'SELECT_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'ABOUT_APPLICATION_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'MAIN_SCREEN',
      id: 'mainScreen',
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      screens: [
        {
          routeName: 'EXAMPLE_TAB',
          id: 'EXAMPLE_TAB',
          type: 'NAVIGATOR' as const,
          handlerMap: {},
          screens: [
            {
              routeName: 'SCREEN5',
              type: 'SCREEN' as const,
            },
            {
              routeName: 'SCREEN6',
              type: 'SCREEN' as const,
            },
          ],
        },
        {
          routeName: 'HAPPY_END_TAB',
          type: 'SCREEN' as const,
        },
      ],
    },
    {
      routeName: 'SECOND_TAB_SCREEN',
      id: 'secondTabScreen',
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      screens: [
        {
          routeName: 'SECOND_EXAMPLE_TAB',
          type: 'SCREEN' as const,
        },
        {
          routeName: 'SECOND_HAPPY_END_TAB',
          type: 'SCREEN' as const,
        },
      ],
    },
    {
      routeName: 'SECOND_STACK',
      id: 'secondStack',
      type: 'NAVIGATOR' as const,
      // handlerMap: {},
      handlerMap: {},
      screens: [
        {
          routeName: 'SCREEN3',
          type: 'SCREEN' as const,
        },
        {
          routeName: 'SCREEN4',
          type: 'SCREEN' as const,
        },
      ],
    },
  ],
  type: 'NAVIGATOR' as const,
  handlerMap: {},
}
const treeWithDepth: StaticScreenTreeNavigatorWithDepth = {
  routeName: ROOT_NAVIGATOR_ID,
  id: ROOT_NAVIGATOR_ID,
  depth: 0,
  getParent: () => undefined,
  screens: [
    {
      routeName: 'SPLASH_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'HAPPY_END_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'SANDBOX_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'SECOND_SANDBOX_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'ERROR_DETAIL_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'SELECT_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'ABOUT_APPLICATION_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'MAIN_SCREEN',
      id: 'mainScreen',
      depth: 1,
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      getParent: () => undefined,
      screens: [
        {
          routeName: 'EXAMPLE_TAB',
          id: 'EXAMPLE_TAB',
          depth: 2,
          type: 'NAVIGATOR' as const,
          handlerMap: {},
          getParent: () => undefined,
          screens: [
            {
              routeName: 'SCREEN5',
              depth: 3,
              type: 'SCREEN' as const,
              getParent: () => undefined,
            },
            {
              routeName: 'SCREEN6',
              depth: 3,
              type: 'SCREEN' as const,
              getParent: () => undefined,
            },
          ],
        },
        {
          routeName: 'HAPPY_END_TAB',
          depth: 2,
          type: 'SCREEN' as const,
          getParent: () => undefined,
        },
      ],
    },
    {
      routeName: 'SECOND_TAB_SCREEN',
      id: 'secondTabScreen',
      depth: 1,
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      getParent: () => undefined,
      screens: [
        {
          routeName: 'SECOND_EXAMPLE_TAB',
          depth: 2,
          type: 'SCREEN' as const,
          getParent: () => undefined,
        },
        {
          routeName: 'SECOND_HAPPY_END_TAB',
          depth: 2,
          type: 'SCREEN' as const,
          getParent: () => undefined,
        },
      ],
    },
    {
      routeName: 'SECOND_STACK',
      id: 'secondStack',
      depth: 1,
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      getParent: () => undefined,
      screens: [
        {
          routeName: 'SCREEN3',
          depth: 2,
          type: 'SCREEN' as const,
          getParent: () => undefined,
        },
        {
          routeName: 'SCREEN4',
          depth: 2,
          type: 'SCREEN' as const,
          getParent: () => undefined,
        },
      ],
    },
  ],
  type: 'NAVIGATOR' as const,
  handlerMap: {},
}

describe('findStaticScreenTree function', () => {
  test('should return undefined if the routeName does not exist', () => {
    expect(findStaticScreenTree(tree, 'NonexistentRoute')).toBeUndefined()
  })

  test('should return the root navigator if the routeName is root and isRoot is true', () => {
    expect(findStaticScreenTree(tree, ROOT_NAVIGATOR_ID)).toBe(tree)
  })

  test('should return the correct navigator if the routeName exists and is not the root', () => {
    const mainScreenNavigator = tree.screens.find(screen => screen.routeName === 'MAIN_SCREEN')
    expect(findStaticScreenTree(tree, 'MAIN_SCREEN')).toBe(mainScreenNavigator)
  })

  test('should return nested navigator when routeName exists in nested navigator', () => {
    const secondStackNavigator = tree.screens.find(screen => screen.routeName === 'SECOND_STACK')
    expect(findStaticScreenTree(tree, 'SECOND_STACK')).toBe(secondStackNavigator)
  })

  test('should return undefined if nonexisting routeName is used', () => {
    expect(findStaticScreenTree(tree, 'NONEXISTENT_ROUTE_NAME')).toBeUndefined()
  })

  test('should return the StaticScreenTreeNavigator if found in a nested screen', () => {
    const result = findStaticScreenTree(tree, 'SECOND_TAB_SCREEN')

    expect(result?.routeName).toEqual('SECOND_TAB_SCREEN')
  })
})

describe('getRouteNameForStateKey function', () => {
  test('should return undefined if the stateKey does not exist', () => {
    expect(getRouteNameForStateKey(state, 'NonexistentKey')).toBeUndefined()
  })

  test('should return route name if the stateKey does exist', () => {
    expect(getRouteNameForStateKey(state, 'stack-9x-M96FX1Pv-1-XbVNbeJ')).toBe('SECOND_STACK')
  })

  test('should return route name if the stateKey does exist and is root key', () => {
    expect(getRouteNameForStateKey(state, 'stack-saoN1PLMXksuZ5Va5TQ79')).toBe(ROOT_NAVIGATOR_ID)
  })

  test('should return route name if the stateKey does exist and is nested', () => {
    expect(getRouteNameForStateKey(state, 'stack-TrcrV6x8MEXXElnpJiLhT')).toBe('THIRD_STACK')
  })
})

describe('findStaticNavigatorForStateKey function', () => {
  test('should return undefined if the stateKey does not exist', () => {
    expect(findStaticNavigatorForStateKey(tree, state, 'NonexistentKey')).toBeUndefined()
  })

  test('should return static navigator if the stateKey does exist', () => {
    expect(findStaticNavigatorForStateKey(tree, state, 'stack-9x-M96FX1Pv-1-XbVNbeJ')).toBe(tree.screens[4])
  })
})

describe('calculateStaticTreeOrder function', () => {
  test('should add order to every screen', () => {
    const rootTree = calculateStaticTreeOrder(treeWithoutOrder)
    const mainScreen = (rootTree as StaticScreenTreeNavigatorWithDepth).screens[7]
    const mockedMainScreen = treeWithDepth.screens[7]
    expect(mainScreen.depth).toBe(mockedMainScreen.depth)
  })

  test('should get parent for screen in root stack navigator', () => {
    const rootTree = calculateStaticTreeOrder(treeWithoutOrder)
    const screen = (rootTree as StaticScreenTreeNavigatorWithDepth).screens[0]
    expect(screen.getParent()).toBe(rootTree)
  })

  test('should get parent for screen in main tab navigator', () => {
    const rootTree = calculateStaticTreeOrder(treeWithoutOrder)
    const mainScreen = (rootTree as StaticScreenTreeNavigatorWithDepth).screens[7]
    const screen = (mainScreen as StaticScreenTreeNavigatorWithDepth).screens[0]
    expect(screen.getParent()).toBe(mainScreen)
  })

  test('should get root parent for screen in main tab navigator', () => {
    const rootTree = calculateStaticTreeOrder(treeWithoutOrder)
    const mainScreen = (rootTree as StaticScreenTreeNavigatorWithDepth).screens[7]
    const screen = (mainScreen as StaticScreenTreeNavigatorWithDepth).screens[0]
    expect(screen.getParent()?.getParent()).toBe(rootTree)
  })
})
