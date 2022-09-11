import axios from 'axios';

export const sendNotification = (orderId: string, receiverId) => {
    axios.post('https://fcm.googleapis.com/v1/projects/rockethelp-2446a/messages:send', {
        
            message:{
               token:receiverId,
               data:{
                   order: `${orderId}`
               },
               notification:{
                 body:"This is an FCM notification message!",
                 title:"FCM Message"
               }
            
         }
    })
} 