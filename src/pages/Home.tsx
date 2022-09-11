import React, { useEffect, useState } from 'react';
import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';

import Logo from '../assets/logo_secondary.svg';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert, RefreshControl } from 'react-native';
import { dateFormat } from '../utils/firestore-data-format';
import Loading from '../components/Loading';
import { RootState } from '../redux/store';
import { Role } from '../enums/roles';

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
    const [subFilter, setSubFilter] = useState<'all' | 'my'>('all');
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const { colors } = useTheme();

    const { role, userId } = useSelector((state: RootState) => state.auth);

    const navigation = useNavigation();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        wait(300).then(() => {
            getDataFiltered();
            setRefreshing(false);
        });
    };

    const handleNewOrder = () => {
        navigation.navigate('new');
    };

    const handleSignOut = () => {
        auth()
            .signOut()
            .catch((error) => {
                console.log(error);
                return Alert.alert('Sair', 'Não foi possivel sair.');
            });
    };

    const handleOpenDetails = (orderId: string) => {
        navigation.navigate('details', { orderId });
    };

    const getDataFiltered = () => {
        setIsLoading(true);
        let query: any = firestore().collection('orders');
        query = query.where('status', '==', statusSelected);

        if (role === Role.CLIENT) {
            query = query.where('createdBy', '==', userId);
        }

        if (subFilter === 'my') {
            query = query.where('solutionBy', '==', userId);
        }

        query.onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const { patrimony, description, status, created_at } = doc.data();

                return {
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    when: dateFormat(created_at),
                };
            });
            setOrders(data);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        return getDataFiltered();
    }, [statusSelected, subFilter]);

    return (
        <VStack
            flex={1}
            pb={6}
            bg='gray.700'
        >
            <HStack
                w='full'
                justifyContent='space-between'
                alignItems='center'
                bg='gray.600'
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />
                <IconButton
                    onPress={handleSignOut}
                    icon={
                        <SignOut
                            size={26}
                            color={colors.gray[300]}
                        />
                    }
                />
            </HStack>

            <VStack
                flex={1}
                px={6}
            >
                <HStack
                    w='full'
                    mt={8}
                    mb={4}
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Heading color='gray.100'>Meus chamados</Heading>
                    <Text color='gray.200'>{orders.length}</Text>
                </HStack>
                <VStack>
                    <HStack
                        space={3}
                        mb={8}
                    >
                        <Filter
                            type='open'
                            title='em andamento'
                            onPress={() => setStatusSelected('open')}
                            isActive={statusSelected === 'open'}
                        />
                        <Filter
                            type='closed'
                            title='finalizado'
                            onPress={() => setStatusSelected('closed')}
                            isActive={statusSelected === 'closed'}
                        />
                    </HStack>
                    {role === Role.TECH && statusSelected === 'closed' && (
                        <HStack
                            space={3}
                            mb={8}
                        >
                            <Filter
                                type='all'
                                title='TODOS'
                                onPress={() => setSubFilter('all')}
                                isActive={subFilter === 'all'}
                            />
                            <Filter
                                type='my'
                                title='MEUS CHAMADOS'
                                onPress={() => setSubFilter('my')}
                                isActive={subFilter === 'my'}
                            />
                        </HStack>
                    )}
                </VStack>
                {isLoading ? (
                    <Loading />
                ) : (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        data={orders}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText
                                    color={colors.gray[300]}
                                    size={40}
                                />
                                <Text
                                    color='gray.300'
                                    fontSize='xl'
                                    mt={6}
                                    textAlign='center'
                                >
                                    Você ainda não possui {'\n'}
                                    solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                                </Text>
                            </Center>
                        )}
                        renderItem={({ item }) => (
                            <Order
                                data={item}
                                onPress={() => handleOpenDetails(item.id)}
                            />
                        )}
                    />
                )}
                <Button
                    onPress={handleNewOrder}
                    title='Nova solicitação'
                />
            </VStack>
        </VStack>
    );
}
