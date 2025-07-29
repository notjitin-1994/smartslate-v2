import React, { createContext, useContext, useState, ReactNode } from 'react';
import ContactModal from '@/components/modals/ContactModal';
import LoginModal from '@/components/modals/LoginModal';
import { FormType } from '@/lib/formUtils';

type ModalType = 'contact' | 'login' | 'none';

interface ModalContextType {
  openModal: (modal: ModalType, form?: FormType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [formType, setFormType] = useState<FormType>('standard');

  const openModal = (modal: ModalType, form: FormType = 'standard') => {
    setActiveModal(modal);
    setFormType(form);
  };

  const closeModal = () => {
    setActiveModal('none');
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ContactModal
        isOpen={activeModal === 'contact'}
        onClose={closeModal}
        initialFormType={formType}
      />
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
};