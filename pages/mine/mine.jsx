import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import avatarIcon from "../home/images/avatar.jpg";
import goToIcon from "../../icons/goto.png";



export default function Mine() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.profileContainer}>
                    <Image
                        source={avatarIcon}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>何小萍</Text>
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <TouchableOpacity style={styles.statItem}>
                        <Text style={styles.statValue}>3876</Text>
                        <Text style={styles.statLabel}>金币</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.statItem}>
                        <Text style={styles.statValue}>25分钟</Text>
                        <Text style={styles.statLabel}>游玩时长</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.userOperationContainer}>
                <TouchableOpacity style={styles.userOperationItemFirst}>
                    <Text style={styles.userOperationText}>充值</Text>
                    <Image source={goToIcon} style={styles.goToIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userOperationItem}>
                    <Text style={styles.userOperationText}>提现</Text>
                    <Image source={goToIcon} style={styles.goToIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userOperationItem}>
                    <Text style={styles.userOperationText}>邀请好友</Text>
                    <Image source={goToIcon} style={styles.goToIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userOperationItem}>
                    <Text style={styles.userOperationText}>设置</Text>
                    <Image source={goToIcon} style={styles.goToIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userOperationItem}>
                    <Text style={styles.userOperationText}>意见反馈</Text>
                    <Image source={goToIcon} style={styles.goToIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userOperationItem}>
                    <Text style={styles.userOperationText}>关于</Text>
                    <Image source={goToIcon} style={styles.goToIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
