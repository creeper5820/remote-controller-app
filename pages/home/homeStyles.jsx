import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        padding: 15,
    },
    topBarCarIcon: {
        width: 25,
        height: 25,
    },
    topBarSelectIcon: {
        width: 30,
        height: 30,
    },
    topBarText: {
        marginLeft: 10,
        marginRight: 5,
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 17,
        fontWeight: 'light',
    },
    header: {
        backgroundColor: '#fff',
        padding: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    headerItem: {
        alignItems: 'center',
    },
    headerIcon: {
        width: 50,
        height: 50,
    },
    headerIconContainerGreen: {
        backgroundColor: '#58d68d',
        borderRadius: 20,
        padding: 10,
    },
    headerIconContainerRed: {
        backgroundColor: '#e57373',
        borderRadius: 20,
        padding: 10,
    },
    headerIconContainerYellow: {
        backgroundColor: '#f1c40f',
        borderRadius: 20,
        padding: 10,
    },
    headerText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    announcementContainer: {
        backgroundColor: '#e0f7fa',
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    announcementText: {
        color: '#0277bd',
        fontSize: 16,
    },
    cardContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusBadge: {
        backgroundColor: '#f68026',
        color: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
        fontSize: 12,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
    },
    recommendBadge: {
        color: '#5cc1f1',
        fontSize: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#e1f5fe',
    },
    cardContent: {
        flexDirection: 'row',
    },
    carImage: {
        width: 80,
        height: 80,
        margin: 15,
        borderRadius: 10,
    },
    carInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    carImageInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    queueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        margin: 10,
        alignSelf: 'center',
    },
    manifactureText: {
        color: '#333',
        margin: 10,
        alignSelf: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    normalText: {
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
    },
    boldTextRed: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ec3737',
    },
    boldTextGreen: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7DDA58',
    },
    driveButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 25,
        marginHorizontal: 25,
        justifyContent: 'space-between',
    },
    driveButtonText: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
    },
    carStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default styles;
