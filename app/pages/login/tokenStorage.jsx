import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 * 30,
    enableCache: true,
    sync: () => { },
});

export function saveToken(token) {
    storage.save({
        key: 'loginToken',
        data: token,
        expires: 1000 * 3600,
        // expires: 1000 * 3600 * 24 * 30,
    });
}

export async function getToken() {
    try {
        console.log('[getToken] loading from storage');
        const token = await storage.load({
            key: 'loginToken',
            autoSync: true,
            syncInBackground: false,
        });

        if (!token) {
            console.log('[getToken] warning: token not found');
            return null;
        } else if (token === null) {
            console.log('[getToken] warning: token is null');
            return null;
        } else {
            console.log(`[getToken] token is valid : [${token}] `);
            return token;
        }
    } catch (error) {
        switch (error.name) {
            case 'NotFoundError':
                console.log('[getToken] warning: token not found');
                return null;
            case 'ExpiredError':
                console.log('[getToken] warning: token expired');
                return null;
            default:
                throw error;
        }
    }
}

