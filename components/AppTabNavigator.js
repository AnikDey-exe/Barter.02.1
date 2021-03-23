import React, { Component } from 'react';
import { View, StyleSheet, Text, Image} from 'react-native';
import ExchangeScreen from '../screens/ExchangeScreen';
import HomeScreen from '../screens/HomeScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {AppStackNavigator} from './AppStackNavigator';

export const AppTabNavigator = createBottomTabNavigator({
    HomeScreen: {
        screen: AppStackNavigator,
        navigationOptions: {
            tabBarIcon: 
            <Image
            source={require('../assets/barter.png')}
            style={{width: 20, height: 20}}/>,
            tabBarLabel: "Home"
        }
    },
    ExchangeItem: {
        screen: ExchangeScreen,
        navigationOptions: {
            tabBarIcon: 
            <Image
            source={require('../assets/barter.png')}
            style={{width: 20, height: 20}}/>,
            tabBarLabel: "Exchange Items"
        }
    },
 
});