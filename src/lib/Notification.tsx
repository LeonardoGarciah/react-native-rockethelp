import React from 'react';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { setDeviceToken } from '../redux/slices/authSlice';

const Notification = () => {

    const dispatch = useDispatch();

    PushNotification.configure({
        onRegister: function (token) {
          console.log("TOKEN:", token);
          dispatch(setDeviceToken(token.token))
        },

        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);

          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
      
      
        onAction: function (notification) {
          console.log("ACTION:", notification.action);
          console.log("NOTIFICATION:", notification);

        },
    
        onRegistrationError: function(err) {
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
}

export default Notification;