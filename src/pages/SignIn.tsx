import { Heading, Icon, useTheme, VStack } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import React, { useState } from "react";

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import Input from "../components/Input";

const SignIn = ()=>{
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const { colors } = useTheme();

    const handleSignIn = ()=>{

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
        <Button onPress={handleSignIn} title="Entrar" w={"full"}/>

    </VStack>

  );
}



export default SignIn;