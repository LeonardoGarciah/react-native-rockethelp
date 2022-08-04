import React from 'react';
import { useTheme, VStack } from 'native-base';
import { Header } from '../components/Header';

export function Details() {

  const { colors } = useTheme();

  return (
    <VStack flex={1} bg="gray.700">
        <Header title='Solicitação'/>
    </VStack>
  );
}