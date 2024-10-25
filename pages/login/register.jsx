import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../App';

// 模拟MD3的颜色系统
const colors = {
    primary: '#2196f3',
    onPrimary: '#FFFFFF',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    outline: '#79747E',
};

export default function RegisterPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [renderContent, setRenderContent] = useState(null);
    const [registerState, setRegisterState] = useState(null);

    const { state, dispatch } = useContext(AuthContext);

    async function handleRegister() {
        setRegisterState('REGISTER_IN_PROGRESS');

        try {
            const axios = require('axios').default;
            const response = await axios.get(
                `http://10.31.3.103:8000/api/register?username=${username}&password=${password}`
            );
            const { result, token } = response.data;
            if (result === 200) {
                await saveToken(token);
                dispatch({ type: 'register', token: token });
                setRegisterState('REGISTER_SUCCESS');
            } else {
                setRegisterState('REGISTER_FAILED');
            }
        } catch (error) {
            setRegisterState('REGISTER_FAILED');
        }

    }

    useEffect((registerState, setRenderContent) => {


        if (username.length !== 11) {
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    请输入正确的手机号
                </Text>
            );
        } else if (password.length < 6 || password.length > 16) {
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    密码长度应大于6位 小于16位
                </Text>
            );
        } else if (password !== confirmPassword) {
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    密码不一致
                </Text>
            );
        } else {
            switch (registerState) {
                case 'REGISTER_IN_PROGRESS':
                    setRenderContent(
                        <TouchableOpacity style={styles.button}  >
                            <Text style={styles.buttonText}>
                                注册中...
                            </Text>
                        </TouchableOpacity>
                    );
                    break;
                case 'REGISTER_FAILED':
                    setRenderContent(
                        <TouchableOpacity style={styles.warningButton} onPress={handleRegister}>
                            <Text style={styles.warningText}>注册失败,请重试</Text>
                        </TouchableOpacity>
                    );
                    break;
                default:
                    setRenderContent(
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>注册</Text>
                        </TouchableOpacity>
                    );
                    break;
            }
        }
    }, [username, password, confirmPassword, registerState]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>注册</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>手机号</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="phone-pad"
                    placeholder="请输入手机号"
                    placeholderTextColor={colors.outline}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="请输入密码"
                    placeholderTextColor={colors.outline}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>确认密码</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="请再次输入密码"
                    placeholderTextColor={colors.outline}
                />
            </View>

            {renderContent}

            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkButtonText}>已有账号？立即登录</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.surface,
        justifyContent: 'top',
        paddingTop: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.onSurface,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: colors.onSurface,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.outline,
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        color: colors.onSurface,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 100,
        padding: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '500',
    },
    linkButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    linkButtonText: {
        color: colors.primary,
        fontSize: 14,
    },
    warningButton: {
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 100,
        padding: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    warningText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});