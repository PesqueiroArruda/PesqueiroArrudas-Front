import { serverApi } from 'services/serverApi';

class MenuOrganizationService {
  async getCategoryOrder(): Promise<string[]> {
    const { data } = await serverApi.get('/menu-settings');
    return data.categoryOrder || [];
  }

  async updateCategoryOrder(categoryOrder: string[]) {
    const { data } = await serverApi.put('/menu-settings', { categoryOrder });
    return data;
  }
}

export default new MenuOrganizationService();
