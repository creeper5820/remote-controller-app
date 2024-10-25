import React, { useEffect, useReducer, createContext, useState } from 'react';
import Home from './pages/home/home';
import Mine from './pages/mine/mine';
import WebrtcPlayer from './pages/test/test';

import LoginScreen from './pages/login/login';
import RegisterScreen from './pages/login/register';
import { getToken, saveToken } from './pages/login/tokenStorage';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import homeIcon from './icons/home.png';
import homeFillIcon from './icons/homefill.png';
import userIcon from './icons/user.png';
import userFillIcon from './icons/userfill.png';

import { Image, View, Text } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const TabBar = createBottomTabNavigator()
const LoginStack = createNativeStackNavigator();

export const AuthContext = createContext();


const screenOptions = ({ route }) => ({
	tabBarIcon: ({ focused, color, size }) => {
		const iconName = route.name === "主页" ?
			(focused ? homeFillIcon : homeIcon) : (focused ? userFillIcon : userIcon);
		return (<Image source={iconName} style={{ height: 30, width: 30 }} />);
	},
	tabBarActiveTintColor: '#0284c7',
	tabBarInactiveTintColor: 'gray',
	headerShown: false
});

const axios = require('axios').default;

const reducer = (state, action) => {
	switch (action.type) {
		case 'login':
			return { ...state, token: action.token };
		case 'register':
			return { ...state, token: action.token };
		case 'reactive':
			return { ...state, token: action.token };
		default:
			return state;
	}
};


const App = () => {
	const [state, dispatch] = useReducer(reducer, { token: null });

	getToken().then(token => dispatch({ type: 'reactive', token: token }));

	return (
		<NavigationContainer>
			<AuthContext.Provider value={{ state, dispatch }}>
				{state.token ?
					(
						<TabBar.Navigator initialRouteName="Home" screenOptions={screenOptions}>
							<TabBar.Screen name="主页" component={Home} />
							<TabBar.Screen name="个人中心" component={Mine} />
						</TabBar.Navigator>
					) :
					(
						<LoginStack.Navigator>
							<LoginStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
							<LoginStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
						</LoginStack.Navigator>
					)
				}
			</AuthContext.Provider>
		</NavigationContainer>
	);
};

export default App;

