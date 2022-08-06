import { Heading, Icon, useTheme, VStack } from "native-base";
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from "phosphor-react-native";
import React, { useState } from "react";

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import Input from "../components/Input";

const SignIn = ()=>{
    const [email,setEmail] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [password,setPassword] = useState("");
    const { colors } = useTheme();

    const handleSignIn = ()=>{
      if(!email && !password){
        Alert.alert("Login","Informe email ou senha")
      }

      setIsLoading(true);

      auth().signInWithEmailAndPassword(email,password).then((response)=>{

      })
      .catch((error)=>{
        console.log(error);
        Alert.alert("Entrar",checkErrorMessage(error.code));

        setIsLoading(false)
      })
    }

    function checkErrorMessage(error){
      if(error === "auth/user-not-found"){
        return "E-mail e/ou senha inválida!"
      }

      if(error === "auth/invalid-email"){
        return "E-mail invalido!"
      }

      if(error === "auth/wrong-password"){
        return "E-mail e/ou senha inválida!"
      }

      return "Não foi possivel acessar. Tente novamente mais tade!"
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

    </VStack>

  );
}



export default SignIn;