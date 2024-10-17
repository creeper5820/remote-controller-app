import { View, Text, Button } from "react-native";
import { useEffect } from "react";
import { OrientationLocker, LANDSCAPE } from "react-native-orientation-locker";

export default function DrivePage({ navigation }) {
    useEffect(() => {
        const parentNavigation = navigation.getParent();
        if (parentNavigation)
            parentNavigation.setOptions({ tabBarStyle: { display: 'none' } });

        return () => {
            if (parentNavigation)
                parentNavigation.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    }, [navigation]);
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <OrientationLocker orientation={LANDSCAPE} />
            <Text style={{ fontSize: 30, color: 'black' }}>DrivePage</Text>
        </View>
    );

}