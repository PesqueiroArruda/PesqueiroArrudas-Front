/* eslint-disable jsx-a11y/no-access-key */
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDeviceId, saveSession } from 'services/session';
import { LoginLayout, LoginMode } from './layout';
import LoginService from './services/LoginService';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<LoginMode>('team');
  const [accessKey, setAccessKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sendedLoginRequest, setSendedLoginRequest] = useState(false);

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    try {
      if (localStorage.getItem('loginMode') === 'key') setMode('key');
    } catch (error) {
      // sem localStorage, fica no modo padrão
    }
  }, []);

  function handleChangeMode(nextMode: LoginMode) {
    setMode(nextMode);
    try {
      localStorage.setItem('loginMode', nextMode);
    } catch (error) {
      // preferência opcional
    }
  }

  function showError(title: string) {
    toast.closeAll();
    toast({ status: 'error', title, duration: 3000, isClosable: true });
  }

  // Login antigo, por chave de acesso (balcão).
  async function loginWithKey() {
    const splitedValues = accessKey.split('@');
    const user = splitedValues[0];
    const userValidation = splitedValues[1];
    const isUser = splitedValues[1] === 'usuario';

    const { isAuthorized, message, isAdmin, token } = await LoginService.login(
      isUser ? `@${userValidation}` : accessKey
    );

    if (!isAuthorized) {
      showError('Chave de acesso incorreta!');
      return false;
    }

    saveSession({
      token,
      isAdmin,
      role: isAdmin ? 'admin' : 'user',
      name: !isAdmin ? user : 'Bar',
    });

    toast.closeAll();
    toast({ status: 'success', title: message, duration: 1000 });
    router.push(isAdmin ? '/' : '/commands');
    return true;
  }

  // Login por conta de usuário (garçom ou admin com senha própria).
  async function loginWithAccount() {
    const data = await LoginService.loginWithUser({
      username: username.trim(),
      password,
      deviceId: getDeviceId(),
    });

    if (!data.isAuthorized) {
      showError(data.message || 'Usuário ou senha inválidos');
      return false;
    }

    saveSession({
      token: data.token,
      isAdmin: data.isAdmin,
      role: data.role,
      name: data.name,
    });

    toast.closeAll();
    toast({ status: 'success', title: `Olá, ${data.name}!`, duration: 1000 });
    router.push(data.role === 'waiter' ? '/garcom' : '/');
    return true;
  }

  async function handleLogin(e: any) {
    e.preventDefault();
    if (sendedLoginRequest) {
      return;
    }

    const isKeyMode = mode === 'key';
    if ((isKeyMode && !accessKey) || (!isKeyMode && (!username.trim() || !password))) {
      showError('Não deixe nada em branco :(');
      return;
    }

    try {
      setSendedLoginRequest(true);
      const succeeded = isKeyMode ? await loginWithKey() : await loginWithAccount();
      if (!succeeded) setSendedLoginRequest(false);
    } catch (error: any) {
      setSendedLoginRequest(false);
      showError(
        error?.response?.data?.message || 'Request failed. Please try again.'
      );
    }
  }

  return (
    <LoginLayout
      mode={mode}
      handleChangeMode={handleChangeMode}
      setShowPassword={setShowPassword}
      showPassword={showPassword}
      handleLogin={handleLogin}
      accessKey={accessKey}
      setAccessKey={setAccessKey}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      sendedLoginRequest={sendedLoginRequest}
    />
  );
};
