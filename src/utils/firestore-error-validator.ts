export const checkErrorMessage = (error)=>{
    if(error === "auth/user-not-found"){
      return "E-mail e/ou senha inválida!"
    }

    if(error === "auth/invalid-email"){
      return "E-mail invalido!"
    }
    
    if(error === "auth/email-already-in-use"){
      return "Este e-mail ja está sendo utilizado!"
    }

    if(error === "auth/wrong-password"){
      return "E-mail e/ou senha inválida!"
    }

    if(error === "auth/auth/weak-password"){
      return "A senha deve conter no minimo 6 caracteres!"
    }

    return "Não foi possivel acessar. Tente novamente mais tade!"
  }