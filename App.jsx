import React from 'react';
import Home from './pages/home/home';
import Mine from './pages/mine/mine';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import homeIcon from './icons/home.png';
import homeFillIcon from './icons/homefill.png';
import userIcon from './icons/user.png';
import userFillIcon from './icons/userfill.png';

import { Image, View } from 'react-native';

const TabBar = createBottomTabNavigator()
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

const App = () => {
  return (
    <NavigationContainer>
      <TabBar.Navigator initialRouteName="Home"
        screenOptions={screenOptions}>
        <TabBar.Screen
          name="主页"
          component={Home}
        />
        <TabBar.Screen
          name="个人中心"
          component={Mine}
        />
      </TabBar.Navigator>
    </NavigationContainer >
  );
};

export default App;

