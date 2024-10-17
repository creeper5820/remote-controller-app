import Paho from "paho-mqtt";

// import { useState, useEffect } from "react";
// import { StyleSheet, Text, Button, View } from 'react-native';

// client = new Paho.Client(
//     "broker.emqx.io",
//     Number(8083),
//     `mqtt-async-test-${parseInt(Math.random() * 100)}`
// );

// export default function MQTTClient() {

//     const [value, setValue] = useState(1);

//     function onMessage(message) {
//         if (message.destinationName === "mqtt-async-test/value")
//             console.log(message.payloadString);
//     }

//     useEffect(() => {
//         client.connect({
//             onSuccess: () => {
//                 console.log("Connected!");
//                 client.subscribe("mqtt-async-test/value");
//                 client.onMessageArrived = onMessage;
//             },
//             onFailure: () => {
//                 console.log("Failed to connect!");
//             }
//         });
//     }, [])

//     function sendMessage(c) {
//         const message = new Paho.Message((2).toString());
//         message.destinationName = "mqtt-async-test/value";
//         c.send(message);
//     }

//     return (
//         <View style={styles.container}>
//             <Button onPress={() => { sendMessage(client); }} title="Press Me" />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {
    }
});

function onConnect() {
    console.log("onConnect");
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
}

const client = new Paho.MQTT.Client('iot.eclipse.org', 443, 'uname');
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess: onConnect, useSSL: true });