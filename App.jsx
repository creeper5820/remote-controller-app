import React, { useEffect, useReducer, createContext, useState, useContext } from 'react';
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

const TabBar = createBottomTabNavigator()
const LoginStack = createNativeStackNavigator();

export const AuthContext = createContext();

export const BaseUrl = 'http://10.31.1.213:8000';

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


const reducer = (state, action) => {
	console.log('[App] reducer called with state =', state);
	console.log('[App] reducer called with action =', action);
	switch (action.type) {
		case 'login':
			console.log('[App] reducer: login');
		case 'register':
			console.log('[App] reducer: register');
		case 'reactive':
			console.log('[App] reducer: reactive');
		default:
			console.log('[App] reducer: default');
			return { ...state, token: action.token };
	}
};

const App = () => {
	const [state, dispatch] = useReducer(reducer, { token: null });

	const reactiveToken = async () => {
		console.log('[App] reactiveToken called');
		try {
			const storedToken = await getToken();
			console.log('[App] reactiveToken: storedToken =', storedToken);
			if (!storedToken) {
				console.log('[App] back to login');
				return;
			}
			const axios = require('axios').default;
			const response = await axios.get(`${BaseUrl}/api/reactive?token=${storedToken}`);
			console.log('[App] reactiveToken: axios response =', response.data);
			const { result, token } = response.data;
			if (result === 200) {
				dispatch({ type: 'reactive', token });
				console.log('[App] reactiveToken: reactive success');
			} else {
				dispatch({ type: 'reactive', token: null });
				console.log('[App] reactiveToken: reactive failed');
			}
		} catch (error) {
			dispatch({ type: 'reactive', token: null });
			console.error('[App] reactiveToken failed:', error);
		}
	}

	useEffect(() => {
		// saveToken({ token: "aaaa" });
		reactiveToken();
	}, []);

	return (
		<NavigationContainer>
			<AuthContext.Provider value={{ state, dispatch }}>
				{state.token ?
					(
						<TabBar.Navigator initialRouteName="Home" screenOptions={screenOptions}>
							<TabBar.Screen name="主页" component={Home} />
							<TabBar.Screen name="我的" component={Mine} />
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

