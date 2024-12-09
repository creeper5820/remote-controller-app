import React, { useState } from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface MyCarProps {
    navigation: any;
}

const MessageCard: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
    return <View><Text>MessageCard</Text></View>
}

const messageCardStyle = StyleSheet.create({
    roundedRectangle: {
        borderRadius: 10, // 设置圆角大小为10
        backgroundColor: 'skyblue', // 设置背景颜色
        padding: 20, // 设置内边距
        // 可以添加其他样式，如宽度、高度等
        width: 200,
        height: 100,
    }
})

const MyCar: React.FC<MyCarProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: "flex-start", paddingTop: 10, alignItems: "center" }}>
            <MessageCard style={messageCardStyle.roundedRectangle} />
            <Text style={{ fontSize: 30, color: 'black' }}>MyCar</Text>
        </View>
    );
};

export default MyCar;