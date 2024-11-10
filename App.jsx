import React, { useEffect, useReducer, createContext } from 'react';
import { Image } from 'react-native';

import Home from './pages/home/home';
import Mine from './pages/mine/mine';
import ActivityPage from './pages/activity/activity';
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
import activityIcon from './icons/activity.png';
import activityFillIcon from './icons/activityFill.png';


const TabBar = createBottomTabNavigator()
const LoginStack = createNativeStackNavigator();

export const AuthContext = createContext();
export const BaseUrl = 'http://10.31.1.213:8000';

const screenOptions = ({ route }) => ({
	tabBarIcon: ({ focused, color, size }) => {
		let iconName;
		switch (route.name) {
			case '主页':
				iconName = focused ? homeFillIcon : homeIcon;
				break;
			case '我的':
				iconName = focused ? userFillIcon : userIcon;
				break;
			case '活动':
				iconName = focused ? activityFillIcon : activityIcon;
				break;
			default:
				break;
		}
		return <Image source={iconName} style={{ width: 30, height: 30 }} />;
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
			dispatch({ type: 'reactive', token: storedToken });


			// const axios = require('axios').default;
			// const response = await axios.get(`${BaseUrl}/api/reactive?token=${storedToken}`);
			// console.log('[App] reactiveToken: axios response =', response.data);
			// const { result, token } = response.data;
			// if (result === 200) {
			// 	dispatch({ type: 'reactive', token });
			// 	console.log('[App] reactiveToken: reactive success');
			// } else {
			// 	dispatch({ type: 'reactive', token: null });
			// 	console.log('[App] reactiveToken: reactive failed');
			// }
		} catch (error) {
			dispatch({ type: 'reactive', token: null });
			console.error('[App] reactiveToken failed:', error);
		}
	}

	useEffect(() => {
		reactiveToken();
	}, []);

	return (
		<NavigationContainer>
			<AuthContext.Provider value={{ state, dispatch }}>
				{state.token ?
					(
						<TabBar.Navigator initialRouteName="Home" screenOptions={screenOptions}>
							<TabBar.Screen name="主页" component={Home} />
							<TabBar.Screen name="活动" component={ActivityPage} />
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

