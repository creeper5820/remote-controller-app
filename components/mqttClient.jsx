import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StyleSheet, Text, Button, View } from 'react-native';

client = new Paho.Client(
    "broker.emqx.io",
    Number(8083),
    `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function MQTTClient() {

    const [value, setValue] = useState(1);

    function onMessage(message) {
        if (message.destinationName === "mqtt-async-test/value")
            console.log(message.payloadString);
    }

    useEffect(() => {
        client.connect({
            onSuccess: () => {
                console.log("Connected!");
                client.subscribe("mqtt-async-test/value");
                client.onMessageArrived = onMessage;
            },
            onFailure: () => {
                console.log("Failed to connect!");
            }
        });
    }, [])

    function sendMessage(c) {
        const message = new Paho.Message((2).toString());
        message.destinationName = "mqtt-async-test/value";
        c.send(message);
    }

    return (
        <View style={styles.container}>
            <Button onPress={() => { sendMessage(client); }} title="Press Me" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});