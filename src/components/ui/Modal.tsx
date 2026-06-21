import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export const Modal = ({ open, onClose, title, description, children, className, wide }: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-50 flex items-center justify-center animate-fadeIn" />
        <Dialog.Content
          className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[calc(100vh-48px)] overflow-y-auto glass-strong border border-white/10 rounded-3xl p-8 outline-none animate-bounceIn shadow-2xl ${className || ''}`}
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Dialog.Title className="font-display font-black text-2xl text-white m-0">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>
            )}
            <Dialog.Close asChild>
              <button
                className="bg-transparent border-0 cursor-pointer text-gray-400 p-2 flex hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                aria-label="Fechar"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </Dialog.Close>
          </div>
          <div className="pt-6 animate-slideUp">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export function ModalTrigger({ children }: { children: React.ReactNode }) {
  return <Dialog.Trigger asChild>{children}</Dialog.Trigger>;
}

export function ModalClose({ children }: { children: React.ReactNode }) {
  return <Dialog.Close asChild>{children}</Dialog.Close>;
}
