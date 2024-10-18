import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import data from './data';
import styles from './style';

import backIcon from '../../images/back.png';
import carIcon from '../../images/car.png';

function TopBar({ navigation, eventName }) {
    return (
        <View style={styles.topBar} >
            <TouchableOpacity onPress={() => navigation.goBack()} >
                <Image source={backIcon} style={styles.topBarCarIcon} />
            </TouchableOpacity>
            <Text style={styles.topBarText}>{eventName}</Text>
        </View>
    )
}

function Header() {
    return (
        <View style={styles.header}>
            <View style={styles.headerContainer}>
                <View style={styles.headerItem}>
                    <Text style={styles.boldTextBlue} >10</Text>
                    <Text style={styles.headerItem} >空闲</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={styles.boldTextBlack} >4</Text>
                    <Text style={styles.headerItem} >正在驾驶</Text>
                </View>
            </View>
        </View>
    )
};


function ActivityCard({ carInfo, navigation }) {
    const { eventName, id, status, battery } = { ...carInfo };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Image source={carIcon} style={styles.carImage} />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.carDetails}>
                    <Text style={styles.eventTitle}>{eventName}</Text>
                    <Text style={styles.smallText}>编号: {id}</Text>
                    <View style={styles.carStatus}>
                        <View style={styles.carInfo}>
                            <Text style={styles.normalText}>状态</Text>
                            <Text style={status ? styles.normalTextGreen : styles.normalTextRed} >{status ? '正常' : '离线'}</Text>
                        </View>
                        <View style={styles.carInfo}>
                            <Text style={styles.normalText}>电量</Text>
                            <Text style={battery > 20 ? styles.normalTextGreen : styles.normalTextRed} >{battery} %</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.driveButton} onPress={() => navigation.navigate('Drive')} >
                        <Text style={styles.driveButtonText}>去驾驶</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};


export default function ActivityPage({ route, navigation }) {
    const { eventName, manifacture, queueNumber, onlineNumber, driveNumber } = { ...route.params.ActivityInfo };
    return (
        <>
            <TopBar navigation={navigation} eventName={eventName} />
            <View style={styles.container}>
                <Header />
                <FlatList
                    data={data.carInfoArray}
                    renderItem={({ item }) => <ActivityCard carInfo={item} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </>
    );
}