import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BaseUrl } from '../../../../App';

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

function Header({ freeNumber, drivingNumber }) {
    return (
        <View style={styles.header}>
            <View style={styles.headerContainer}>
                <View style={styles.headerItem}>
                    <Text style={styles.boldTextBlue} >{freeNumber}</Text>
                    <Text style={styles.headerItem} >空闲</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={styles.boldTextBlack} >{drivingNumber}</Text>
                    <Text style={styles.headerItem} >正在驾驶</Text>
                </View>
            </View>
        </View>
    )
};


function ActivityCard({ carInfo, navigation }) {
    const { name, id, status, battery } = { ...carInfo };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Image source={carIcon} style={styles.carImage} />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.carDetails}>
                    <Text style={styles.eventTitle}>{name}</Text>
                    <Text style={styles.smallText}>编号: {id}</Text>
                    <View style={styles.carStatus}>
                        <View style={styles.carInfo}>
                            <Text style={styles.normalText}>状态</Text>
                            <Text style={status === "available" ? styles.normalTextGreen : (status === "driving" ? styles.normalTextBlue : styles.normalTextRed)} >{status === "available" ? '空闲' : (status === "driving" ? '被驾驶中' : '离线')}</Text>
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


function CarList({ navigation, carData, loadingStatus, requestError }) {
    switch (loadingStatus) {
        case 1:
            {
                const drivingNumber = carData.filter((item) => item.status === "driving").length;
                return (
                    <>
                        <Header freeNumber={carData.length} drivingNumber={drivingNumber} />
                        <FlatList
                            data={carData}
                            renderItem={({ item }) => <ActivityCard carInfo={item} navigation={navigation} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </>
                );
            }
        case -1:
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>加载数据失败: {requestError}</Text>
                    <Text> 请尝试重新加载</Text>
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


export default function ActivityPage({ route, navigation }) {
    const { eventName, id } = { ...route.params.ActivityInfo };

    const axios = require('axios').default;

    const [carInfoState, setCarInfoState] = React.useState(0);
    const [carDataArray, setCarDataArray] = React.useState([]);
    const [requestError, setRequestError] = React.useState("");

    useEffect(() => {
        axios.get(`${BaseUrl}/api/activity/${id}/detail`, {
        }).then(function (response) {
            const status = response.status;
            const data = response.data.vehicles;
            console.log(status);
            console.log(data);
            setCarDataArray(data);
            setCarInfoState(1);
        }).catch(function (error) {
            setCarInfoState(-1);
            setRequestError(error.message);
            console.log(error);
        });
    }, []);

    return (
        <>
            <TopBar navigation={navigation} eventName={eventName} />
            <View style={styles.container}>
                <CarList navigation={navigation} carData={carDataArray} loadingStatus={carInfoState} requestError={requestError} />
            </View>
        </>
    );
}