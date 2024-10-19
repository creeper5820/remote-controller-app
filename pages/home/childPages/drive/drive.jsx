import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useRef } from "react";
import { OrientationLocker, LANDSCAPE } from "react-native-orientation-locker";
import styles from "./style";

import backIcon from '../../images/back.png';
import leftArrowIcon from "../../images/arrow_left.png";
import rightArrowIcon from "../../images/arrow_right.png";
import upArrowIcon from "../../images/arrow_up.png";
import downArrowIcon from "../../images/arrow_down.png";



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

    const [serverState, setServerState] = useState('Loading...');
    const [messageText, setMessageText] = useState('');
    const [serverMessages, setServerMessages] = useState([]);

    var ws = useRef(new WebSocket('ws://124.222.224.186:8800')).current;;

    useEffect(() => {
        const serverMessagesList = [];
        ws.onopen = () => {
            setServerState('Connected to the server')
        };
        ws.onclose = (e) => {
            setServerState('Disconnected')
        };
        ws.onerror = (e) => {
            setServerState(e.message);
        };
        ws.onmessage = (e) => {
            if (serverMessagesList.length > 0)
                serverMessagesList.shift();
            serverMessagesList.push(e.data);
            setServerMessages([...serverMessagesList])
        };
    }, [])



    return (
        <View style={styles.container}>
            <OrientationLocker orientation={LANDSCAPE} />

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
                <Image source={backIcon} style={styles.backIcon} />
                <Text style={styles.backText}>返回</Text>
            </TouchableOpacity>


            <View style={styles.leaderboard}>
                <Text style={styles.leaderboardTitle}>在线用户</Text>
                <Text style={styles.leaderboardItem}>{serverMessages}</Text>
            </View>

            <View style={styles.infoBar}>
                <Text style={styles.infoText}>速度: 6 km/h</Text>
                <Text style={styles.infoText}>电量: 75%</Text>
            </View>

            <View style={styles.controls}>
                <View style={styles.controlButtonContainerLeft}>
                    <TouchableOpacity style={styles.controlButton} onPressIn={() => ws.send('10')} onPressOut={() => ws.send('11')}>
                        <Image source={leftArrowIcon} style={styles.buttonIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPressIn={() => ws.send('20')} onPressOut={() => ws.send('21')}>
                        <Image source={rightArrowIcon} style={styles.buttonIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.controlButtonContainerRight}>
                    <TouchableOpacity style={styles.controlButton} onPressIn={() => ws.send('30')} onPressOut={() => ws.send('31')}>
                        <Image source={upArrowIcon} style={styles.buttonIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPressIn={() => ws.send('40')} onPressOut={() => ws.send('41')} >
                        <Image source={downArrowIcon} style={styles.buttonIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

}
