import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';

import { webrtc } from './webrtc';

const WebRTCPlayer = () => {
    useEffect(() => {
        webrtc.playUrlInput = "https://gwm-000-cn-0604.bcloud365.net:9113/live/b5080f783d377e4c/Mnx8ZDE4ZTY5NzFjNjQ5OTBlNzllY2E4NThhZjE4ZmVkZmZ8fGI1MDgwZjc4M2QzNzdlNGN8fDM1ZDYzZjUwMzdiMDMyM2U0N2I2MGM2NTAy6YjY3NzE5NjBjYjY1ZjQxYjRlOGU4NGQzMjhkZWU1ZTE2NjQ3ZjZ8fHdlYnJ0Y3x8MTczMDIxMTczODgwMHx8MTczMTk3Nzg1NTY0Nnx8R1dN.8c92c3441d3bb5ffd0a5433be90a8412.webrtc"
        webrtc.initWebRtc();
        webrtc.call();
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>{webrtc.connectionState}</Text>
            <View style={styles.videoContainer}>
                {webrtc.remoteStream ? (
                    <RTCView
                        streamURL={webrtc.remoteStream.toURL()}
                        style={styles.video}
                        objectFit="cover"
                    />
                ) : (
                    <Text style={styles.loadingText}>Waiting for video stream...</Text>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    statusText: { textAlign: 'center', marginVertical: 10, fontSize: 16 },
    videoContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
    video: { width: '100%', height: '100%' },
    loadingText: { color: 'white', fontSize: 16 },
});

export default WebRTCPlayer;
