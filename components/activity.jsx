import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BaseUrl } from '../App';

import backIcon from '../icons/back.png';
import carIcon from '../icons/car.png';

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

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        padding: 15,
    },
    topBarCarIcon: {
        width: 25,
        height: 25,
    },
    topBarText: {
        marginLeft: 10,
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'light',
    },
    header: {
        backgroundColor: '#fff',
        padding: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    headerItem: {
        alignItems: 'center',
        color: '#777',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventTitle: {
        margin: 10,
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
    },
    cardContent: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carImage: {
        width: 80,
        height: 80,
        margin: 15,
        borderRadius: 10,
    },
    carStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 40,
    },
    carDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    carInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    normalText: {
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
    },
    normalTextRed: {
        fontWeight: 'bold',
        color: '#ed2939',
    },
    normalTextGreen: {
        fontWeight: 'bold',
        color: '#7DDA58',
    },
    normalTextBlue: {
        fontWeight: 'bold',
        color: '#2196f3',
    },
    smallText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: 'light',
        color: '#777',
    },
    boldTextBlue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#23aaf2',
    },
    boldTextBlack: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d2a2e',
    },
    driveButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 25,
        marginHorizontal: 25,
        justifyContent: 'space-between',
    },
    driveButtonText: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
    },
    loadingContainer: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
    }
});