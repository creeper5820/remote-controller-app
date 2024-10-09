import { View, Text } from "react-native";

export default function Activity({ route, navigation }) {
    {
        const { eventName, manifacture, queueNumber, onlineNumber, driveNumber } = { ...route.params.ActivityInfo };
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, color: 'black' }}>{eventName}</Text>
                <Text style={{ fontSize: 30, color: 'black' }}>{manifacture}</Text>
                <Text style={{ fontSize: 30, color: 'black' }}>{queueNumber}</Text>
                <Text style={{ fontSize: 30, color: 'black' }}>{onlineNumber}</Text>
                <Text style={{ fontSize: 30, color: 'black' }}>{driveNumber}</Text>
            </View>
        );
    }
}