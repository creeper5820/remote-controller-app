import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function AboutUs({ navigation }) {
    const openLink = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../../../icons/icon192.png')} // 请确保有这个图片文件
                style={styles.logo}
            />
            <Text style={styles.title}>遥驰天下</Text>
            <Text style={styles.version}>版本 1.0.0</Text>

            <Text style={styles.description}>
                我们是一家致力于创新和用户体验的科技公司。我们的使命是通过技术改善人们的日常生活，为用户提供直观、高效、安全的数字解决方案。
            </Text>

            <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>联系我们</Text>
                <Text style={styles.contactText}>邮箱: example@ourapp.com</Text>
                <Text style={styles.contactText}>网站: www.alliance.com</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    version: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    contactInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 16,
        marginBottom: 5,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialButton: {
        margin: 10,
    },
});