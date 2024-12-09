import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
export default function InviteFriends() {
    const [inviteCode, setInviteCode] = useState('DHIKSU83S');
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     // 模拟初始加载邀请码
    //     fetchInviteCode();
    // }, []);

    // const fetchInviteCode = async () => {
    //     setIsLoading(true);
    //     try {
    //         // 模拟向后端请求邀请码
    //         await new Promise(resolve => setTimeout(resolve, 1500));
    //         setInviteCode('FRIEND2023');
    //     } catch (error) {
    //         Alert.alert('错误', '获取邀请码失败，请稍后重试。');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const copyToClipboard = async () => {
        Alert.alert('成功', '邀请码已复制到剪贴板');
    };

    const shareInviteLink = async () => {
        try {
            await Share.share({
                message: `我正在玩遥驰天下！使用我的邀请码 ${inviteCode} 来注册和我一起玩吧！`,
            });
        } catch (error) {
            Alert.alert('错误', '分享失败，请稍后重试。');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>邀请好友</Text>

            <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>您的邀请码：</Text>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                    <Text style={styles.code}>{inviteCode}</Text>
                )}
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>刷新邀请码</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                <Text style={styles.buttonText}>复制邀请码</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={shareInviteLink}>
                <Text style={styles.buttonText}>分享邀请码</Text>
            </TouchableOpacity>

            <Text style={styles.infoText}>
                当您的朋友使用您的邀请码注册时，你们双方都将获得 100 金币奖励！
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    codeLabel: {
        fontSize: 18,
        marginRight: 10,
    },
    code: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
});