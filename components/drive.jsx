import React, { useEffect, useState, useRef } from "react";
import { View, PanResponder, Text, TouchableOpacity, Image } from 'react-native';
import { OrientationLocker, LANDSCAPE } from "react-native-orientation-locker";
import dgram from "react-native-udp";
import { webrtc } from "./webrtc";
import { RTCView } from 'react-native-webrtc';
import backIcon from '../icons/back.png';

export default function DrivePage({ navigation }) {

    const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
    const [remoteStream, setRemoteStream] = useState(null);
    const [webrtcConnectState, setWebrtcConnectState] = useState(null);
    const [webrtcConnectStatus, setWebrtcConnectStatus] = useState(-1);
    const [connectionTip, setConnectionTip] = useState('正在连接...');

    const socket = useRef(dgram.createSocket("udp4")).current;
    const joystickDataRef = useRef(new Uint8Array([127, 127]));
    const lastUpdateJoystick = useRef(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const message = new Uint8Array(joystickDataRef.current);
            socket.send(message, 0, message.length, 8000, '10.31.2.143', (err) => {
                if (err) console.error(err);
                // else console.log('[send]' + message);
            });
        }, 100);

        socket.bind(12345);

        socket.on('message', (msg, rinfo) => {
            console.log(`received: ${msg} from ${rinfo.address}:${rinfo.port}`);
        });

        socket.on('listening', () => {
            const address = socket.address();
            console.log(`Socket listening ${address.address}:${address.port}`);
        });

        return () => {
            clearInterval(interval);
            socket.close();
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

    useEffect(() => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation)
            parentNavigation.setOptions({ tabBarStyle: { display: 'none' } });

        return () => {
            if (parentNavigation)
                parentNavigation.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    }, [navigation]);


    useEffect(() => {
        webrtc.playUrlInput = "https://gwm-000-cn-0604.bcloud365.net:9113/live/b5080f783d377e4c/Mnx8ZDE4ZTY5NzFjNjQ5OTBlNzllY2E4NThhZjE4ZmVkZmZ8fGI1MDgwZjc4M2QzNzdlNGN8fDI3M2Y1Yjg1M2U3Y2VkZTM3OGFlMDYxOGEx6Y2M0MTM3MTU4ZTE5MWM5YTI0NWZhNTc4ZTNjNjczZmYxNmE3ODB8fHdlYnJ0Y3x8MTczMDMwMDQ1NTc0MXx8MTczMjA2NjU3MjYzM3x8R1dN.f263a0054590801b6aed3a2be476f6a8.webrtc"
        webrtc.initWebRtc();
        webrtc.call();
        return () => {
            webrtc.hangup();
            webrtc.setTalkDisable();
            setRemoteStream(null);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setWebrtcConnectState(webrtc.connectionState)
            setWebrtcConnectStatus(webrtc.connectionStatus)
        }, 100);

        if (webrtcConnectState === 'connected' && webrtcConnectStatus === 200) {
            setConnectionTip('连接成功')
        } else if (webrtcConnectState === 'connecting' || webrtcConnectStatus === -1) {
            setConnectionTip('正在连接...')
        } else if (webrtcConnectState === 'closed') {
            setConnectionTip('连接断开，错误码：' + webrtcConnectStatus)
        }
        setRemoteStream(webrtc.remoteStream);
        console.log("[remoteStream]" + (remoteStream ? remoteStream.toURL() : remoteStream));

        return () => clearInterval(interval);
    }, [webrtcConnectState]);

    return (
        <View style={styles.container}>
            <OrientationLocker orientation={LANDSCAPE} />
            {webrtc.connectionState === 'connected' ? (
                <RTCView
                    streamURL={remoteStream.toURL()}
                    style={styles.video}
                    objectFit="cover"
                />
            ) : (
                <Text style={styles.loadingText}>{connectionTip}</Text>
            )}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
                <Image source={backIcon} style={styles.backIcon} />
                <Text style={styles.backText}>返回</Text>
            </TouchableOpacity>

            <View style={styles.leaderboard}>
                <Text style={styles.leaderboardTitle}>[DEBUG INFO]</Text>
                <Text style={styles.leaderboardItem}>{webrtcConnectState}</Text>
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


import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const JOYSTICK_SIZE = Math.min(width, height) * 0.3;
const STICK_SIZE = JOYSTICK_SIZE * 0.4;

const styles = StyleSheet.create({
    joystick: {
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: JOYSTICK_SIZE / 2,
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%'
    },
    loadingText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stick: {
        width: STICK_SIZE,
        height: STICK_SIZE,
        borderRadius: STICK_SIZE / 2,
        backgroundColor: '#fff',
        position: 'absolute',
    },
    container: {
        flex: 1,
        backgroundColor: '#424242',
    },
    videoBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#1565c0',
        padding: 10,
        borderBottomRightRadius: 10,
    },
    backIcon: {
        width: 25,
        height: 25,
    },
    backText: {
        color: 'white',
    },
    leaderboard: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#1565c0',
        padding: 15
    },
    leaderboardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    leaderboardItem: {
        color: '#fafafa',
        fontSize: 14,
    },
    infoBar: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#1565c0',
    },
    infoText: {
        marginHorizontal: 15,
        marginVertical: 5,
        color: 'white',
        fontSize: 12,
    },
    controls: {
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        flexDirection: 'row',
    },
    controlButtonContainerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButtonContainerRight: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    controlButton: {
        marginRight: 20,
    },
    buttonIcon: {
        width: 70,
        height: 70,
    },
});