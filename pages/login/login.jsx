import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext, BackendUrl } from '../../App';
import { saveToken } from './tokenStorage';

// 模拟MD3的颜色系统
const colors = {
    primary: '#2196f3',
    onPrimary: '#FFFFFF',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    outline: '#79747E',
};

export default function LoginPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [renderContent, setRenderContent] = useState(null);
    const [loginState, setLoginState] = useState(null);
    const [loginToken, setLoginToken] = useState(null);
    const [loginError, setLoginError] = useState(null);

    const { state, dispatch } = useContext(AuthContext);

    async function handleLogin() {
        console.log('[LoginPage] handleLogin start');
        setLoginState('LOGIN_IN_PROGRESS');

        // 模拟登录
        setLoginToken("aaaa");
        setLoginState('LOGIN_SUCCESS');

        // try {
        //     const axios = require('axios').default;
        //     console.log('[LoginPage] handleLogin axios start');
        //     const response = await axios.get(
        //         `${BaseUrl}/api/login?username=${username}&password=${password}`
        //     );
        //     const { result, token } = response.data;
        //     console.log('[LoginPage] handleLogin response result: [', result, ']', 'token: [', token, ']');
        //     if (result === 200) {
        //         setLoginToken(token);
        //         setLoginState('LOGIN_SUCCESS');
        //     } else if (result === 404) setLoginState('USER_NOT_FOUND');
        //     else setLoginState('LOGIN_FAILED');
        // } catch (error) {
        //     setLoginError(error);
        //     console.error('[LoginPage] handleLogin error', error);
        //     setLoginState('NETWORK_ERROR');
        // }
    }

    useEffect(() => {
        if (username.length !== 11) {
            setLoginState(null);
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    请输入正确的手机号
                </Text>
            );
        } else if (password.length < 6 || password.length > 16) {
            setLoginState(null);
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    密码长度需在6-16位之间
                </Text>
            );
        } else {
            switch (loginState) {
                case 'LOGIN_IN_PROGRESS':
                    setRenderContent(
                        <Text style={styles.button}>
                            <Text style={styles.buttonText}>登录中...</Text>
                        </Text>
                    );
                    break;
                case 'USER_NOT_FOUND':
                    setRenderContent(
                        <Text style={[styles.warningButton, styles.warningText]}>
                            该手机号不存在, 请先注册
                        </Text>
                    );
                    break;
                case 'LOGIN_FAILED':
                    setRenderContent(
                        <TouchableOpacity style={styles.warningButton} onPress={handleLogin}>
                            <Text style={styles.warningText}>登录失败, 请重试</Text>
                        </TouchableOpacity>
                    );
                    break;
                case 'NETWORK_ERROR':
                    setRenderContent(
                        <TouchableOpacity style={styles.warningButton} onPress={handleLogin}>
                            <Text style={styles.warningText}>网络错误, 请检查网络后重试:{loginError.message}</Text>
                        </TouchableOpacity>
                    );
                    break;
                case 'LOGIN_SUCCESS':
                    setRenderContent(
                        <View style={styles.successButton}>
                            <Text style={styles.successText}>登录成功</Text>
                        </View>
                    )
                    saveToken(loginToken);
                    setTimeout(() => {
                        dispatch({ type: 'login', token: loginToken });
                        console.log('[LoginPage] handleLogin end');
                    }, 500);
                    break;
                default:
                    setRenderContent(
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>登录</Text>
                        </TouchableOpacity>
                    );
                    break;
            }
        }
    }, [loginState, username, password]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>登录</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>手机号</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={(text) => text.length < 12 ? setUsername(text.replace(/[^0-9]/g, '')) : username}
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
                    onChangeText={(text) => text.length <= 16 ? setPassword(text) : password}
                    secureTextEntry
                    placeholder="请输入密码，长度需在6-16位之间"
                    placeholderTextColor={colors.outline}
                />
            </View>
            {renderContent}
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkButtonText}>没有账号？立即注册</Text>
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
        textAlign: 'center',
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
    }, successButton: {
        backgroundColor: 'white',
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 100,
        padding: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    successText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});