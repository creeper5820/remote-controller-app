import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import { BaseUrl, AuthContext } from '../../App';

import styles from './homeStyles';

import RankScreen from './childPages/rank/rank';
import AnnouncementScreen from './childPages/announcement';
import ActivityScreen from './childPages/activity/activity';
import DrivePage from './childPages/drive/drive';
import ChargePage from '../../components/charge/charge'

import rankIcon from './images/rank.png';
import aboutUsIcon from './images/about_us.png';
import announcementIcon from './images/announcement.png';
import coinIcon from './images/coin.png';
import carIcon from './images/car.png';
import refreshIcon from './images/reload.png';



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
            <View style={styles.headerContainer}>
                <View style={styles.headerItem}>
                    <TouchableOpacity style={styles.headerIconContainerGreen} onPress={() => navigation.navigate('Rank')}>
                        <Image source={rankIcon} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>排行榜</Text>
                </View>
                <View style={styles.headerItem}>
                    <TouchableOpacity style={styles.headerIconContainerRed} onPress={() => navigation.navigate('Charge')}>
                        <Image source={aboutUsIcon} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>充值</Text>
                </View>
                <View style={styles.headerItem}>
                    <TouchableOpacity style={styles.headerIconContainerYellow} onPress={() => navigation.navigate('Announcement')}>
                        <Image source={announcementIcon} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>活动</Text>
                </View>
            </View>
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
            <>
                <TopBar userCoins={"-"} navigation={navigation} userName={"-"} />
                <View style={styles.container}>
                    <Header noticeContext={"加载失败"} navigation={navigation} />
                    <FlatList contentContainerStyle={styles.loadingContainer}
                        refreshControl={
                            <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshHomeInfo} />
                        }
                        ListEmptyComponent={<>
                            <Text style={styles.loadingText}>加载数据失败: {requestError}</Text>
                            <Text> 请尝试重新加载</Text>
                        </>}>
                    </FlatList>
                </View>
            </>
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
        return (<>
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
            <HomeStack.Screen name="Rank" component={RankScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="Charge" component={ChargePage} options={{ headerShown: false }} />
            <HomeStack.Screen name="Announcement" component={AnnouncementScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="Drive" component={DrivePage} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    );
}

