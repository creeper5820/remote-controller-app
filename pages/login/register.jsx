import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, DrawerLayoutAndroid } from 'react-native';
import { AuthContext, BaseUrl } from '../../App';
import { saveToken } from './tokenStorage';

// 模拟MD3的颜色系统
const colors = {
    primary: '#2196f3',
    onPrimary: '#FFFFFF',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    outline: '#79747E',
};

export default function RegisterPage({ navigation }) {
    const [nickname, setNickname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [renderContent, setRenderContent] = useState(null);
    const [registerState, setRegisterState] = useState(null);
    const [registerToken, setRegisterToken] = useState(null);

    const { state, dispatch } = useContext(AuthContext);

    async function handleRegister() {
        console.log('[RegisterPage] handleRegister start');
        setRegisterState('REGISTER_IN_PROGRESS');
        try {
            const axios = require('axios').default;
            console.log('[RegisterPage] handleRegister axios start');
            const response = await axios.get(
                `${BaseUrl}/api/register?username=${username}&password=${password}`
            );
            const { result, token } = response.data;
            console.log('[RegisterPage] handleRegister response result: [', result, ']', 'token: [', token, ']');
            if (result === 200) {
                setRegisterToken(token);
                setRegisterState('REGISTER_SUCCESS');
            } else if (result === 300) setRegisterState('USER_HAS_REGISTERED');
            else setRegisterState('REGISTER_FAILED');
        } catch (error) {
            console.error('[RegisterPage] handleRegister error', error);
            setRegisterState('REGISTER_FAILED');
        }

    }

    useEffect(() => {
        if (nickname.length < 2 || nickname.length > 16) {
            setRegisterState(null);
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    昵称长度需在2-16个字符之间
                </Text>
            );
        } else if (username.length !== 11) {
            setRegisterState(null);
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    请输入正确的手机号
                </Text>
            );
        } else if (password.length < 6 || password.length > 16) {
            setRegisterState(null);
            setRenderContent(
                <Text style={[styles.warningButton, styles.warningText]}>
                    密码长度需在6-16位之间
                </Text>
            );
        } else if (password !== confirmPassword) {
            setRegisterState(null);
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
                case 'USER_HAS_REGISTERED':
                    setRenderContent(
                        <TouchableOpacity style={styles.warningButton}>
                            <Text style={styles.warningText}>用户已注册，请直接登录</Text>
                        </TouchableOpacity>
                    )
                    break;
                case 'REGISTER_FAILED':
                    setRenderContent(
                        <TouchableOpacity style={styles.warningButton} onPress={handleRegister}>
                            <Text style={styles.warningText}>注册失败,请重试</Text>
                        </TouchableOpacity>
                    );
                    break;
                case 'REGISTER_SUCCESS':
                    setRenderContent(
                        <View style={styles.successButton}>
                            <Text style={styles.successText}>注册成功</Text>
                        </View>
                    )
                    saveToken(registerToken);
                    setTimeout(() => {
                        dispatch({ type: 'register', token: registerToken });
                        console.log('[RegisterPage] handleRegister end');
                    }, 500);
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
    }, [nickname, username, password, confirmPassword, registerState]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>注册</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>昵称*</Text>
                <TextInput
                    style={styles.input}
                    value={nickname}
                    onChangeText={setNickname}
                    keyboardType="default"
                    placeholder="请输入昵称"
                    placeholderTextColor={colors.outline}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>手机号*</Text>
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
                <Text style={styles.label}>密码*</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="请输入密码，长度需在6-16位之间"
                    placeholderTextColor={colors.outline}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>确认密码*</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="请再次输入密码"
                    placeholderTextColor={colors.outline}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>邀请码</Text>
                <TextInput
                    style={styles.input}
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    keyboardType="default"
                    placeholder="请输入邀请码(可选)"
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