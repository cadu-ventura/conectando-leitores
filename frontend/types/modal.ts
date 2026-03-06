import { User } from './user';

export interface UseModalReturn {
  confirmModal: boolean;
  setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  registerSucess: boolean;
  setRegisterSucess: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
  user: User | null;
  isAdmin: boolean | undefined;
}
