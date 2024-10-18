import { useState, useEffect, useRef } from "react";
import { View, Text, Button, TextInput } from "react-native";

// function connect(websocketAddress) {
//     return useRef(new WebSocket(websocketAddress)).current;
// }

// export default function Mine() {
//     const [serverState, setServerState] = useState('Loading...');
//     const [messageText, setMessageText] = useState('');
//     const [serverMessages, setServerMessages] = useState([]);

//     var ws = connect('ws://124.222.224.186:8800');

//     useEffect(() => {
//         const serverMessagesList = [];
//         ws.onopen = () => {
//             setServerState('Connected to the server')
//         };
//         ws.onclose = (e) => {
//             setServerState('Disconnected')
//         };
//         ws.onerror = (e) => {
//             setServerState(e.message);
//         };
//         ws.onmessage = (e) => {
//             if (serverMessagesList.length > 0)
//                 serverMessagesList.shift();
//             serverMessagesList.push(e.data);
//             setServerMessages([...serverMessagesList])
//         };
//     }, [])

//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Text style={{ fontSize: 15, color: 'green' }}>{serverState}</Text>
//             <Text style={{ fontSize: 30, color: 'black' }}>{serverMessages}</Text>
//             <TextInput onChangeText={setMessageText} value={messageText} />
//             <Button title="Send" onPress={() => ws.send(messageText)} />
//             <Button title="Disconnect" onPress={() => ws.close()} />
//         </View>
//     );

// }

export default function Mine() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 30, color: 'black' }}>Mine</Text>
        </View>
    );
}