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
        marginHorizontal: 30,
    },
    statItem: {
        alignItems: 'center',
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
    leaderboardContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
    },
    leaderboardHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    leaderboardHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: '#888',
    },
    activeTab: {
        color: '#000',
        borderBottomWidth: 2,
        borderBottomColor: '#64b5f6',
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    medalIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medalText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    medalTextDefault: {
        color: '#000',
        fontWeight: 'bold',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    name: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default styles;