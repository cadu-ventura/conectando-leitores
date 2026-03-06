import {
    SubmitHandler,
    UseFormRegister,
    FieldErrors,
    Control,
    UseFormWatch,
} from "react-hook-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AdminRegisterInputs } from "@/lib/bookSchema";

export interface UseAdminRegisterFormReturn {
    // React Hook Form
    register: UseFormRegister<AdminRegisterInputs>;
    handleSubmit: (
        callback: SubmitHandler<AdminRegisterInputs>,
    ) => (e?: React.BaseSyntheticEvent) => void;
    errors: FieldErrors<AdminRegisterInputs>;
    control: Control<AdminRegisterInputs>;
    watch: UseFormWatch<AdminRegisterInputs>;

    // Estados de exibição
    passwordValue: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    isDisabled: boolean;

    // Funções de toggle
    toggleShowPassword: () => void;
    toggleShowConfirmPassword: () => void;

    // Controle do DatePicker
    formKey: number;

    // Roteamento
    router: AppRouterInstance;

    // Funções auxiliares
    onSubmit: SubmitHandler<AdminRegisterInputs>;
}

// Props do componente AdminRegisterForm
export interface AdminRegisterFormProps {
    handleCancel: () => void;
    setRegisterSucess: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
