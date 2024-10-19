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
    topBarText: {
        marginLeft: 10,
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
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
        color: '#777',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventTitle: {
        margin: 10,
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
    },
    cardContent: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carImage: {
        width: 80,
        height: 80,
        margin: 15,
        borderRadius: 10,
    },
    carStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 40,
    },
    carDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    carInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    normalText: {
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
    },
    normalTextRed: {
        fontWeight: 'bold',
        color: '#ed2939',
    },
    normalTextGreen: {
        fontWeight: 'bold',
        color: '#7DDA58',
    },
    smallText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: 'light',
        color: '#777',
    },
    boldTextBlue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#23aaf2',
    },
    boldTextBlack: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d2a2e',
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

});

export default styles;