import axios from 'axios';

import { MenuUser, MenuUserFilters } from 'types/MenuUser';

const api = axios.create({ baseURL: '/api/menu-users' });

class MenuUsersService {
  async list(filters: MenuUserFilters): Promise<MenuUser[]> {
    const { data } = await api.get<{ menuUsers: MenuUser[] }>('/', { params: filters });
    return data.menuUsers;
  }
}

export default new MenuUsersService();
