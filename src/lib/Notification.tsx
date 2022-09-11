import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { useDispatch } from 'react-redux';
import { setDeviceToken } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const Notification = () => {
    const dispatch = useDispatch();

    const navigation = useNavigation();

    PushNotification.configure({
        onRegister: function (token) {
            console.log('TOKEN:', token);
            dispatch(setDeviceToken(token.token));
        },

        onNotification: function (notification) {
            console.log('NOTIFICATION ON NOTIFICATION:', notification);
            if (notification.userInteraction) {
                const orderId = notification.data.orderId;
                navigation.navigate('details', { orderId });
            }

            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        onAction: function (notification) {
            console.log('ACTION:', notification.action);
            console.log('NOTIFICATION:', notification);
        },

        onRegistrationError: function (err) {
            console.error(err.message, err);
        },

        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    });

    return null;
};

export default Notification;
