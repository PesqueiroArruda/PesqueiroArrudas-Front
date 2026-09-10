import { BadgeCheck, MoreVertical, PackageCheck } from 'lucide-react';

import { Modal } from 'components/Modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Order as OrderProps } from 'types/Order';
import { OrderProduct } from 'types/OrderProduct';

const productColumns = [
  { text: 'Nome', prop: 'name' },
  { text: 'Quantidade', prop: 'amount' },
  { text: '', prop: '*' },
];

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  kitchenOrderSended: OrderProps;
  handleSelectAmountToShip: (product: OrderProduct) => void;
  productsToShipNow: OrderProduct[];
}

export const OrderActionsLayout = ({
  isModalOpen,
  handleCloseModal,
  kitchenOrderSended,
  handleSelectAmountToShip,
  productsToShipNow,
}: Props) => (
  <Modal title="" isOpen={isModalOpen} onClose={handleCloseModal}>
    <div className="flex flex-col gap-3">
      <p className="text-base font-bold text-navy sm:text-lg">Produtos enviados à cozinha</p>

      <Table>
        <TableHeader>
          <TableRow>
            {productColumns.map((column) => (
              <TableHead key={`kitchen-order-product-column-${column.prop}`}>{column.text}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {kitchenOrderSended?.products?.map(({ _id, name, amount, isMade }) => (
            <TableRow key={`${kitchenOrderSended?._id}${_id}`}>
              <TableCell>{name}</TableCell>
              <TableCell>{amount}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {isMade && (
                    <span className="flex items-center gap-1.5 rounded-(--radius) bg-success px-2 py-1 text-sm font-bold text-white">
                      <BadgeCheck className="h-4 w-4" />
                      Feito
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-(--radius) p-1 text-navy hover:bg-secondary">
                      <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleSelectAmountToShip({ _id, name, amount, isMade })}>
                        <PackageCheck className="h-4 w-4" />
                        Entregar agora
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {productsToShipNow.length > 0 && (
      <div className="mt-3 flex flex-col gap-2">
        <p className="font-bold text-navy">Produtos para entregar agora</p>
        {productsToShipNow.map(({ _id, name, amount }) => (
          <div key={`list-ship-now-${_id}`} className="rounded-(--radius) bg-secondary p-2 text-center shadow-sm">
            <span className="font-bold text-navy">
              {name}, {amount}
            </span>
          </div>
        ))}
      </div>
    )}
  </Modal>
);
