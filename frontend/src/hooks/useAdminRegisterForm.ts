"use client";
import { AdminRegisterInputs, adminRegisterSchema } from "@/lib/bookSchema";
import { adminRegisterService } from "@/services/adminRegisterService";
import { UseAdminRegisterFormReturn } from "@/types/adminRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const useAdminRegisterForm = (
    setRegisterSucess: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    token: string,
): UseAdminRegisterFormReturn => {
    const form = useForm<AdminRegisterInputs>({
        resolver: zodResolver(adminRegisterSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            mail: "",
            birthDate: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        control,
        watch,
    } = form;

    const isDisabled = !isValid;

    const passwordValue = watch("password");
    const router = useRouter();
    const [formKey, setFormKey] = useState<number>(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () =>
        setShowConfirmPassword((prev) => !prev);

    const onSubmit: SubmitHandler<AdminRegisterInputs> = async (data) => {
        if (!token) {
            console.error("Usuário não autenticado.");
            return;
        }
        try {
            setLoading(true);
            await adminRegisterService.registerAdmin(data, token);
            setRegisterSucess(true);
        } catch (error) {
            console.error("Erro ao registrar admin:", error);
        } finally {
            setLoading(false);
            reset();
            setFormKey((prev) => prev + 1);
        }
    };

    return {
        register,
        errors,
        handleSubmit,
        control,
        passwordValue,
        showPassword,
        showConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword,
        router,
        formKey,
        onSubmit,
        watch,
        isDisabled,
    };
};
