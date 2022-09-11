import { NativeBaseProvider, StatusBar } from 'native-base';
import React from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import { THEME } from './src/styles/theme';
import Loading from './src/components/Loading';
import { Routes } from './src/routes';

export default function App() {
    const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

    return (
        <NativeBaseProvider theme={THEME}>
            <Provider store={store}>
                <StatusBar
                    barStyle='light-content'
                    backgroundColor='transparent'
                    translucent
                />
                {fontsLoaded ? <Routes /> : <Loading />}
            </Provider>
        </NativeBaseProvider>
    );
}
