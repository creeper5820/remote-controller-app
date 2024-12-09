import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';

export default function Feedback({ navigation }) {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (feedback.trim()) {
            // 这里应该是发送反馈到服务器的逻辑
            Alert.alert('提交成功', '感谢您的反馈！');
            setFeedback('');
        } else {
            Alert.alert('错误', '请输入反馈内容');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>反馈</Text>
            <TextInput
                style={styles.input}
                multiline
                numberOfLines={5}
                placeholder="请输入您的反馈意见..."
                value={feedback}
                onChangeText={setFeedback}
            />
            <Button title="提交反馈" onPress={handleSubmit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        color: 'black',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top',
    },
});