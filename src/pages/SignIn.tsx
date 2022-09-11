import { Heading, Icon, useTheme, VStack } from "native-base";
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from "phosphor-react-native";
import React, { useState } from "react";

import { setAuth }  from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

import firestore from '@react-native-firebase/firestore';

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native"; 
import { UserFirestoreDTO } from "../DTO/UserDTO";
import { checkErrorMessage } from "../utils/firestore-error-validator";
import { useSelector } from "react-redux";

const SignIn = ()=>{
  const { deviceToken } = useSelector((state: RootState) => state.auth)

   const dispatch: AppDispatch = useDispatch();

   const navigate = useNavigation();

    const [email,setEmail] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [password,setPassword] = useState("");
    const { colors } = useTheme();

    const updateUserDevice = (userDocId: string) => {
      console.log(userDocId);
      firestore()
      .collection("users")
      .doc(userDocId)
      .update({
        deviceToken
      })
      .then()
      .catch((error)=>{
        console.log("updateUserDevice ",error);
      })
    }

    const handleSignIn = ()=>{
      if(!email || !password){
        return Alert.alert("Login","Informe email ou senha")
      }
      setIsLoading(true);
      auth().signInWithEmailAndPassword(email,password).then((response)=>{
        getUserInfos(response.user.uid);
      })
      .catch((error)=>{
        console.log(error);
        Alert.alert("Entrar",checkErrorMessage(error.code));

        setIsLoading(false)
      })
    }

    const getUserInfos = ( id: string ) =>{
      firestore()
      .collection<UserFirestoreDTO>("users")
      .where("userId", "==", id)
      .get()
      .then((doc)=>{
        const {userId, role} = doc.docs[0].data();
        const docPath = doc.docs[0].ref.path.split("/")[1];
        dispatch(setAuth({ userId, role }));
        updateUserDevice(docPath);
      })
    }

    const handleSignUp = ()=>{
      navigate.navigate('register');
    }

  return(
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
        <Logo/>
        <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
            Acesse sua conta
        </Heading>

        <Input placeholder="E-mail"
         mb={4}
         InputLeftElement={<Icon ml={4} as={<Envelope color={colors.gray[300]}/>} />}
         onChangeText={setEmail}
         />

        <Input placeholder="Password"
            mb={8}
            secureTextEntry
            InputLeftElement={<Icon ml={4} as={<Key color={colors.gray[300]}/>} />}
            onChangeText={setPassword}
        />
        <Button isLoading={isLoading} onPress={handleSignIn} title="Entrar" w={"full"}/>

        <Button
            bg={"transparent"}
            btnColor="purple.300"
            borderColor="purple.500"
            _pressed={{
              bg:"purple.500"
            }}
            borderWidth={1} 
            title="Registrar-se" 
            onPress={handleSignUp} 
            w={"full"}
            mt={10}
         ></Button>

    </VStack>

  );
}



export default SignIn;