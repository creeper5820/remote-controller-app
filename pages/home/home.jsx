import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import { BaseUrl } from '../../App';

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



function TopBar({ userCoins, navigation }) {
    return (
        <View style={styles.topBar}>
            <Image source={coinIcon} style={styles.topBarCarIcon} />
            <Text onPress={() => navigation.navigate('Charge')} style={styles.topBarText}>我的金币: {userCoins}</Text>
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
                    <Text style={styles.headerText}>商城</Text>
                </View>
                <View style={styles.headerItem}>
                    <TouchableOpacity style={styles.headerIconContainerYellow} onPress={() => navigation.navigate('Announcement')}>
                        <Image source={announcementIcon} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>公告</Text>
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

function InfoTab({ navigation, activityInfo, loadingStatus, requestError, userCoins, announcement }) {
    switch (loadingStatus) {
        case 1:
            return (<>
                <TopBar userCoins={userCoins} navigation={navigation} />
                <View style={styles.container}>
                    <Header noticeContext={announcement} navigation={navigation} />
                    <FlatList
                        data={activityInfo}
                        renderItem={({ item }) => <ActivityCard activityInfo={item} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </>
            );
        case -1:
            return (
                <>
                    <TopBar userCoins={"-"} navigation={navigation} />
                    <View style={styles.container}>
                        <Header noticeContext={"加载失败"} navigation={navigation} />
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>加载数据失败: {requestError}</Text>
                            <Text> 请尝试重新加载</Text>
                        </View>
                    </View>
                </>
            );
        default:
            return (
                <>
                    <TopBar userCoins={"-"} navigation={navigation} />
                    <View style={styles.container}>
                        <Header noticeContext={"加载中"} navigation={navigation} />
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>加载数据中...</Text>
                        </View>
                    </View>
                </>
            );
    }
}

function HomePage({ navigation }) {
    const axios = require('axios').default;

    const [activityInfoArray, setActivityInfoArray] = React.useState([]);
    const [userCoins, setUserCoins] = React.useState([]);
    const [announcement, setAnnouncement] = React.useState([]);

    const [homeInfoState, setHomeInfoState] = React.useState(0);
    const [requestError, setRequestError] = React.useState("");

    useEffect(() => {
        if (homeInfoState !== 1) {
            axios.get(`${BaseUrl}/api/homepage`)
                .then(function (response) {
                    const status = response.status;
                    const data = response.data;
                    console.log(status);
                    console.log(data);
                    setActivityInfoArray(data.activities);
                    setAnnouncement(data.announcement);
                    setUserCoins(data.coins);
                    setHomeInfoState(1);
                })
                .catch(function (error) {
                    setHomeInfoState(-1);
                    setRequestError(error.message);
                    console.log(error);
                })
        }
    }, [homeInfoState]);

    return (
        <>
            <OrientationLocker orientation={PORTRAIT} />
            <InfoTab navigation={navigation} activityInfo={activityInfoArray} loadingStatus={homeInfoState} requestError={requestError} userCoins={userCoins} announcement={announcement} />
            <TouchableOpacity style={styles.refreshButton} onPress={() => setHomeInfoState(0)}>
                <Image source={refreshIcon} style={styles.refreshIcon} />
            </TouchableOpacity>
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

