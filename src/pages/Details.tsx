import React, { useEffect, useState } from 'react';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { Header } from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { OrderProps } from '../components/Order';
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTO/OrderDTO';
import { dateFormat } from '../utils/firestore-data-format';
import Loading from '../components/Loading';
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import Input from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Role } from '../enums/roles';
import { sendNotification } from '../services/notification';


type RouteParams = {
  orderId: string,
}

type OrderDetails = OrderProps & {
  description:string,
  solution:string,
  closed: string,
}

export function Details() {
  const [ isLoading,setIsLoading ] = useState(true);
  const [ finishIsLoading,setFinishIsLoading ] = useState(false);
  const [ solution,setSolution ] = useState("");
  const [ order,setOrder ] = useState<OrderDetails>({} as OrderDetails);

  const { role, userId } = useSelector((state: RootState) => state.auth)


  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const {orderId} = route.params as RouteParams;

  const handleFinish = () => {
    if (!solution) {
      return Alert.alert("Solicitação", "Informe uma solução para encerrar a solicitação!");
    }
    setFinishIsLoading(true);
    firestore()
    .collection<OrderFirestoreDTO>("orders")
    .doc(orderId)
    .update({
      status: "closed",
      solution,
      closed_at: firestore.FieldValue.serverTimestamp(),
      solutionBy: userId
    })
    .then(()=>{
      Alert.alert("Solicitação","Solicitação encerrada com sucesso!")
      navigation.goBack();
    })
    .catch((error)=>{
      console.log(error);
    })

    sendNotification("Chamado atendido", `Seu chamado ${order.patrimony} foi atendido`, order.id, order.createdBy);
  }

  const handleDeleteOrder = () => {
    return Alert.alert(
      "Remover solicitação",
      "Deseja realmente cancelar essa solicitação?",
      [
        {
          text: "SIM",
          onPress: () => {
            removeOrder();
          },
        },
        {
          text: "NÃO",
        },
      ]
    );
  }

  function removeOrder(){
    firestore().collection('orders').doc(order.id).delete().then(()=>{
      Alert.alert("Cancelar chamado", "Chamado cancelado com sucesso!")
      navigation.navigate("home");
    }).catch((error)=>{
      Alert.alert("Cancelar chamado", "Não foi possivel cancelar o chamado, tente novamente mais tarde!")
    })
  }

  useEffect( () => {
    firestore()
    .collection<OrderFirestoreDTO>("orders")
    .doc(orderId)
    .get()
    .then((doc)=>{
      const {patrimony, description, status,created_at, createdBy,closed_at, solution} = doc.data();
      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed,
        createdBy
      })

      setIsLoading(false);
    })
  },[])

if (isLoading) {
  return <Loading/>
}

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600"/>
        <Header title='Solicitação'/>
        <HStack bg="gray.500" justifyContent="center" p={4}>
          {
            order.status === 'closed'?
            <CircleWavyCheck size={22} color={colors.green["300"]}/>
            :
            <Hourglass size={22} color={colors.secondary["700"]}/>
          }
          <Text
          fontSize="sm"
          color={order.status === "closed" ? colors.green["300"] : colors.secondary["700"]}
          ml={2}
          textTransform="uppercase"
          >
            {order.status === 'closed' ? "Finalizado" : "Em andamento"}
          </Text>
        </HStack>
        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetails 
                title='Equipamento' 
                description={`Patrimonio ${order.patrimony}`}
                icon={DesktopTower}
                footer={order.when}
          />

        <CardDetails 
                title='Descriçao do problema' 
                description={order.description}
                icon={Clipboard}
          />

          <CardDetails 
                title='Solução' 
                icon={CircleWavyCheck}
                description={order.solution}
                footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {
              order.status === 'open' && role === Role.TECH &&
              <Input
                    placeholder='Descrição da solução'
                    onChangeText={setSolution}
                    h={24}
                    textAlignVertical="top"
                    multiline
                    bg="gray.600"
              />

            }
          </CardDetails>
        </ScrollView>

        {
          !order.closed && 
          <Button 
                isLoading={finishIsLoading}
                onPress={ role === Role.TECH ? handleFinish : handleDeleteOrder}
                m={5}
                title={ role === Role.TECH? 'ENCERRAR SOLICITAÇÃO' : 'CANCELAR SOLICITAÇÃO'}
          />
        }
    </VStack>
  );
}