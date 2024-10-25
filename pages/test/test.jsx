import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: 1000 * 3600 * 24 * 30,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,
    sync: () => { },
});


export default function Test() {
    // storage.save({
    //     key: 'loginToken', // 注意:请不要在key中使用_下划线符号!
    //     data: {
    //         token: 'some token',
    //         saveTime: new Date().getTime(),
    //     },

    //     // 如果不指定过期时间，则会使用defaultExpires参数
    //     // 如果设为null，则永不过期
    //     expires: 1000 * 100,
    // });
    storage
        .load({
            key: 'loginToken',

            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true, // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。

            // 在调用sync方法的同时先返回已经过期的数据。
            syncInBackground: true,
        })
        .then(ret => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法

            console.log(ret.token);
            console.log(ret.saveTime);
        })
        .catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    console.log('not found');
                    break;
                case 'ExpiredError':
                    console.log('expired');
                    break;
            }
        });
    return null;
}