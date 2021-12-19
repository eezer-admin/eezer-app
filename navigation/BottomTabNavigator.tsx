/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import LogScreen from '../screens/LogScreen'
import TabOneScreen from '../screens/TabOneScreen'
import NewTransportScreen from '../screens/NewTransportScreen'
import LoginScreen from '../screens/LoginScreen'
import { BottomTabParamList, LogTabParamList, TabOneParamList, NewTransportParamList, LoginParamList } from '../types'
import isLoggedIn from '../hooks/isLoggedIn'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator () {
  const colorScheme = useColorScheme()
  const loggedIn = isLoggedIn()

  if (!loggedIn) {
    return (
      <BottomTab.Navigator
        initialRouteName="Login"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
        <BottomTab.Screen
          name="Login"
          component={LoginScreenNavigator}
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />
          }}
        />
        </BottomTab.Navigator>
    )
  }

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />
        }}
      />
      <BottomTab.Screen
        name="NewTransport"
        component={NewTransportNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Log"
        component={LogTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />
        }}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon (props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const LoginScreenStack = createStackNavigator<LoginParamList>()

function LoginScreenNavigator () {
  return (
    <LoginScreenStack.Navigator>
      <LoginScreenStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </LoginScreenStack.Navigator>
  )
}

const TabOneStack = createStackNavigator<TabOneParamList>()

function TabOneNavigator () {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerShown: false }}
      />
    </TabOneStack.Navigator>
  )
}

const NewTransportStack = createStackNavigator<NewTransportParamList>()

function NewTransportNavigator () {
  return (
    <NewTransportStack.Navigator>
      <NewTransportStack.Screen
        name="NewTransportScreen"
        component={NewTransportScreen}
        options={{ headerShown: false }}
      />
    </NewTransportStack.Navigator>
  )
}

const LogTabStack = createStackNavigator<LogTabParamList>()

function LogTabNavigator () {
  return (
    <LogTabStack.Navigator>
      <LogTabStack.Screen
        name="LogScreen"
        component={LogScreen}
        options={{ headerShown: false }}
      />
    </LogTabStack.Navigator>
  )
}
