import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import { BaseUrl, AuthContext } from '../../App';

import DrivePage from '../../components/drive';
import ChargePage from '../../components/charge'
import ActivityPage from '../../components/activity';

import coinIcon from '../../icons/coin.png';
import carIcon from '../../icons/car.png';
import refreshIcon from '../../icons/reload.png';

function TopBar({ userCoins, userName, navigation }) {
    userCoins = userCoins > 10000 ? (userCoins / 10000).toFixed(1) + '万' : userCoins
    return (
        <View style={styles.topBar}>
            <Image source={coinIcon} style={styles.topBarCarIcon} />
            <Text onPress={() => navigation.navigate('Charge')} style={styles.topBarText}>我的金币: {userCoins}</Text>
            <Text style={styles.topBarWelcomeText}>欢迎您， {userName}</Text>
        </View>
    )
}

function Header({ noticeContext, navigation }) {
    return (
        <View style={styles.header}>
            <View style={styles.announcementContainer}>
                <Text style={styles.announcementText} onPress={() => navigation.navigate('Announcement')}>{noticeContext}</Text>
            </View>
        </View>
    )
};

function ActivityCard({ activityInfo, navigation }) {
    const { eventName, manufacture, onlineNumber, driveNumber, id } = { ...activityInfo };
    const freeNumber = onlineNumber - driveNumber
    const processedEventName = eventName.length <= 7 ? eventName : eventName.slice(0, 8) + '...';
    const processedManufacture = manufacture.length <= 7 ? manufacture : manufacture.slice(0, 8) + '...';

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.statusBadge}>营业中</Text>
                <Text style={styles.eventTitle}>{processedEventName}</Text>
                <Text style={styles.recommendBadge}>推荐</Text>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.carImageInfo}>
                    <Image source={carIcon} style={styles.carImage} />
                    <Text style={styles.manufactureText}>{processedManufacture}</Text>
                </View>
                <View style={styles.carDetails}>
                    <Text style={styles.queueText}>空闲车辆 <Text style={freeNumber > 5 ? styles.boldTextGreen : styles.boldTextRed}>{freeNumber}</Text> 辆</Text>
                    <View style={styles.carStatus}>
                        <Text style={styles.normalText}>在线车辆 {onlineNumber} 辆</Text>
                        <Text style={styles.normalText}>驾驶中 {driveNumber} 辆</Text>
                    </View>
                    <TouchableOpacity style={styles.driveButton} onPress={() => navigation.navigate('Activity', { ActivityInfo: activityInfo })} >
                        <Text style={styles.driveButtonText}>{driveNumber} 人正在驾驶</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

function InfoTab({ homePageData, requestError, refreshing, refreshHomeInfo, navigation }) {

    if (requestError)
        return (
            <ScrollView style={styles.container}
                refreshControl={
                    <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshHomeInfo} />
                }>
                <TopBar userCoins={"-"} navigation={navigation} userName={"-"} />
                <View style={styles.container}>
                    <Header noticeContext={"加载失败"} navigation={navigation} />
                    <Text style={styles.loadingText}>加载数据失败: {requestError}</Text>
                    <Text> 请尝试重新加载</Text>
                </View>
            </ScrollView>
        )

    else if (!homePageData)
        return (
            <>
                <TopBar userCoins={"-"} navigation={navigation} userName={"-"} />
                <View style={styles.container}>
                    <Header noticeContext={"加载中"} navigation={navigation} />
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>加载数据中...</Text>
                    </View>
                </View>
            </>
        )
    else {
        const { userInfo, activities: activityInfo, announcement } = { ...homePageData };
        const { userCoins, username } = { ...userInfo };
        return (
            <>
                <TopBar userCoins={userCoins} navigation={navigation} userName={username} />
                <View style={styles.container}>
                    <Header noticeContext={announcement} navigation={navigation} />
                    <FlatList
                        refreshControl={
                            <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshHomeInfo} />
                        }
                        data={activityInfo}
                        renderItem={({ item }) => <ActivityCard activityInfo={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </>
        );
    }

}

function HomePage({ navigation }) {

    const { state, dispatch } = React.useContext(AuthContext);

    const [homePageData, setHomePageData] = React.useState(null);
    const [requestError, setRequestError] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);

    const refreshHomeInfo = () => {
        setRefreshing(true);
        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/homepage?token=${state.token}`)
            .then(function (response) {
                const data = response.data;
                console.log("[homepage] received data:", data);
                setHomePageData(data);
                setRequestError(null);
                setRefreshing(false);
            })
            .catch(function (error) {
                console.log("[homepage] error:", error);
                setHomePageData(null);
                setRequestError(error.message);
                setRefreshing(false);
            })
    }

    useEffect(() => {
        if (!homePageData)
            refreshHomeInfo();
    }, [homePageData]);

    return (
        <>
            <OrientationLocker orientation={PORTRAIT} />
            <InfoTab navigation={navigation} homePageData={homePageData} requestError={requestError} refreshing={refreshing} refreshHomeInfo={refreshHomeInfo} />
        </>
    );
}

const HomeStack = createNativeStackNavigator();
export default function Home({ navigation, route }) {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="HomeScreen" component={HomePage} options={{ headerShown: false }} />
            <HomeStack.Screen name="Charge" component={ChargePage} options={{ headerShown: false }} />
            <HomeStack.Screen name="Drive" component={DrivePage} options={{ headerShown: false }} />
            <HomeStack.Screen name="Activity" component={ActivityPage} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    );
}


import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        justifyContent: 'space-between',
        padding: 15,
    },
    topBarCarIcon: {
        width: 25,
        height: 25,
    },
    topBarText: {
        marginLeft: 10,
        marginRight: 'auto',
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 17,
        fontWeight: 'light',
    },
    topBarWelcomeText: {
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 17,
        fontWeight: 'light',
    },
    header: {
        backgroundColor: '#fff',
        padding: 15,
    },
    announcementContainer: {
        backgroundColor: '#e0f7fa',
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 10,
    },
    announcementText: {
        color: '#0277bd',
        fontSize: 16,
    },
    cardContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusBadge: {
        backgroundColor: '#f68026',
        color: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
        fontSize: 12,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
    },
    recommendBadge: {
        color: '#5cc1f1',
        fontSize: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#e1f5fe',
    },
    cardContent: {
        flexDirection: 'row',
    },
    carImage: {
        width: 80,
        height: 80,
        margin: 15,
        borderRadius: 10,
    },
    carInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    carImageInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    queueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        margin: 10,
        alignSelf: 'center',
    },
    manufactureText: {
        color: '#333',
        margin: 10,
        alignSelf: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    normalText: {
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
    },
    boldTextRed: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ec3737',
    },
    boldTextGreen: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7DDA58',
    },
    driveButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 25,
        marginHorizontal: 25,
        justifyContent: 'space-between',
    },
    driveButtonText: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
    },
    carStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
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