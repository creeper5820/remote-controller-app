import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#424242',
    },
    videoBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#1565c0',
        padding: 10,
        borderBottomRightRadius: 10,
    },
    backIcon: {
        width: 25,
        height: 25,
    },
    backText: {
        color: 'white',
    },
    leaderboard: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#1565c0',
        padding: 15
    },
    leaderboardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    leaderboardItem: {
        color: '#fafafa',
        fontSize: 14,
    },
    infoBar: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#1565c0',
    },
    infoText: {
        marginHorizontal: 15,
        marginVertical: 5,
        color: 'white',
        fontSize: 12,
    },
    controls: {
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        flexDirection: 'row',
    },
    controlButtonContainerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButtonContainerRight: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    controlButton: {
        marginRight: 20,
    },
    buttonIcon: {
        width: 70,
        height: 70,
    },
});

export default styles;