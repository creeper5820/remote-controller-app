import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
} from 'react-native';

import { AuthContext } from '../App';
import { BaseUrl } from '../App';
import alipayIcon from '../icons/alipay.png';
import wechatpayIcon from '../icons/wepay.png';

export default function RechargeScreen() {
    const [amount, setAmount] = useState('');
    const [CDKey, setCDKey] = useState('');
    const [isCDK, setIsCDK] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [coins, setCoins] = useState(0);
    const { state, dispatch } = React.useContext(AuthContext);

    const calculateCoins = (value) => {
        return parseInt(value) * 10;
    };

    useEffect(() => {
        if (amount) {
            setCoins(calculateCoins(amount));
        } else {
            setCoins(0);
        }
    }, [amount]);

    const handleRecharge = () => {
        if (!amount) {
            Alert.alert('错误', '请选择或输入充值金额');
            return;
        }
        if (!paymentMethod) {
            Alert.alert('错误', '请选择支付方式');
            return;
        }

        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/charge?token=${state.token}&cdkey=${CDKey}`)
            .then(function (response) {
                const data = response.data;
                console.log("[chargepage] received data:", data);
                Alert.alert('成功', `已选择${paymentMethod}支付 ${amount} 元，将获得 ${coins} 金币`);
            })
            .catch(function (error) {
                console.log("[chargepage] error:", error);
                Alert.alert('失败', `充值失败，请联系客服或重试`);
            })

    };

    const handleExchange = () => {
        if (!CDKey) {
            Alert.alert('错误', '请选择或输入充值金额');
            return;
        }

        const axios = require('axios').default;
        axios.get(`${BaseUrl}/api/charge?token=${state.token}&cdkey=${CDKey}`)
            .then(function (response) {
                const data = response.data;
                console.log("[chargepage] received data:", data);
                Alert.alert('成功', `兑换成功，请返回个人中心刷新查看您的金币`);
            })
            .catch(function (error) {
                console.log("[chargepage] error:", error);
                Alert.alert('失败', `兑换失败，请检查兑换码是否正确`);
            })

    };

    const renderAmountButton = (value) => (
        <TouchableOpacity
            style={[styles.amountButton, amount === value && styles.selectedAmount]}
            onPress={() => setAmount(value)}
        >
            <Text style={[styles.amountText, amount === value && styles.selectedAmountText]}>
                {value}元
            </Text>
            <Text style={[styles.coinText, amount === value && styles.selectedCoinText]}>
                {calculateCoins(value)}金币
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>充值中心</Text>
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={() => setIsCDK(!isCDK)} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>{isCDK ? '点击切换正常充值' : '点击切换兑换码兑换'}</Text>
                </TouchableOpacity>
                {!isCDK ? (
                    <>
                        <Text style={styles.sectionTitle}>选择充值金额</Text>
                        <View style={styles.amountContainer}>
                            {renderAmountButton('10')}
                            {renderAmountButton('30')}
                            {renderAmountButton('50')}
                            {renderAmountButton('100')}
                            {renderAmountButton('200')}
                            {renderAmountButton('500')}
                        </View>

                        <View style={styles.customAmountContainer}>
                            <Text style={styles.customAmountLabel}>自定义金额：</Text>
                            <TextInput
                                style={styles.customAmountInput}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={(text) =>
                                    text.length < 8 ?
                                        setAmount(text.replace(/[^0-9]/g, '')) : 0
                                }
                            />
                            <Text style={styles.customAmountUnit}>元</Text>
                        </View>

                        {coins > 0 && (
                            <Text style={styles.customCoinText}>
                                将获得 {coins} 金币
                            </Text>
                        )}

                        <Text style={styles.sectionTitle}>选择支付方式</Text>
                        <View style={styles.paymentMethodContainer}>
                            <TouchableOpacity
                                style={[styles.paymentMethod, paymentMethod === 'WeChat' && styles.selectedPaymentMethod]}
                                onPress={() => setPaymentMethod('WeChat')}
                            >
                                <Image
                                    source={wechatpayIcon}
                                    style={styles.paymentIcon}
                                />
                                <Text style={styles.paymentText}>微信支付</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.paymentMethod, paymentMethod === 'Alipay' && styles.selectedPaymentMethod]}
                                onPress={() => setPaymentMethod('Alipay')}
                            >
                                <Image
                                    source={alipayIcon}
                                    style={styles.paymentIcon}
                                />
                                <Text style={styles.paymentText}>支付宝</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleRecharge}>
                            <Text style={styles.buttonText}>确认充值</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={styles.customAmountContainer}>
                            <Text style={styles.customAmountLabel}>兑换码兑换金币</Text>
                            <TextInput
                                style={styles.customAmountInput}
                                placeholder='输入兑换码'
                                keyboardType="default"
                                value={CDKey}
                                onChangeText={(text) =>
                                    text.length < 20 ?
                                        setCDKey(text) : 0
                                }
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleExchange}>
                            <Text style={styles.buttonText}>确认兑换</Text>
                        </TouchableOpacity>
                    </>
                )
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 30,
        backgroundColor: '#2196f3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        margin: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    amountContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    amountButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        width: '31%',
        marginBottom: 10,
        alignItems: 'center',
    },
    selectedAmount: {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
    },
    amountText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    selectedAmountText: {
        color: '#1890ff',
        fontWeight: 'bold',
    },
    coinText: {
        fontSize: 12,
        color: '#666',
    },
    selectedCoinText: {
        color: '#1890ff',
    },
    customAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    customAmountLabel: {
        fontSize: 16,
        marginRight: 10,
        color: '#000',
    },
    customAmountInput: {
        color: '#333',
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    customAmountUnit: {
        fontSize: 16,
        marginLeft: 10,
        color: '#000',
    },
    customCoinText: {
        fontSize: 14,
        color: '#1890ff',
        marginBottom: 20,
        textAlign: 'center',
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    paymentMethod: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    selectedPaymentMethod: {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
    },
    paymentIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    paymentText: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#1890ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleButton: {
        backgroundColor: '#42a5f5',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    toggleButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});