import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e88e5',
    },
    scrollViewContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    profileLevel: {
        backgroundColor: '#2196f3',
        fontSize: 20,
        color: '#FFF',
        paddingHorizontal: 10,
        marginVertical: 5,
        fontWeight: 'light',
        borderRadius: 10
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
        width: '25%',
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
    },
    logoutButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        margin: 10,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },

});

export default styles;