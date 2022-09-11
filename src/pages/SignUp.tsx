import { Heading, Icon, useTheme, VStack } from "native-base";
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from "phosphor-react-native";
import React, { useState } from "react";

import { useDispatch } from 'react-redux';

import firestore from '@react-native-firebase/firestore';

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { Role } from "../enums/roles";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native";
import { checkErrorMessage } from "../utils/firestore-error-validator";

const SignUp = ()=>{
   const dispatch: AppDispatch = useDispatch();

   const navigate = useNavigation();

    const [ email,setEmail ] = useState("");
    const [ isLoading,setIsLoading ] = useState(false);
    const [ password,setPassword ] = useState("");
    const { colors } = useTheme();

    const handleSignIn = () => {
      navigate.goBack();
    }

    const handleSignUp = () => {
      if (!email || !password) {
        return Alert.alert("Registrar","Informe email ou senha")
      }

      setIsLoading(true);

      auth().createUserWithEmailAndPassword(email,password).then( (response) => {
        saveUserInFirestore(response);
      })
      .catch( (error) => {
        console.log(error);
        Alert.alert("Registrar",checkErrorMessage(error.code));

      })
    }

    const saveUserInFirestore = (response) => {
      firestore().collection("users").add({
        userId: response.user.uid,
        role: Role.CLIENT,
        createdAt: response.user.metadata.creationTime
      }).then( () => {
        setIsLoading(false)
      }).catch( (error) => {
        Alert.alert("Registrar",checkErrorMessage(error.code));
      })
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
        <Button isLoading={isLoading} onPress={handleSignUp} title="Registrar"  w={"full"}/>
        <Button 
            bg={"transparent"} 
            btnColor="purple.300"
            borderColor="purple.500"
            borderWidth={1} 
            onPress={handleSignIn} 
            title="Entrar" 
            mt={10} 
            _pressed={{
              bg:"purple.500"
            }}
            w={"full"}
        />

    </VStack>

  );
}

export default SignUp;