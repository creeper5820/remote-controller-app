import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import avatarIcon from '../../images/avatar.jpg';


const MedalIcon = ({ position }) => {
    const color = position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : '#CD7F32';
    return (
        <View style={[styles.medalIcon, { backgroundColor: color }]}>
            <Text style={styles.medalText}>{position}</Text>
        </View>
    );
};

const LeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardItem}>
        {index < 3 ? (
            <MedalIcon position={index + 1} />
        ) : (
            <View style={[styles.medalIcon, { backgroundColor: "#FFF" }]}>
                <Text style={styles.medalTextDefault}>{index + 1}</Text>
            </View>

        )}
        <Image source={avatarIcon} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.score}>{item.score}</Text>
    </View>
);

function RankList({ LeaderboardData, loadingStatus }) {
    switch (loadingStatus) {
        case 1:
            return (
                <FlatList
                    data={LeaderboardData}
                    renderItem={LeaderboardItem}
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

    useEffect(() => {
        axios.get('http://10.31.3.103:8000/api/ranking')
            .then(function (response) {
                const status = response.status;
                const data = response.data;
                console.log(status);
                console.log(data);
                setRankDataArray(data);
                setRankInfoState(1);
            })
            .catch(function (error) {
                setRankInfoState(-1);
                console.log(error);
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image
                        source={avatarIcon}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>何小萍</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>122</Text>
                        <Text style={styles.statLabel}>当前排名</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>3876</Text>
                        <Text style={styles.statLabel}>金币</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>25分钟</Text>
                        <Text style={styles.statLabel}>游玩时长</Text>
                    </View>
                </View>
            </View>
            <View style={styles.leaderboardContainer}>
                <View style={styles.leaderboardHeader}>
                    <Text style={[styles.leaderboardHeaderText, styles.activeTab]}>今日榜</Text>
                    <Text style={styles.leaderboardHeaderText}>昨日榜</Text>
                </View>
                <RankList LeaderboardData={rankDataArray} loadingStatus={rankInfoState} />
            </View>


        </SafeAreaView>
    );
}
