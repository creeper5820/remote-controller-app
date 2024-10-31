import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';

export default function Settings({ navigation }) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [language, setLanguage] = useState('中文');

    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
    const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);

    const changeLanguage = () => {
        Alert.alert(
            "选择语言",
            "请选择您偏好的语言",
            [
                { text: "中文", onPress: () => setLanguage("中文") },
                { text: "English", onPress: () => setLanguage("English") },
                { text: "取消", style: "cancel" }
            ]
        );
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>设置</Text>
            </View>

            <View style={styles.settingGroup}>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>通知</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleNotifications}
                        value={notificationsEnabled}
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>深色模式</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={darkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleDarkMode}
                        value={darkModeEnabled}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem} onPress={changeLanguage}>
                    <Text style={styles.settingLabel}>语言</Text>
                    <View style={styles.settingValue}>
                        <Text>{language}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.settingGroup}>
                <TouchableOpacity style={styles.settingItem} onPress={() => console.log("打开隐私政策")}>
                    <Text style={styles.settingLabel}>隐私政策</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => console.log("打开用户协议")}>
                    <Text style={styles.settingLabel}>用户协议</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    userInfo: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    settingGroup: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    settingLabel: {
        fontSize: 16,
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        margin: 20,
        padding: 15,
        backgroundColor: '#ff3b30',
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});