import React, { useEffect, useState, useRef } from "react";
import { View, PanResponder, Text, TouchableOpacity, Image } from 'react-native';
import { OrientationLocker, LANDSCAPE } from "react-native-orientation-locker";
import dgram from "react-native-udp";
import { BaseUrl } from "../App";
import { webrtc } from "./webrtc";
import { RTCView } from 'react-native-webrtc';
import { AuthContext } from "../App";

import gpsIcon from '../icons/gps.png';
import backIcon from '../icons/back.png';
import speakerIcon from '../icons/speaker.png';
import speakerMutedIcon from '../icons/speakerMuted.png';
import micIcon from '../icons/mic.png';
import micMutedIcon from '../icons/micMuted.png';
import messageIcon from '../icons/message.png';
import signalFullIcon from '../icons/signalFull.png';
import signalMediumIcon from '../icons/signalMedium.png';
import signalLowIcon from '../icons/signalLow.png';
import speedometerIcon from '../icons/speedometer.png';
import batteryIcon from '../icons/battery.png';

export default function DrivePage({ navigation }) {
    const { state } = React.useContext(AuthContext);
    const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
    const [remoteStream, setRemoteStream] = useState(null);
    const [webrtcConnectState, setWebrtcConnectState] = useState(null);
    const [webrtcConnectStatus, setWebrtcConnectStatus] = useState(-1);
    const [connectionTip, setConnectionTip] = useState('正在连接...');

    const [speakerMuted, setSpeakerMuted] = useState(true);
    const [micMuted, setMicMuted] = useState(true);

    const socket = useRef(dgram.createSocket("udp4")).current;
    const joystickDataRef = useRef(new Uint8Array([127, 127]));
    const lastUpdateJoystick = useRef(Date.now());

    useEffect(() => {
        // const interval = setInterval(() => {
        //     const message = new Uint8Array(joystickDataRef.current);
        //     socket.send(message, 0, message.length, 8000, '10.31.2.143', (err) => {
        //         if (err) console.error(err);
        //         // else console.log('[send]' + message);
        //     });
        // }, 100);

        // socket.bind(12345);

        // socket.on('message', (msg, rinfo) => {
        //     console.log(`received: ${msg} from ${rinfo.address}:${rinfo.port}`);
        // });

        // socket.on('listening', () => {
        //     const address = socket.address();
        //     console.log(`Socket listening ${address.address}:${address.port}`);
        // });

        return () => {
            // clearInterval(interval);
            // socket.close();
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
        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/drive?token=${state.token}&vehicleId=123`)
            .then(function (response) {
                const data = response.data;
                console.log("[drivepage] received data:", data);
                webrtc.playUrlInput = data.playUrl;
                // webrtc.initWebRtc();
                // webrtc.call();
            })
            .catch(function (error) {
                console.log("[drivepage] error:", error);
            })
        return () => {
            // webrtc.hangup();
            // webrtc.setTalkDisable();
            // setRemoteStream(null);
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
                <Text style={styles.leaderboardTitle}>在线用户</Text>
                <Text style={styles.leaderboardItem}>{webrtcConnectState}</Text>
            </View>

            <View style={styles.infoBar}>
                <Image source={speedometerIcon} style={styles.infoIcon} />
                <Text style={styles.infoText}>6 km/h</Text>
                <Image source={batteryIcon} style={styles.infoIcon} />
                <Text style={styles.infoText}>75%</Text>
            </View>

            <View style={styles.infoGPS}>
                <Image source={gpsIcon} style={styles.infoGPSIcon} />
                <Image source={signalFullIcon} style={styles.infoGPSIcon} />
            </View>

            <View style={styles.communications}>
                <TouchableOpacity style={styles.communicationsItem}>
                    <Image source={messageIcon} style={styles.communicationsMessage} />
                </TouchableOpacity >
                <TouchableOpacity style={styles.communicationsItem} onPress={() => setSpeakerMuted(!speakerMuted)}>
                    <Image source={speakerMuted ? speakerMutedIcon : speakerIcon} style={styles.communicationsMessage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.communicationsItem} onPress={() => setMicMuted(!micMuted)}>
                    <Image source={micMuted ? micMutedIcon : micIcon} style={styles.communicationsMessage} />
                </TouchableOpacity>
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
        backgroundColor: '#9e9e9e',
        marginTop: 10,
        padding: 10,
        borderRadius: 20,
        width: '50%',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
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
        top: 10,
        left: 10,
        backgroundColor: '#9e9e9e',
        padding: 10,
        borderRadius: 20
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
        top: 10,
        right: 10,
        backgroundColor: '#9e9e9e',
        borderRadius: 20,
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
    infoGPS: {
        position: 'absolute',
        bottom: 0,
        left: 10,
        padding: 4,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoGPSIcon: {
        width: 20,
        height: 20,
    },
    infoGPSText: {
        color: 'white',
        marginHorizontal: 8,
        marginVertical: 4,
        fontSize: 12,
    },
    infoBar: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
    },
    infoIcon: {
        width: 20,
        height: 20
    },
    infoText: {
        marginHorizontal: 4,
        marginVertical: 4,
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
    communications: {
        marginTop: 20,
        padding: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    communicationsItem: {
        marginVertical: 5,
    },
    communicationsMessage: {
        width: 20,
        height: 20
    },
    communicationsSpeaker: {
        width: 20,
        height: 20
    },
    communicationsMic: {
        width: 20,
        height: 20
    }
});