import { serverApi } from 'services/serverApi';
import { Command } from 'types/Command';

interface UpdateCommand extends Command {
  _id: string | undefined;
}

class CommandsService {
  async getAllCommands() {
    const { data } = await serverApi.get('/commands');
    return data;
  }

  async storeCommand(command: Command) {
    const { data } = await serverApi.post('/commands', command);
    return data;
  }

  async deleteCommand(commandId: string) {
    const { data } = await serverApi.delete(`/commands/${commandId}`);
    return data;
  }

  async updateCommand({
    _id,
    waiter,
    table,
    fishingType,
    products,
    total,
    isActive,
  }: UpdateCommand) {
    const { data } = await serverApi.put(`/commands/${_id}`, {
      waiter,
      table,
      fishingType,
      products,
      total,
      isActive,
    });
    return data;
  }

  async getOneCommand({ commandId }: { commandId: string }) {
    const { data } = await serverApi.get(`/commands/${commandId}`);
    return data;
  }

  async findByReservationId(reservationId: string): Promise<Command | null> {
    try {
      const { data } = await serverApi.get(`/commands/by-reservation/${reservationId}`);
      return data.command;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  }
}

export default new CommandsService();
