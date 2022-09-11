import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import { UserFirestoreDTO } from '../DTO/UserDTO';

const getUserDevice = async (userId: string) => {
    return firestore()
        .collection<UserFirestoreDTO>('users')
        .where('userId', '==', userId)
        .get()
        .then((doc) => {
            const { deviceToken } = doc.docs[0].data();
            return deviceToken;
        });
};

export const sendNotification = async (title: string, body: string, orderId: string, receiverId: string) => {
    const deviceReceiverToken = await getUserDevice(receiverId);
    try {
        await axios
            .post('http://192.168.0.9:3000/notifications', {
                title,
                body,
                orderId,
                deviceReceiverToken
            })
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
            });
    } catch (error) {
        console.log(error);
    }
};

