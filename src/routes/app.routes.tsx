import React from 'react';

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../pages/Home";
import { Register } from "../pages/Register";
import { Details } from "../pages/Details";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes(){
  return(
    <Navigator screenOptions={{headerShown: false}}>
        <Screen name='home' component={Home}/>
        <Screen name='new' component={Register}/>
        <Screen name='details' component={Details}/>
    </Navigator>
  )
}