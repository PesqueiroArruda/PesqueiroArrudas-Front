import { Loader2 } from 'lucide-react';

import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import type { Item } from '../../types/Item';

interface Props {
  isEditModalOpen: boolean;
  onClose: any;
  title: any;
  itemInfos: Item;
  handleSubmit: any;
  handleChangeUnitPrice: any;
  isSubmitting: boolean;
  handleMenuImageChange: any;
  isUploadingImage: boolean;
  localPreviewUrl: string;
}

const categories = [
  'Pesca',
  'Peixes',
  'Pratos',
  'Bebidas',
  'Bebidas-Cozinha',
  'Doses',
  'Sobremesas',
  'Porções',
  'Misturas Congeladas',
];

const selectClassName =
  'h-10 w-full rounded-(--radius) border border-input bg-card px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const EditModalLayout = ({
  isEditModalOpen,
  onClose,
  title,
  itemInfos,
  handleSubmit,
  handleChangeUnitPrice,
  isSubmitting,
  handleMenuImageChange,
  isUploadingImage,
  localPreviewUrl,
}: Props) => {
  const currentImageUrl =
    localPreviewUrl ||
    (itemInfos.menu?.imageKey
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${itemInfos.menu.imageKey}`
      : '');

  return (
    <Modal isOpen={isEditModalOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Tabs defaultValue="produto">
          <TabsList>
            <TabsTrigger value="produto">Produto</TabsTrigger>
            <TabsTrigger value="cardapio">Cardápio Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="produto" className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-navy">Nome</span>
            <Input placeholder="Nome" value={itemInfos.name} onChange={(e) => itemInfos.setName(e.target.value)} />

            <span className="text-sm font-semibold text-navy">Categoria</span>
            <select
              value={itemInfos.category || ''}
              onChange={(e) => itemInfos.setCategory(e.target.value)}
              className={selectClassName}
            >
              {categories.map((categorie) => (
                <option key={`edit-categorie-${categorie}`}>{categorie}</option>
              ))}
            </select>

            <span className="text-sm font-semibold text-navy">Preço da unidade</span>
            <Input placeholder="Preço da Unidade" value={itemInfos.unitPrice || ''} onChange={(e) => handleChangeUnitPrice(e)} />

            <span className="text-sm font-semibold text-navy">Quantidade</span>
            <Input
              type="number"
              placeholder="Quantidade"
              value={itemInfos.amount || ''}
              onChange={(e) => itemInfos.setAmount(Number(e.target.value))}
            />
          </TabsContent>

          <TabsContent value="cardapio" className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                id="menu-enabled"
                type="checkbox"
                checked={!!itemInfos.menu?.enabled}
                onChange={(e) =>
                  itemInfos.setMenu((prev) => ({ ...prev, enabled: e.target.checked }))
                }
              />
              <Label htmlFor="menu-enabled">Aparece no cardápio digital</Label>
            </div>

            <span className="text-sm font-semibold text-navy">Categoria do cardápio</span>
            <Input
              placeholder="Ex.: Hambúrgueres, Bebidas"
              value={itemInfos.menu?.category || ''}
              onChange={(e) => itemInfos.setMenu((prev) => ({ ...prev, category: e.target.value }))}
            />

            <span className="text-sm font-semibold text-navy">Descrição do cardápio</span>
            <Input
              placeholder="Descrição pro cliente final"
              value={itemInfos.menu?.description || ''}
              onChange={(e) => itemInfos.setMenu((prev) => ({ ...prev, description: e.target.value }))}
            />

            <span className="text-sm font-semibold text-navy">Ordem de exibição</span>
            <Input
              type="number"
              placeholder="0"
              value={itemInfos.menu?.order ?? 0}
              onChange={(e) => itemInfos.setMenu((prev) => ({ ...prev, order: Number(e.target.value) }))}
            />

            <span className="text-sm font-semibold text-navy">Foto do cardápio</span>
            {currentImageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={currentImageUrl} alt="Foto atual do cardápio" className="h-24 w-24 rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploadingImage}
              onChange={handleMenuImageChange}
            />
            {isUploadingImage && (
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando imagem...
              </span>
            )}
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Atualizando' : 'Atualizar Item'}
        </Button>
      </form>
    </Modal>
  );
};
