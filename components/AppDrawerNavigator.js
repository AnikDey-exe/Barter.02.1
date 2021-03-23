import React, { Component } from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyTradesScreen from '../screens/MyTradesScreen';
import NotificationScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: AppTabNavigator
        },
        MyTrades: {
            screen: MyTradesScreen,
        },
        Notifications: {
            screen: NotificationScreen
        },
        Settings: {
            screen: SettingsScreen
        }
    },

    {
        contentComponent:  CustomSideBarMenu
    },

    {
        InitialRouteName: 'Home'
    }
);