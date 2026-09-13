import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { ImagePlus, Loader2, Pencil, X } from 'lucide-react';

import { cn } from 'lib/utils';

interface Props {
  imageUrl: string;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

export const MenuImageUpload = ({
  imageUrl,
  isUploading,
  onFileSelected,
  onRemove,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function openFilePicker() {
    if (!isUploading) inputRef.current?.click();
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = '';
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div className="flex items-start gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={(e) => e.key === 'Enter' && openFilePicker()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={cn(
          'group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-input bg-card transition-colors',
          isDraggingOver && 'border-ring bg-secondary',
          isUploading && 'cursor-not-allowed opacity-70'
        )}
      >
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Foto do cardápio"
              className="h-full w-full object-cover"
            />
            {!isUploading && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Pencil className="h-4 w-4 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 px-2 text-center">
            <ImagePlus className="h-5 w-5 text-text-muted" />
            <span className="text-[10px] leading-tight text-text-muted">
              Clique ou arraste
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </div>

      {imageUrl && !isUploading && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover foto do cardápio"
          className="flex h-6 w-6 items-center justify-center rounded-full text-text-muted hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
};
