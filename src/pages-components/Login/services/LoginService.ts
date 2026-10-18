import { serverApi } from 'services/serverApi';

class LoginService {
  async login(accessKey: string) {
    const { data } = await serverApi.post('/auth/login', { accessKey });
    return data;
  }

  async loginWithUser({
    username,
    password,
    deviceId,
  }: {
    username: string;
    password: string;
    deviceId: string;
  }) {
    const { data } = await serverApi.post('/auth/login', {
      username,
      password,
      deviceId,
    });
    return data;
  }
}

export default new LoginService();
