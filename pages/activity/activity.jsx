import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import rankIcon from '../../icons/rank.png';

import { BaseUrl } from "../../App";
import RankScreen from '../../components/rank';

function Header({ userInfo, navigation }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.navigate('Rank')}>
                <View style={styles.headerIconContainerGreen} >
                    <Image source={rankIcon} style={styles.headerIcon} />
                    <Text style={styles.headerTextSmall}>点击查看排行榜</Text>
                </View>
                <View style={styles.headerIconContainerGreen} >
                    <Text style={styles.headerText}>我的排名</Text>
                    <Text style={styles.headerTextLarge}>{userInfo ? userInfo.userRank : '未上榜'}</Text>
                </View>
                <View style={styles.headerIconContainerGreen} >
                    <Text style={styles.headerText}>我的游玩时长</Text>
                    <Text style={styles.headerTextLarge}>{userInfo ? userInfo.playingDuration + " 分钟" : '无数据'}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
};

function AnnouncementCard({ navigation, announcementInfo }) {
    const { title, content } = announcementInfo;
    return (
        <TouchableOpacity style={styles.announcementContainer}>
            <Text style={styles.announcementTitle}>{title}</Text>
            <Text style={styles.announcementContent}>{content}</Text>
        </TouchableOpacity>
    )
}


function Activity({ navigation }) {
    const [announcementInfoArray, setAnnouncementInfoArray] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [requestError, setRequestError] = useState(null);
    const refreshActivityInfo = () => {
        setRefreshing(true);
        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/activitypage`)
            .then(function (response) {
                const data = response.data;
                console.log("[activitypage] received data:", data);
                setAnnouncementInfoArray(data.announcementInfoArray);
                setUserInfo(data.userInfo);
                setRequestError(null);
                setRefreshing(false);
            })
            .catch(function (error) {
                console.log("[activitypage] error:", error);
                setAnnouncementInfoArray(null);
                setRequestError(error.message);
                setRefreshing(false);
            })
    }

    useEffect(() => {
        if (!announcementInfoArray)
            refreshActivityInfo();
    }, [announcementInfoArray]);

    if (requestError) {
        return (
            <ScrollView style={styles.container}
                refreshControl={
                    <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshActivityInfo} />
                }>
                <Header navigation={navigation} userInfo={userInfo} />
                <View style={styles.announcementBarTitle}>
                    <Text style={styles.announcementBarTitleText}>活动与公告</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>加载数据失败: {requestError}</Text>
                    <Text style={styles.loadingText}> 请尝试重新加载</Text>
                </View>
            </ScrollView>
        );
    } else if (!announcementInfoArray) {
        return (
            <View style={styles.container}>
                <Header navigation={navigation} userInfo={userInfo} />
                <View style={styles.announcementBarTitle}>
                    <Text style={styles.announcementBarTitleText}>活动与公告</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>加载数据中...</Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Header navigation={navigation} userInfo={userInfo} />
                <View style={styles.announcementBarTitle}>
                    <Text style={styles.announcementBarTitleText}>活动与公告</Text>
                </View>
                <FlatList
                    refreshControl={
                        <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshActivityInfo} />
                    }
                    ListEmptyComponent={
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>暂无公告</Text>
                        </View>}
                    data={announcementInfoArray}
                    renderItem={({ item }) => <AnnouncementCard navigation={navigation} announcementInfo={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }

}

const ActivityStack = createNativeStackNavigator();
export default function ActivityPage({ navigation, route }) {

    return (
        <ActivityStack.Navigator>
            <ActivityStack.Screen name="ActivityScreen" component={Activity} options={{ headerShown: false }} />
            <ActivityStack.Screen name="Rank" component={RankScreen} options={{ headerShown: false }} />
        </ActivityStack.Navigator>
    );
}


import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#58d68d',
        padding: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerIcon: {
        width: 50,
        height: 50,
    },
    headerIconContainerGreen: {
        alignItems: 'center',
        backgroundColor: '#58d68d',
        borderRadius: 20,
        padding: 10
    },
    headerText: {
        fontSize: 16,
        color: '#fff',
    },
    headerTextSmall: {
        fontSize: 12,
        color: '#fff',
    },
    headerTextLarge: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
    },
    announcementBarTitle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        margin: 5,
        marginBottom: 0,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
    },
    announcementBarTitleText: {
        fontSize: 16,
        color: '#666',
    },
    announcementContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        margin: 5,
        marginVertical: 1,
        padding: 20,
        borderRadius: 10,
    },
    announcementTitle: {
        fontSize: 20,
        color: '#666',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    refreshButton: {
        backgroundColor: 'rgba(30, 100, 255 , 0.8)',
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshIcon: {
        width: 40,
        height: 40,
    },
});