import React, { useEffect, useState } from 'react';
import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';

import Logo from "../assets/logo_secondary.svg";
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import auth  from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import { dateFormat } from '../utils/firestore-data-format';
import Loading from '../components/Loading';

export function Home() {
  const [isLoading,setIsLoading] = useState(true);
  const [statusSelected,setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders,setOrders] = useState<OrderProps[]>([]);
  const {colors} = useTheme();

  const navigation = useNavigation();

  const handleNewOrder = ()=>{
    navigation.navigate('new')
  }

  const handleSignOut = ()=>{
    auth()
    .signOut()
    .catch((error)=>{
      console.log(error);
      return Alert.alert("Sair", "Não foi possivel sair.")
    })
    ;
  }

  const handleOpenDetails = (orderId: string)=>{
    navigation.navigate('details',{orderId})
  }

  useEffect(()=>{
    setIsLoading(true);
    const subscriber = firestore()
    .collection("orders")
    .where("status","==",statusSelected)
    .onSnapshot(snapshot=>{
      const data = snapshot.docs.map((doc)=>{
        const {patrimony,description,status,created_at} = doc.data();

        return {
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at) 
        }
      })
      setOrders(data)
      setIsLoading(false);
    })

    return subscriber;

  },[statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700">
        <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
        >
          <Logo/>
          <IconButton onPress={handleSignOut} icon={<SignOut size={26} color={colors.gray[300]}/>} />
        </HStack>

        <VStack flex={1} px={6}>

          <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
            <Heading color="gray.100">Meus chamados</Heading>
            <Text color="gray.200">{orders.length}</Text>

          </HStack>

          <HStack space={3} mb={8}>
            <Filter 
              type='open' 
              title='em andamento' 
              onPress={()=>setStatusSelected('open')}
              isActive={statusSelected === 'open'}
            />
            <Filter 
              type='closed' 
              title='finalizado' 
              onPress={()=>setStatusSelected('closed')}
              isActive={statusSelected === 'closed'}
            />
          </HStack>
{          
        (isLoading)?
        <Loading/>
        :
        <FlatList 
            data={orders} 
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:100}}
            ListEmptyComponent={()=>(
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40}/>
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {'\n'} 
                  solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                </Text>
              </Center>
            )}
            renderItem={({item})=> <Order data={item} onPress={()=>handleOpenDetails(item.id)}/>}
          />}
          <Button onPress={handleNewOrder} title='Nova solicitação'/>
        </VStack>
    </VStack>
  );
}