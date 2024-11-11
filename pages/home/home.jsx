import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import axios from 'axios';
import { BaseUrl, AuthContext } from '../../App';

import DrivePage from '../../components/drive';
import ChargePage from '../../components/charge'
import ActivityPage from '../../components/activity';

import coinIcon from '../../icons/coin.png';
import carIcon from '../../icons/car.png';
import coinCategoryIcon from '../../icons/coin.jpg';
import advancedCategoryIcon from '../../icons/advanced.jpg';
import freeCategoryIcon from '../../icons/free.jpg';

import jeepIcon from '../../icons/jeep.webp';
import tankIcon from '../../icons/tank.webp';
import boatIcon from '../../icons/yacht.webp';
import excavatorIcon from '../../icons/excavator.jpg';

// 定义类别和显示名称的映射
const categoryMappings = {
    levels: {
        'advanced': { text: '高级场', icon: advancedCategoryIcon },
        'free': { text: '免费场', icon: freeCategoryIcon },
        'coin': { text: '活动场', icon: coinCategoryIcon },
    },
    vehicles: {
        'car': { text: '车', icon: jeepIcon },
        'boat': { text: '船', icon: boatIcon },
        'tank': { text: '坦克', icon: tankIcon },
        'excavator': { text: '挖掘机', icon: excavatorIcon },
    }
};

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
}

function ActivityCard({ activityInfo, navigation }) {
    const { eventName, manufacture, onlineNumber, driveNumber, id } = { ...activityInfo };
    const freeNumber = onlineNumber - driveNumber
    const processedEventName = eventName.length <= 10 ? eventName : eventName.slice(0, 10) + '...';
    const processedManufacture = manufacture.length <= 7 ? manufacture : manufacture.slice(0, 8) + '...';

    return (
        <View style={styles.cardContainer}>
            <View style={styles.carImageInfo}>
                <Image source={carIcon} style={styles.carImage} />
                <Text style={styles.manufactureText}>{processedManufacture}</Text>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.eventTitle}>{processedEventName}</Text>
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
}

function FilterButtons({ selectedCategories, toggleCategory, toggleAllCategories, categoryType }) {
    const categories = Object.keys(categoryMappings[categoryType]);
    const allSelected = selectedCategories.length === categories.length;

    return (
        <View style={categoryType === "levels" ? styles.filterContainer : styles.filterContainerSmall}>
            {categoryType !== "levels" &&
                <TouchableOpacity style={categoryType === "levels" ?
                    [styles.filterButton, allSelected && styles.filterButtonSelected] :
                    [styles.filterButtonSmall, allSelected && styles.filterButtonSelectedSmall]}
                    onPress={() => toggleAllCategories(categoryType)} >
                    <Text style={[styles.filterButtonTextSmall, allSelected && styles.filterButtonTextSelected]}> 全部 </Text>
                </TouchableOpacity>
            }
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={categoryType == "levels" ? [
                        styles.filterButton,
                        selectedCategories.includes(category) && styles.filterButtonSelected,
                    ] : [
                        styles.filterButtonSmall,
                        selectedCategories.includes(category) && styles.filterButtonSelectedSmall,
                    ]}
                    onPress={() => toggleCategory(categoryType, category)}
                >
                    <Image source={categoryMappings[categoryType][category].icon} style={categoryType == "levels" ? styles.filterButtonIcon : styles.filterButtonIconSmall} />
                    {categoryType == "levels" && <Text style={
                        [styles.filterButtonText, selectedCategories.includes(category) && styles.filterButtonTextSelected]}>
                        {categoryMappings[categoryType][category].text}
                    </Text>}
                </TouchableOpacity>
            ))}
        </View>
    );
}

function InfoTab({ homePageData, requestError, refreshing, refreshHomeInfo, navigation, selectedLevels, selectedVehicles, toggleCategory, toggleAllCategories }) {
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
                    <Text>请尝试重新加载</Text>
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
                    <FilterButtons
                        selectedCategories={selectedLevels}
                        toggleCategory={toggleCategory}
                        toggleAllCategories={toggleAllCategories}
                        categoryType="levels"
                    />
                    <FilterButtons
                        selectedCategories={selectedVehicles}
                        toggleCategory={toggleCategory}
                        toggleAllCategories={toggleAllCategories}
                        categoryType="vehicles"
                    />
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
    const { state } = React.useContext(AuthContext);
    const [homePageData, setHomePageData] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(["free"]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);

    const toggleCategory = (categoryType, category) => {
        const setSelectedCategories = categoryType === 'levels' ? setSelectedLevel : setSelectedVehicles;
        if (categoryType === "levels")
            setSelectedCategories([category])
        else
            setSelectedCategories(prev =>
                prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
            );
    };

    const toggleAllCategories = (categoryType) => {
        const setSelectedCategories = categoryType === 'levels' ? setSelectedLevel : setSelectedVehicles;
        const categories = Object.keys(categoryMappings[categoryType]);
        setSelectedCategories(prev =>
            prev.length === categories.length ? [] : [...categories]
        );
    };

    const refreshHomeInfo = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`${BaseUrl}/api/homepage`, {
                params: {
                    token: state.token,
                    levels: selectedLevel.join(','),
                    vehicles: selectedVehicles.join(',')
                }
            });
            setHomePageData(response.data);
            setRequestError(null);
        } catch (error) {
            console.log("[homepage] error:", error);
            setHomePageData(null);
            setRequestError(error.message);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        refreshHomeInfo();
    }, [selectedLevel, selectedVehicles]);

    return (
        <>
            <OrientationLocker orientation={PORTRAIT} />
            <InfoTab
                navigation={navigation}
                homePageData={homePageData}
                requestError={requestError}
                refreshing={refreshing}
                refreshHomeInfo={refreshHomeInfo}
                selectedLevels={selectedLevel}
                selectedVehicles={selectedVehicles}
                toggleCategory={toggleCategory}
                toggleAllCategories={toggleAllCategories}
            />
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
        paddingVertical: 30,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    announcementText: {
        textAlign: 'center',
        color: '#0277bd',
        fontSize: 16,
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    statusBadge: {
        backgroundColor: '#f68026',
        color: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 0,
        fontSize: 12,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
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
        flexDirection: 'column',
        margin: "auto",
    },
    carImage: {
        width: 80,
        height: 80,
        margin: 15,
        borderRadius: 10,
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 20,
        alignSelf: 'left',
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginHorizontal: 20,
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
        paddingVertical: 5,
        marginBottom: 15,
        borderRadius: 25,
        marginHorizontal: 5,
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
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    filterContainerSmall: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
    },
    filterButtonIcon: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },
    filterButtonIconSmall: {
        width: 40,
        height: 40,
    },
    filterButton: {
        opacity: 0.7,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2196f3',
        marginHorizontal: 4,
    },
    filterButtonSmall: {
        flexDirection: 'column',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#2196f3',
        marginHorizontal: 4,
    },
    filterButtonSelected: {
        opacity: 1,
        borderColor: '#2196f3',
        borderBottomWidth: 3,
    },
    filterButtonSelectedSmall: {
        backgroundColor: '#ebf5fb',
        borderColor: '#2196f3',
    },
    filterButtonText: {
        textAlign: 'center',
        color: '#90caf9',
        fontSize: 14,
        fontWeight: '500',
    },
    filterButtonTextSmall: {
        color: '#2196f3',
        margin: 'auto',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
    },
    filterButtonTextSelected: {
        color: '#2196f3',
    },
});