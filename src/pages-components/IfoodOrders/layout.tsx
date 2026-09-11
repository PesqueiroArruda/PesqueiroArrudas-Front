import { DateTime } from 'luxon';
import {
  AlertTriangle,
  Check,
  Inbox,
  Loader2,
  MapPin,
  ShoppingBag,
  Ticket,
  User,
  Wallet,
  X,
} from 'lucide-react';

import { AppShell } from 'components/AppShell';
import { Button } from 'components/ui/button';
import { Modal } from 'components/Modal';
import { IfoodCancellationReason, IfoodOrder } from 'types/IfoodOrder';
import { Product } from 'types/Product';
import { parseToBRL } from 'utils/parseToBRL';

interface ItemSelection {
  productId: string | null;
  saveMapping: boolean;
}

interface Props {
  ifoodOrders: IfoodOrder[];
  products: Product[];
  selections: Record<string, Record<string, ItemSelection>>;
  isLoading: boolean;
  processingId: string | null;
  handleAccept: (id: string) => void;
  handleOpenRejectModal: (id: string) => void;
  handleSelectProduct: (orderId: string, itemId: string, productId: string) => void;
  handleToggleSaveMapping: (orderId: string, itemId: string, saveMapping: boolean) => void;
  handleAcceptCancellation: (id: string) => void;
  handleDenyCancellation: (id: string) => void;
  handleGoToCommand: (commandId: string) => void;
  rejectingOrderId: string | null;
  cancellationReasons: IfoodCancellationReason[];
  selectedReasonIndex: number | null;
  isLoadingReasons: boolean;
  handleSelectReason: (index: number) => void;
  handleConfirmReject: () => void;
  handleCloseRejectModal: () => void;
}

const selectClassName =
  'h-9 w-full rounded-(--radius) border border-input bg-card px-2 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CREDIT: 'Crédito',
  DEBIT: 'Débito',
  MEAL_VOUCHER: 'Vale-refeição',
  FOOD_VOUCHER: 'Vale-alimentação',
  CASH: 'Dinheiro',
  PIX: 'Pix',
};

export const IfoodOrdersLayout = ({
  ifoodOrders,
  products,
  selections,
  isLoading,
  processingId,
  handleAccept,
  handleOpenRejectModal,
  handleSelectProduct,
  handleToggleSaveMapping,
  handleAcceptCancellation,
  handleDenyCancellation,
  handleGoToCommand,
  rejectingOrderId,
  cancellationReasons,
  selectedReasonIndex,
  isLoadingReasons,
  handleSelectReason,
  handleConfirmReject,
  handleCloseRejectModal,
}: Props) => (
  <AppShell>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <ShoppingBag className="h-6 w-6 text-navy" />
        <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
          Pedidos iFood
        </h1>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      )}

      {!isLoading && ifoodOrders.length === 0 && (
        <div className="mt-2 flex items-center justify-center gap-2 rounded-card bg-secondary p-4 shadow-sm">
          <Inbox className="h-6 w-6 text-navy" />
          <span className="text-center font-heading text-lg font-extrabold text-navy sm:text-xl">
            Nenhum pedido do iFood pendente
          </span>
        </div>
      )}

      {!isLoading && ifoodOrders.length > 0 && (
        <div className="flex flex-col gap-4">
          {ifoodOrders.map((order) => {
            const payload = order.rawPayload;
            const createdAtFormatted = order.createdAt
              ? DateTime.fromISO(order.createdAt, { zone: 'pt-BR', setZone: true })
                  .setLocale('pt-BR')
                  .toLocaleString(DateTime.DATETIME_MED)
              : '';
            const isProcessing = processingId === order._id;
            const orderSelections = selections[order._id] || {};
            const address = payload?.delivery?.deliveryAddress;
            const isCancellationRequested = order.status === 'cancellation_requested';

            if (isCancellationRequested) {
              return (
                <div
                  key={order._id}
                  className="flex flex-col gap-3 rounded-card border border-destructive bg-destructive/10 p-3 sm:p-4"
                >
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span className="text-base font-bold sm:text-lg">
                      Cancelamento solicitado — Pedido #{payload?.displayId || order.ifoodOrderId}
                    </span>
                  </div>
                  <p className="text-sm text-navy">
                    O cliente ou o iFood pediram o cancelamento deste pedido. Aceite se ainda não começou o
                    preparo, ou negue se o pedido já está sendo feito.
                  </p>
                  {order.commandId && (
                    <button
                      type="button"
                      onClick={() => handleGoToCommand(order.commandId as string)}
                      className="w-fit text-sm font-semibold text-navy underline"
                    >
                      Ver comanda vinculada
                    </button>
                  )}
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button
                      variant="secondary"
                      disabled={isProcessing}
                      onClick={() => handleDenyCancellation(order._id)}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      Negar cancelamento
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={isProcessing}
                      onClick={() => handleAcceptCancellation(order._id)}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Aceitar cancelamento
                    </Button>
                  </div>
                </div>
              );
            }

            const paymentMethods = payload?.payments?.methods || [];
            const benefits = payload?.benefits || [];

            return (
              <div
                key={order._id}
                className="flex flex-col gap-3 rounded-card border border-destructive/40 bg-destructive/10 p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-semibold text-navy sm:text-lg">
                    Pedido iFood: <span className="font-bold">#{payload?.displayId || order.ifoodOrderId}</span>
                  </span>
                  <span className="text-sm text-navy">
                    Recebido: <span className="font-semibold">{createdAtFormatted}</span>
                  </span>
                </div>

                {payload?.customer && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-navy">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">{payload.customer.name}</span>
                    {payload.customer.phone?.number && <span>· {payload.customer.phone.number}</span>}
                    {payload.customer.documentNumber && (
                      <span>· CPF/CNPJ: {payload.customer.documentNumber}</span>
                    )}
                  </div>
                )}

                {address?.formattedAddress && (
                  <div className="flex items-start gap-2 text-sm text-navy">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {address.formattedAddress}
                      {address.neighborhood ? ` — ${address.neighborhood}` : ''}
                      {address.complement ? ` (${address.complement})` : ''}
                    </span>
                  </div>
                )}

                {payload?.delivery?.observations && (
                  <div className="rounded-(--radius) bg-card px-2.5 py-1.5 text-sm font-semibold text-navy">
                    Observação da entrega: {payload.delivery.observations}
                  </div>
                )}

                {paymentMethods.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 text-sm text-navy">
                    <Wallet className="h-4 w-4 shrink-0" />
                    {paymentMethods.map((payment) => (
                      <span key={`${order._id}-payment-${payment.method}-${payment.value}`}>
                        {PAYMENT_METHOD_LABEL[payment.method] || payment.method}
                        {payment.card?.brand ? ` (${payment.card.brand})` : ''}
                        {payment.cash?.changeFor
                          ? ` — Troco para ${parseToBRL(payment.cash.changeFor)}`
                          : ''}
                      </span>
                    ))}
                  </div>
                )}

                {benefits.length > 0 && (
                  <div className="flex flex-col gap-1 text-sm text-navy">
                    {benefits.map((benefit) => (
                      <div
                        key={`${order._id}-benefit-${benefit.value}-${benefit.sponsorshipValues?.map((s) => s.name).join('-')}`}
                        className="flex items-center gap-2"
                      >
                        <Ticket className="h-4 w-4 shrink-0" />
                        <span>
                          Cupom: {parseToBRL(benefit.value)}
                          {benefit.sponsorshipValues && benefit.sponsorshipValues.length > 0
                            ? ` (pago por: ${benefit.sponsorshipValues.map((s) => s.name).join(', ')})`
                            : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2 rounded-(--radius) border border-border bg-card p-3">
                  {payload?.items?.map((item) => {
                    const selection = orderSelections[item.id];
                    return (
                      <div key={item.id} className="flex flex-col gap-1.5 border-b border-border pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-navy">
                            {item.quantity}x {item.name}
                          </p>
                          <p className="text-xs text-text-muted">{parseToBRL(item.totalPrice)}</p>
                          {item.observations && (
                            <p className="text-xs font-semibold text-destructive">Obs: {item.observations}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 sm:w-64">
                          <select
                            value={selection?.productId || ''}
                            onChange={(e) => handleSelectProduct(order._id, item.id, e.target.value)}
                            className={selectClassName}
                          >
                            <option value="">Sem produto vinculado</option>
                            {products.map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <label
                          htmlFor={`ifood-remember-${order._id}-${item.id}`}
                          className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-navy"
                        >
                          <input
                            id={`ifood-remember-${order._id}-${item.id}`}
                            type="checkbox"
                            checked={selection?.saveMapping ?? true}
                            onChange={(e) => handleToggleSaveMapping(order._id, item.id, e.target.checked)}
                            className="h-3.5 w-3.5 rounded border-border accent-gold"
                          />
                          Lembrar
                        </label>
                      </div>
                    );
                  })}
                </div>

                {payload?.total && (
                  <div className="flex flex-wrap justify-end gap-3 text-sm text-navy">
                    <span>Subtotal: {parseToBRL(payload.total.subTotal)}</span>
                    {payload.total.deliveryFee > 0 && <span>Entrega: {parseToBRL(payload.total.deliveryFee)}</span>}
                    {payload.total.benefits > 0 && <span>Desconto: -{parseToBRL(payload.total.benefits)}</span>}
                    <span className="font-bold">Total: {parseToBRL(payload.total.orderAmount)}</span>
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  <Button
                    variant="destructive"
                    disabled={isProcessing}
                    onClick={() => handleOpenRejectModal(order._id)}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Recusar
                  </Button>
                  <Button disabled={isProcessing} onClick={() => handleAccept(order._id)}>
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Aceitar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    <Modal
      title="Motivo da recusa"
      isOpen={!!rejectingOrderId}
      onClose={handleCloseRejectModal}
    >
      <div className="flex flex-col gap-3">
        {isLoadingReasons && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        )}

        {!isLoadingReasons && cancellationReasons.length === 0 && (
          <p className="text-sm text-navy">Nenhum motivo disponível no momento.</p>
        )}

        {!isLoadingReasons && cancellationReasons.length > 0 && (
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            {cancellationReasons.map((reason, index) => (
              <label
                key={reason.cancellationCode || reason.code || index}
                htmlFor={`cancellation-reason-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius) border border-border bg-card px-3 py-2 text-sm font-semibold text-navy"
              >
                <input
                  id={`cancellation-reason-${index}`}
                  type="radio"
                  name="cancellation-reason"
                  checked={selectedReasonIndex === index}
                  onChange={() => handleSelectReason(index)}
                  className="h-3.5 w-3.5 accent-gold"
                />
                {reason.description}
              </label>
            ))}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <Button variant="secondary" onClick={handleCloseRejectModal}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={selectedReasonIndex === null}
            onClick={handleConfirmReject}
          >
            Confirmar recusa
          </Button>
        </div>
      </div>
    </Modal>
  </AppShell>
);
