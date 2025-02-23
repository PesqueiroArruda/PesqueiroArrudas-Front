/* eslint-disable jsx-a11y/no-access-key */
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useState } from 'react';
import { LoginLayout } from './layout';
import LoginService from './services/LoginService';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [sendedLoginRequest, setSendedLoginRequest] = useState(false);

  const router = useRouter();
  const toast = useToast();

  async function handleLogin(e: any) {
    console.log(accessKey)
    e.preventDefault();
    if (sendedLoginRequest) {
      return;
    }
    try {
      setSendedLoginRequest(true);
      if (!accessKey) {
        toast.closeAll();
        toast({
          status: 'error',
          title: 'Não deixe nada em branco :(',
          duration: 3000,
          isClosable: true,
        });
        setSendedLoginRequest(false);
        return;
      }

      const splitedValues = accessKey.split('@')

      const user = splitedValues[0]
      const userValidation = splitedValues[1]

      const isUser = splitedValues[1] === 'usuario'


      const { isAuthorized, message, isAdmin } = await LoginService.login(isUser ? `@${userValidation}` : accessKey);

      if (!isAuthorized) {
        toast.closeAll();
        toast({
          status: 'error',
          title: 'Chave de acesso incorreta!',
          duration: 3000,
          isClosable: true,
        });
        setSendedLoginRequest(false);
        return;
      }

      localStorage.setItem('loggedUser', user)
      localStorage.setItem('isAdmin', isAdmin)

      toast.closeAll();
      toast({
        status: 'success',
        title: message,
        duration: 1000,
      });

      setCookie(null, 'isAuthorized', 'true', {
        maxAge: 60 * 60 * 24 * 20,
      });

      if(isAdmin) router.push('/');
      else router.push('/commands')
    } catch (error: any) {
      setSendedLoginRequest(false);
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response.data.message,
      });
    }
  }
  return (
    <LoginLayout
      setShowPassword={setShowPassword}
      showPassword={showPassword}
      handleLogin={handleLogin}
      accessKey={accessKey}
      setAccessKey={setAccessKey}
      sendedLoginRequest={sendedLoginRequest}
    />
  );
};
