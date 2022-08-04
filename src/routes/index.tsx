import React from 'react';

import SignIn from '../pages/SignIn';
import {NavigationContainer} from '@react-navigation/native'

import { AppRoutes } from './app.routes'

export function Routes(){
  return(
    <NavigationContainer>
      <AppRoutes/>
    </NavigationContainer>
  )
}