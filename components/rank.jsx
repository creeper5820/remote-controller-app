import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import avatarIcon from '../icons/avatar.jpg';
import { BaseUrl } from '../App';

const MedalIcon = ({ position }) => {
    const color = position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : '#CD7F32';
    return (
        <View style={[styles.medalIcon, { backgroundColor: color }]}>
            <Text style={styles.medalText}>{position}</Text>
        </View>
    );
};

const LeaderboardItem = ({ item, index, userInfo }) => {
    const userRank = userInfo.userRank - 1;
    return (
        <View style={[styles.leaderboardItem, index === userRank ? { backgroundColor: "#bbdefb" } : {}]}>
            {index < 3 ? (
                <MedalIcon position={index + 1} />
            ) : (
                <View style={[styles.medalIcon, { backgroundColor: "#FFF" }]}>
                    <Text style={index === userRank ? [styles.medalTextDefault, { color: "#64b5f6" }] : styles.medalTextDefault}>{index + 1}</Text>
                </View>
            )}
            <Image source={avatarIcon} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
        </View >
    )
};

function RankList({ LeaderboardData, loadingStatus, refreshing, refreshRankInfo, userInfo }) {
    switch (loadingStatus) {
        case 1:
            return (
                <FlatList
                    refreshControl={
                        <RefreshControl colors={['#2196f3']} refreshing={refreshing} onRefresh={refreshRankInfo} />
                    }
                    ListEmptyComponent={
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>暂无排行</Text>
                        </View>}
                    data={LeaderboardData}
                    renderItem={({ item, index }) => <LeaderboardItem item={item} index={index} userInfo={userInfo} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            );
        case -1:
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>加载数据失败,请重新加载</Text>
                </View>
            );
        default:
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>加载数据中...</Text>
                </View>
            );
    }
}

export default function Rank() {
    const axios = require('axios').default;

    const [rankInfoState, setRankInfoState] = React.useState(0);
    const [rankDataArray, setRankDataArray] = React.useState([]);
    const [userInfo, setUserInfo] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);

    const refreshRankInfo = () => {
        setRefreshing(true);
        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/ranking`)
            .then(function (response) {
                const status = response.status;
                const data = response.data;
                console.log(status);
                console.log(data);
                setRankDataArray(data.rankInfo);
                setUserInfo(data.userInfo);
                setRankInfoState(1);
                setRefreshing(false);
            })
            .catch(function (error) {
                setRankInfoState(-1);
                console.log(error);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        refreshRankInfo();
    }, []);

    return (
        <SafeAreaView style={styles.container}  >
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image
                        source={avatarIcon}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{userInfo ? userInfo.username : '未登录'}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userInfo ? userInfo.userRank : '-'}</Text>
                        <Text style={styles.statLabel}>当前排名</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userInfo ? userInfo.userCoins : '-'}</Text>
                        <Text style={styles.statLabel}>金币</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userInfo ? (userInfo.playingDuration > 3600 ? (userInfo.playingDuration / 60).toFixed(1) + "小时" : userInfo.playingDuration + "分钟") : '-'}</Text>
                        <Text style={styles.statLabel}>游玩时长</Text>
                    </View>
                </View>
            </View>
            <View style={styles.leaderboardContainer}>
                <View style={styles.leaderboardHeader}>
                    <Text style={[styles.leaderboardHeaderText, styles.activeTab]}>今日排行榜</Text>
                </View>
                <RankList LeaderboardData={rankDataArray} loadingStatus={rankInfoState} refreshing={refreshing} refreshRankInfo={refreshRankInfo} userInfo={userInfo} />
            </View>
        </SafeAreaView>
    );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e88e5',
    },
    header: {
        backgroundColor: '#1e88e5',
        paddingBottom: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statsContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        marginTop: 20,
        justifyContent: "space-evenly"
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#FFF',
    },
    leaderboardContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
    },
    leaderboardHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    leaderboardHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: '#888',
    },
    activeTab: {
        color: '#000',
        borderBottomWidth: 2,
        borderBottomColor: '#64b5f6',
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    medalIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medalText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    medalTextDefault: {
        color: '#000',
        fontWeight: 'bold',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    name: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    loadingContainer: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
    }
});