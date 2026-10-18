import { serverApi } from 'services/serverApi';

export interface AppUser {
  _id: string;
  name: string;
  username: string;
  role: 'admin' | 'waiter';
  isActive: boolean;
  createdAt: string;
}

export interface UserDevice {
  _id: string;
  deviceId: string;
  userAgent: string;
  firstSeenAt: string;
  lastSeenAt: string;
  revoked: boolean;
}

export interface NetworkSettings {
  yourIp: string;
  allowedIps: string[];
  allowedHosts: string[];
  bypassUntil: string | null;
}

class UsersService {
  async list(): Promise<AppUser[]> {
    const { data } = await serverApi.get('/users');
    return data;
  }

  async create(payload: {
    name: string;
    username: string;
    password: string;
    role: string;
  }) {
    const { data } = await serverApi.post('/users', payload);
    return data;
  }

  async update(
    id: string,
    payload: Partial<{
      name: string;
      role: string;
      isActive: boolean;
      password: string;
    }>
  ) {
    const { data } = await serverApi.put(`/users/${id}`, payload);
    return data;
  }

  async devices(id: string): Promise<UserDevice[]> {
    const { data } = await serverApi.get(`/users/${id}/devices`);
    return data;
  }

  async setDeviceRevoked(userId: string, deviceId: string, revoked: boolean) {
    const { data } = await serverApi.put(`/users/${userId}/devices/${deviceId}`, {
      revoked,
    });
    return data;
  }

  async getNetwork(): Promise<NetworkSettings> {
    const { data } = await serverApi.get('/security/network');
    return data;
  }

  async updateNetwork(payload: {
    allowedIps?: string[];
    allowedHosts?: string[];
  }): Promise<NetworkSettings> {
    const { data } = await serverApi.put('/security/network', payload);
    return data;
  }

  async allowCurrentIp(): Promise<NetworkSettings> {
    const { data } = await serverApi.post('/security/network/use-current-ip');
    return data;
  }

  async bypass(minutes: number): Promise<NetworkSettings> {
    const { data } = await serverApi.post('/security/network/bypass', { minutes });
    return data;
  }
}

export default new UsersService();
