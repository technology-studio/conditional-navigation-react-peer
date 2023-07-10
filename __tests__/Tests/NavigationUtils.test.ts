/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2023-05-29T12:05:04+02:00
 * @Copyright: Technology Studio
**/

import type { NavigationState } from '@react-navigation/routers/src/types'

import {
  calculateStaticTreeDepth,
  findStaticTreeScreen,
  findStaticNavigatorByStateKey,
  getRouteNameByStateKey,
  transformForNearestExistingNavigator,
  getCommonStaticNavigatorWithPaths,
} from '../../src/Api/NavigationUtils'
import {
  type StaticTreeNavigatorDeclaration,
  type StaticTreeNavigator,
} from '../../src/Model/Types'
import {
  ROOT_NAVIGATOR_ID,
} from '../../src/Model'
import {
  ConditionalActions,
} from '../../src/Navigation/ConditionalActions'

const tree: StaticTreeNavigator = {
  routeName: ROOT_NAVIGATOR_ID,
  id: ROOT_NAVIGATOR_ID,
  depth: 0,
  getParent: () => undefined,
  children: [
    {
      routeName: 'SPLASH_SCREEN',
      type: 'SCREEN',
      depth: 1,
      getParent: () => undefined,
    },
    {
      routeName: 'MAIN_SCREEN',
      id: 'MAIN_SCREEN',
      type: 'NAVIGATOR',
      handlerMap: {},
      depth: 1,
      getParent: () => undefined,
      children: [
        {
          routeName: 'EXAMPLE_TAB',
          id: 'EXAMPLE_TAB',
          type: 'NAVIGATOR',
          handlerMap: {},
          depth: 2,
          getParent: () => undefined,
          children: [
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
      id: 'SECOND_TAB_SCREEN',
      type: 'NAVIGATOR',
      handlerMap: {},
      depth: 1,
      getParent: () => undefined,
      children: [
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
      id: 'SECOND_STACK',
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
      children: [
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
        {
          routeName: 'THIRD_STACK',
          id: 'THIRD_STACK',
          type: 'NAVIGATOR',
          handlerMap: {},
          depth: 2,
          getParent: () => undefined,
          children: [
            {
              routeName: 'SCREEN5',
              type: 'SCREEN',
              depth: 3,
              getParent: () => undefined,
            },
            {
              routeName: 'SCREEN6',
              type: 'SCREEN',
              depth: 3,
              getParent: () => undefined,
            },
          ],
        },
      ],
    },
  ],
  type: 'NAVIGATOR',
  handlerMap: {},
}

// NOTE: navigated to MAIN_SCREEN -> SECOND_STACK -> THIRD_STACK -> SCREEN6
const state: NavigationState = {
  stale: false,
  type: 'stack',
  key: 'stack-saoN1PLMXksuZ5Va5TQ79',
  index: 1,
  routeNames: [
    'MAIN_SCREEN',
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
          'THIRD_STACK',
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

const staticTreeDeclaration: StaticTreeNavigatorDeclaration = {
  routeName: ROOT_NAVIGATOR_ID,
  id: ROOT_NAVIGATOR_ID,
  children: [
    {
      routeName: 'SPLASH_SCREEN',
      type: 'SCREEN' as const,
    },
    {
      routeName: 'MAIN_SCREEN',
      id: 'MAIN_SCREEN',
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      children: [
        {
          routeName: 'EXAMPLE_TAB',
          id: 'EXAMPLE_TAB',
          type: 'NAVIGATOR' as const,
          handlerMap: {},
          children: [
            {
              routeName: 'SCREEN7',
              type: 'SCREEN' as const,
            },
            {
              routeName: 'SCREEN8',
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
      id: 'SECOND_TAB_SCREEN',
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      children: [
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
      id: 'SECOND_STACK',
      type: 'NAVIGATOR' as const,
      // handlerMap: {},
      handlerMap: {},
      children: [
        {
          routeName: 'SCREEN3',
          type: 'SCREEN' as const,
        },
        {
          routeName: 'SCREEN4',
          type: 'SCREEN' as const,
        },
        {
          routeName: 'THIRD_STACK',
          id: 'THIRD_STACK',
          type: 'NAVIGATOR' as const,
          handlerMap: {},
          children: [
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
      ],
    },
  ],
  type: 'NAVIGATOR' as const,
  handlerMap: {},
}
const staticTree: StaticTreeNavigator = {
  routeName: ROOT_NAVIGATOR_ID,
  id: ROOT_NAVIGATOR_ID,
  depth: 0,
  getParent: () => undefined,
  children: [
    {
      routeName: 'SPLASH_SCREEN',
      type: 'SCREEN' as const,
      getParent: () => undefined,
      depth: 1,
    },
    {
      routeName: 'MAIN_SCREEN',
      id: 'MAIN_SCREEN',
      depth: 1,
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      getParent: () => undefined,
      children: [
        {
          routeName: 'EXAMPLE_TAB',
          id: 'EXAMPLE_TAB',
          depth: 2,
          type: 'NAVIGATOR' as const,
          handlerMap: {},
          getParent: () => undefined,
          children: [
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
      id: 'SECOND_TAB_SCREEN',
      depth: 1,
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      getParent: () => undefined,
      children: [
        {
          routeName: 'SECOND_EXAMPLE_TAB',
          depth: 2,
          type: 'SCREEN' as const,
          getParent: () => undefined,
        },
        {
          id: 'SECOND_HAPPY_END_TAB',
          routeName: 'SECOND_HAPPY_END_TAB',
          depth: 2,
          type: 'NAVIGATOR' as const,
          handlerMap: {},
          getParent: () => undefined,
          children: [
            {
              routeName: 'SCREEN8',
              depth: 3,
              type: 'SCREEN' as const,
              getParent: () => undefined,
            },
          ],
        },
      ],
    },
    {
      routeName: 'SECOND_STACK',
      id: 'SECOND_STACK',
      depth: 1,
      type: 'NAVIGATOR' as const,
      handlerMap: {},
      getParent: () => undefined,
      children: [
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

describe('findStaticTreeScreen function', () => {
  test('should return undefined if the routeName does not exist', () => {
    expect(() => findStaticTreeScreen(tree, 'NON_EXISTING_ROUTE_NAME')).toThrow(new Error('Missing static tree screen for route name: NON_EXISTING_ROUTE_NAME'))
  })

  test('should return the root navigator if the routeName is root and isRoot is true', () => {
    expect(findStaticTreeScreen(tree, ROOT_NAVIGATOR_ID)).toBe(tree)
  })

  test('should return the correct navigator if the routeName exists and is not the root', () => {
    const mainScreenNavigator = tree.children.find(screen => screen.routeName === 'MAIN_SCREEN')
    expect(findStaticTreeScreen(tree, 'MAIN_SCREEN')).toBe(mainScreenNavigator)
  })

  test('should return nested navigator when routeName exists in nested navigator', () => {
    const secondStackNavigator = tree.children.find(screen => screen.routeName === 'SECOND_STACK')
    expect(findStaticTreeScreen(tree, 'SECOND_STACK')).toBe(secondStackNavigator)
  })

  test('should return the StaticScreenTreeNavigatorDeclaration if found in a nested screen', () => {
    const result = findStaticTreeScreen(tree, 'SECOND_TAB_SCREEN')

    expect(result?.routeName).toEqual('SECOND_TAB_SCREEN')
  })
})

describe('getRouteNameByStateKey function', () => {
  test('should return undefined if the stateKey does not exist', () => {
    expect(() => getRouteNameByStateKey(state, 'NONEXISTENT_KEY')).toThrow(new Error('Missing route name for state key: NONEXISTENT_KEY'))
  })

  test('should return route name if the stateKey does exist', () => {
    expect(getRouteNameByStateKey(state, 'stack-9x-M96FX1Pv-1-XbVNbeJ')).toBe('SECOND_STACK')
  })

  test('should return route name if the stateKey does exist and is root key', () => {
    expect(getRouteNameByStateKey(state, 'stack-saoN1PLMXksuZ5Va5TQ79')).toBe(ROOT_NAVIGATOR_ID)
  })

  test('should return route name if the stateKey does exist and is nested', () => {
    expect(getRouteNameByStateKey(state, 'stack-TrcrV6x8MEXXElnpJiLhT')).toBe('THIRD_STACK')
  })
})

describe('findStaticNavigatorByStateKey function', () => {
  test('should return undefined if the stateKey does not exist', () => {
    expect(() => findStaticNavigatorByStateKey(tree, state, 'NONEXISTENT_KEY')).toThrow(new Error('Missing route name for state key: NONEXISTENT_KEY'))
  })

  test('should return static navigator if the stateKey does exist', () => {
    expect(findStaticNavigatorByStateKey(tree, state, 'stack-9x-M96FX1Pv-1-XbVNbeJ')).toBe(tree.children[3])
  })
})

describe('calculateStaticTreeDepth function', () => {
  test('should add depth to every screen', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const mainScreen = (rootTree as StaticTreeNavigator).children[1]
    const mockedMainScreen = staticTree.children[1]
    expect(mainScreen.depth).toBe(mockedMainScreen.depth)
  })

  test('should get parent for screen in root stack navigator', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const screen = (rootTree as StaticTreeNavigator).children[0]
    expect(screen.getParent()).toBe(rootTree)
  })

  test('should get parent for screen in main tab navigator', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const mainScreen = (rootTree as StaticTreeNavigator).children[1]
    const screen = (mainScreen as StaticTreeNavigator).children[0]
    expect(screen.getParent()).toBe(mainScreen)
  })

  test('should get root parent for screen in main tab navigator', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const mainScreen = (rootTree as StaticTreeNavigator).children[1]
    const screen = (mainScreen as StaticTreeNavigator).children[0]
    expect(screen.getParent()?.getParent()).toBe(rootTree)
  })
})

describe('getCommonStaticNavigatorWithPaths function', () => {
  test('should return root navigator as common navigator', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration) as StaticTreeNavigator
    const currentStaticTreeScreen = findStaticTreeScreen(rootTree, 'SCREEN6')
    const finalStaticTreeScreen = findStaticTreeScreen(rootTree, 'SCREEN8')
    const {
      commonStaticNavigator,
      sourcePathFromCommonNavigator,
      targetPathFromCommonNavigator,
    } = getCommonStaticNavigatorWithPaths({
      currentStaticTreeScreen,
      finalStaticTreeScreen,
    })
    expect(commonStaticNavigator.id).toBe(rootTree.id)
    expect(sourcePathFromCommonNavigator).toEqual(['SECOND_STACK', 'THIRD_STACK', 'SCREEN6'])
    expect(targetPathFromCommonNavigator).toEqual(['MAIN_SCREEN', 'EXAMPLE_TAB', 'SCREEN8'])
  })
})

describe('transformForNearestExistingNavigator function', () => {
  test('should create action for navigating to neighbouring navigator', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.navigate({
      routeName: 'SCREEN7',
    })
    const transformedAction = transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)
    expect(transformedAction).toEqual({
      ...ConditionalActions.navigate({
        routeName: 'MAIN_SCREEN',
        params: {
          screen: 'EXAMPLE_TAB',
          params: {
            screen: 'SCREEN7',
          },
        },
      }),
      navigatorId: 'ROOT_NAVIGATOR',
      isTransformed: true,
    })
  })

  test('should create action for navigating to neighbouring navigator (with parent navigator in action)', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.navigate({
      routeName: 'EXAMPLE_TAB',
      params: {
        screen: 'SCREEN7',
      },
    })
    const transformedAction = transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)
    expect(transformedAction).toEqual({
      ...ConditionalActions.navigate({
        routeName: 'MAIN_SCREEN',
        params: {
          screen: 'EXAMPLE_TAB',
          params: {
            screen: 'SCREEN7',
          },
        },
      }),
      navigatorId: ROOT_NAVIGATOR_ID,
      isTransformed: true,
    })
  })

  test('should not change action when in same navigator', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.navigate({
      routeName: 'SCREEN5',
    })
    const transformedAction = transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)
    expect(transformedAction).toEqual(originalAction)
  })

  test('should not change action when type is not navigate', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.goBack()
    const transformedAction = transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)
    expect(transformedAction).toEqual(originalAction)
  })

  test('should not change action when navigating to same screen', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.navigate({
      routeName: 'SCREEN6',
    })
    const transformedAction = transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)
    expect(transformedAction).toEqual(originalAction)
  })

  test('should not change already transfromed action', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.navigate({
      routeName: 'EXAMPLE_TAB',
      params: {
        screen: 'SCREEN7',
      },
    })
    const transformedAction = transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)
    const transformedAction2 = transformForNearestExistingNavigator(transformedAction, () => state, rootTree as StaticTreeNavigator)
    expect(transformedAction).toEqual(transformedAction2)
  })

  test('should throw error when screen is not found', () => {
    const rootTree = calculateStaticTreeDepth(staticTreeDeclaration)
    const originalAction = ConditionalActions.navigate({
      routeName: 'NON_EXISTING_ROUTE_NAME',
    })
    expect(() => transformForNearestExistingNavigator(originalAction, () => state, rootTree as StaticTreeNavigator)).toThrow(new Error('Missing static tree screen for route name: NON_EXISTING_ROUTE_NAME'))
  })
})
