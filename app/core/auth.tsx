import AsyncStorage from '@react-native-async-storage/async-storage';
import { message_request_url } from "../config.tsx";
import axios from 'axios';

export default class AuthManager {
    private token_cache: string | null = null;

    public constructor() {
        this.token_cache = "unauthenticated";
    }

    public async make_login_request(username: string, password: string): Promise<boolean> {
        const response = axios.post(`${message_request_url}/api/login`, {
            "username": username,
            "password": password
        });
        response.then((response) => {
            this.token_cache = response.data.token;
            return true;
        })

        return false;
    }

    private async remove_token(): Promise<boolean> {
        try {
            await AsyncStorage.removeItem('@app:token');
            return true;
        } catch (error) {
            console.error('failed to remove token:', error);
            return false;
        }
    }

    private async save_token(token: string): Promise<boolean> {
        try {
            await AsyncStorage.setItem('@app:token', token);
            return true;
        } catch (error) {
            console.error('failed to save token:', error);
            return false;
        }
    }

    private async get_token(): Promise<string | null> {
        try {
            const token = await AsyncStorage.getItem('@app:token');
            return token;
        } catch (error) {
            console.error('failed to get token:', error);
            return null;
        }
    }
}
