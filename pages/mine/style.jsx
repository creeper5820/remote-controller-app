import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e88e5',
    },
    header: {
        backgroundColor: '#1e88e5',
        paddingBottom: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: "auto",
    },
    statItem: {
        alignItems: 'center',
        backgroundColor: '#2196f3',
        width: '40%',
        margin: 10,
        padding: 10,
        borderRadius: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#FFF',
    },
    userOperationContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    userOperationItemFirst: {
        backgroundColor: '#fff',
        marginTop: 0,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'space-between',
    },
    userOperationItem: {
        backgroundColor: '#fff',
        marginTop: 0,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    userOperationText: {
        fontSize: 20,
        color: '#000',
    },
    goToIcon: {
        width: 20,
        height: 20
    }
});

export default styles;