import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 * 30,
    enableCache: true,
    sync: () => { },
});

export function saveToken({ token }) {
    storage.save({
        key: 'loginToken',
        data: {
            token: { token }
        },
        expires: 1000 * 3600 * 24 * 30,
    });
}

export async function getToken() {
    try {
        const { token } = await storage.load({
            key: 'loginToken',
            autoSync: true,
            syncInBackground: true,
        });
        return { token: token };
    } catch (error) {
        switch (error.name) {
            case 'NotFoundError':
            case 'ExpiredError':
                return { token: null };
            default:
                throw error;
        }
    }
}
