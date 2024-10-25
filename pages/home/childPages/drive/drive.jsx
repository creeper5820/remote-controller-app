import React, { useEffect, useState, useRef } from "react";
import { View, PanResponder, Text, TouchableOpacity, Image } from 'react-native';
import { OrientationLocker, LANDSCAPE } from "react-native-orientation-locker";
import styles from "./style";

import backIcon from '../../images/back.png';

import { JOYSTICK_SIZE, STICK_SIZE } from './style';

export default function DrivePage({ navigation }) {
    useEffect(() => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation)
            parentNavigation.setOptions({ tabBarStyle: { display: 'none' } });

        return () => {
            if (parentNavigation)
                parentNavigation.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    }, [navigation]);

    const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
    const serverStateRef = useRef(0);
    const [serverMessages, setServerMessages] = useState([]);

    const ws = useRef(new WebSocket('ws://10.31.1.213:8765')).current;
    const joystickDataRef = useRef(new Uint8Array(2));
    const lastUpdateJoystick = useRef(Date.now());

    useEffect(() => {
        const serverMessagesList = [];
        const interval = setInterval(() => {
            if (serverStateRef.current === 1) {
                ws.send(joystickDataRef.current);
                console.log(joystickDataRef.current);
            }
        }, 100);;
        ws.onopen = () => {
            serverStateRef.current = 1;
            joystickDataRef.current[0] = 127;
            joystickDataRef.current[1] = 127;
        };
        ws.onclose = () => {
            serverStateRef.current = 0;
        };
        ws.onerror = (e) => {
            serverStateRef.current = -1;
        };
        ws.onmessage = (e) => {
            if (serverMessagesList.length > 0)
                serverMessagesList.shift();

            let message;
            if (e.data instanceof ArrayBuffer) {
                const uint8Array = new Uint8Array(e.data);
                message = `Received: ${uint8Array[0]}, ${uint8Array[1]}`;
            } else {
                message = e.data;
            }

            serverMessagesList.push(message);
            setServerMessages([...serverMessagesList]);
        };

        return () => {
            clearInterval(interval);
            ws.close();
        }
    }, []);



    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                console.log('Grabbed');
                joystickDataRef.current[0] = 127;
                joystickDataRef.current[1] = 127;
            },
            onPanResponderMove: (_, gestureState) => {
                if (Date.now() - lastUpdateJoystick.current > 100) {
                    const { dx, dy } = gestureState;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);

                    const maxDistance = JOYSTICK_SIZE / 2 - STICK_SIZE / 2;
                    const limitedDistance = Math.min(distance, maxDistance);

                    const newX = Math.cos(angle) * limitedDistance;
                    const newY = Math.sin(angle) * limitedDistance;

                    setStickPosition({ x: newX, y: newY });

                    const normalizedX = (newX / maxDistance / 6) + 1;
                    const normalizedY = -(newY / maxDistance / 2) + 1;

                    const controlX = Math.round(normalizedX * 127.5);
                    const controlY = Math.round(normalizedY * 127.5);


                    joystickDataRef.current[0] = controlX;
                    joystickDataRef.current[1] = controlY;


                    const now = Date.now();
                    lastUpdateJoystick.current = now;
                }
            },
            onPanResponderRelease: () => {
                setStickPosition({ x: 0, y: 0 });
                console.log('Released');
                joystickDataRef.current[0] = 127;
                joystickDataRef.current[1] = 127;
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <OrientationLocker orientation={LANDSCAPE} />

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
                <Image source={backIcon} style={styles.backIcon} />
                <Text style={styles.backText}>返回</Text>
            </TouchableOpacity>

            <View style={styles.leaderboard}>
                <Text style={styles.leaderboardTitle}>[DEBUG INFO]</Text>
                <Text style={styles.leaderboardItem}>{serverStateRef.current}</Text>
                {serverMessages.map((message, index) => (
                    <Text key={index} style={styles.leaderboardItem}>{message}</Text>
                ))}
            </View>

            <View style={styles.infoBar}>
                <Text style={styles.infoText}>速度: 6 km/h</Text>
                <Text style={styles.infoText}>电量: 75%</Text>
            </View>

            <View style={styles.controls}>
                <View style={styles.joystick} {...panResponder.panHandlers}>
                    <View
                        style={[
                            styles.stick,
                            {
                                transform: [
                                    { translateX: stickPosition.x },
                                    { translateY: stickPosition.y },
                                ],
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    )
}