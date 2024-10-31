import React, { useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, RefreshControl, ScrollView, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext, BaseUrl } from '../../App';


import styles from './style';
import avatarIcon from "../home/images/avatar.jpg";
import goToIcon from "../../icons/goto.png";

import ChargePage from '../../components/charge/charge'
import InvitePage from './invite'
import AboutUsPage from './aboutUs';
import FeedbackPage from './feedback';
import SettingsPage from './settings';

function MinePage({ navigation }) {
    const { state, dispatch } = useContext(AuthContext);
    const [userInfo, setUserInfo] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);

    const logout = () => {
        Alert.alert(
            "退出登录",
            "您确定要退出登录吗？",
            [
                { text: "取消", style: "cancel" },
                {
                    text: "确定", onPress: () => {
                        console.log('[Mine] logout');
                        dispatch({ type: 'logout', token: null });
                    }
                }
            ]
        );
    };

    const refreshUserInfo = () => {
        setRefreshing(true);
        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/profile?token=${state.token}`)
            .then(function (response) {
                const data = response.data;
                console.log("[Mine] received data:", data);
                setUserInfo(data.userInfo);
                setRefreshing(false);
            })
            .catch(function (error) {
                console.log("[Mine] error:", error);
                setUserInfo(null);
                setRefreshing(false);
            })
    };

    useEffect(() => {
        if (!userInfo)
            refreshUserInfo();

    }, [userInfo]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewContainer}
                refreshControl={
                    <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshUserInfo} />
                }>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.profileContainer}>
                        <Image
                            source={avatarIcon}
                            style={styles.profileImage}
                        />
                        <Text style={styles.profileName}>{userInfo ? userInfo.username : '未登录'}</Text>
                        <Text style={styles.profileLevel}>{userInfo ? `Lv ${userInfo.userLevel}` : 'Lv -'}</Text>
                    </TouchableOpacity>
                    <View style={styles.statsContainer}>
                        <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Charge')}>
                            <Text style={styles.statValue}>{userInfo ? userInfo.userCoins : '-'}</Text>
                            <Text style={styles.statLabel}>金币</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statItem}>
                            <Text style={styles.statValue}>{userInfo ? (userInfo.playingDuration > 3600 ? (userInfo.playingDuration / 60).toFixed(1) + "小时" : userInfo.playingDuration + "分钟") : '-'}</Text>
                            <Text style={styles.statLabel}>游玩时长</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.userOperationContainer}>
                    <TouchableOpacity style={styles.userOperationItemFirst} onPress={() => navigation.navigate('Charge')}>
                        <Text style={styles.userOperationText}>充值</Text>
                        <Image source={goToIcon} style={styles.goToIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userOperationItem} onPress={() => navigation.navigate('Invite')}>
                        <Text style={styles.userOperationText}>邀请好友</Text>
                        <Image source={goToIcon} style={styles.goToIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userOperationItem} onPress={() => navigation.navigate('Settings')}>
                        <Text style={styles.userOperationText}>设置</Text>
                        <Image source={goToIcon} style={styles.goToIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userOperationItem} onPress={() => navigation.navigate('Feedback')}>
                        <Text style={styles.userOperationText}>意见反馈</Text>
                        <Image source={goToIcon} style={styles.goToIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userOperationItem} onPress={() => navigation.navigate('AboutUs')}>
                        <Text style={styles.userOperationText}>关于</Text>
                        <Image source={goToIcon} style={styles.goToIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>退出登录</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const MineStack = createNativeStackNavigator();
export default function Mine({ navigation, route }) {
    return (
        <MineStack.Navigator>
            <MineStack.Screen name="Mine" component={MinePage} options={{ headerShown: false }} />
            <MineStack.Screen name="Charge" component={ChargePage} options={{ headerShown: false }} />
            <MineStack.Screen name="Invite" component={InvitePage} options={{ headerShown: false }} />
            <MineStack.Screen name="AboutUs" component={AboutUsPage} options={{ headerShown: false }} />
            <MineStack.Screen name="Feedback" component={FeedbackPage} options={{ headerShown: false }} />
            <MineStack.Screen name="Settings" component={SettingsPage} options={{ headerShown: false }} />
        </MineStack.Navigator>
    );
}
