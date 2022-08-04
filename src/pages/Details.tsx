import React from 'react';
import { Text, useTheme, VStack } from 'native-base';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  orderId: string,
}

export function Details() {

  const { colors } = useTheme();
  const route = useRoute();

  const {orderId} = route.params as RouteParams;

  return (
    <VStack flex={1} bg="gray.700">
        <Header title='Solicitação'/>
        <Text color="white">{orderId}</Text>
    </VStack>
  );
}