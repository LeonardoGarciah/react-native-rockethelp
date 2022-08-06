import React, { useEffect, useState } from 'react';

import SignIn from '../pages/SignIn';
import {NavigationContainer} from '@react-navigation/native'

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import { AppRoutes } from './app.routes'
import Loading from '../components/Loading';

export function Routes(){
  const [isLoading,setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(()=>{
    const subscribe = auth()
    .onAuthStateChanged(response =>{
      setUser(response)
      setIsLoading(false);
    });
    
    return subscribe;
  },[])

  if(isLoading){
    return <Loading/>
  }

  return(
    <NavigationContainer>
      {
        user ? <AppRoutes/> :<SignIn/>}
    </NavigationContainer>
  )
}