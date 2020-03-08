import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import GroupsScreen from './screens/GroupsScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import GroupDetailScreen from './screens/GroupDetailScreen';

const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Groups: {
          screen: GroupsScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name='ios-people' size={24} color={tintColor} />
            )
          }
        },
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons
                name='md-navigate'
                size={48}
                color='#0D6038'
                style={{
                  shadowColor: '#0D6038',
                  shadowOffset: { width: 0, height: 10 },
                  shadowRadius: 10,
                  shadowOpacity: 0.3
                }}
              />
            )
          }
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name='ios-person' size={24} color={tintColor} />
            )
          }
        }
      },
      {
        tabBarOptions: {
          activeTintColor: '#161F3D',
          inactiveTintColor: '#B8BBC4',
          showLabel: false
        },
        initialRouteName: 'Home'
      }
    ),
    groupDetail: {
      screen: GroupDetailScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
    // initialRouteName: "postModal"
  }
);

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Loading'
    }
  )
);
