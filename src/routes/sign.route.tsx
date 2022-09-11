import React from 'react';

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const { Navigator, Screen } = createNativeStackNavigator();

export function SignRoutes(){
  return(
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name='login' component={SignIn}/>
      <Screen name='register' component={SignUp}/>
    </Navigator>
  )
}