import { z } from "zod";

// --- Schema para Login ---
export const loginSchema = z.object({
    mail: z.string().trim().min(1, "O e-mail é obrigatório."),
    password: z.string().min(1, "A senha é obrigatória."),
});

// --- Schema Principal para Cadastro ---
export const signupSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "O campo nome é obrigatório.")
            .refine((val) => val.length >= 2 && val.length <= 50, {
                message: "O campo nome deve conter entre 2 e 50 caracteres.",
            })
            .refine((val) => /^[A-ZÀ-ÖØ-öø-ÿ]/.test(val), {
                message: "O campo nome deve iniciar com letra maiúscula.",
            })
            .refine((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(val), {
                message:
                    "O campo nome aceita apenas letras, acentuação e espaços.",
            }),

        lastName: z
            .string()
            .trim()
            .min(1, "O campo sobrenome é obrigatório.")
            .refine((val) => val.length >= 2 && val.length <= 50, {
                message:
                    "O campo sobrenome deve conter entre 2 e 50 caracteres.",
            })
            .refine((val) => /^[A-ZÀ-ÖØ-öø-ÿ]/.test(val), {
                message: "O campo sobrenome deve iniciar com letra maiúscula.",
            })
            .refine((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(val), {
                message:
                    "O campo sobrenome aceita apenas letras, acentuação e espaços.",
            }),

        birthDate: z
            .string()
            .trim()
            .min(1, "O campo data de nascimento é obrigatório.")
            .regex(
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                {
                    message: "Use o formato DD/MM/AAAA.",
                },
            )
            .refine(
                (dateStr) => {
                    const [day, month, year] = dateStr.split("/").map(Number);
                    const date = new Date(year, month - 1, day);
                    return (
                        date.getFullYear() === year &&
                        date.getMonth() === month - 1 &&
                        date.getDate() === day
                    );
                },
                { message: "A data inserida é inválida (ex: 31/02)." },
            )
            .refine(
                (dateStr) => {
                    const [day, month, year] = dateStr.split("/").map(Number);
                    const birthDate = new Date(year, month - 1, day);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (
                        m < 0 ||
                        (m === 0 && today.getDate() < birthDate.getDate())
                    ) {
                        age--;
                    }
                    return age >= 18;
                },
                { message: "Você deve ser maior de 18 anos." },
            ),

        mail: z
            .string()
            .trim()
            .min(1, "O campo e-mail é obrigatório.")
            .max(50, {
                message: "O e-mail não pode ter mais de 50 caracteres.",
            })
            .email({ message: "O e-mail inserido é inválido." }),

        password: z.string().min(1, "O campo senha é obrigatório."),

        confirmPassword: z
            .string()
            .min(1, "O campo confirmação de senha é obrigatório."),

        acceptTerms: z.boolean().refine((val) => val === true, {
            message: "Você deve aceitar os termos para continuar.",
        }),

        website: z.string().max(0).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem.",
        path: ["confirmPassword"],
    });

// --- Schema para Esqueceu a Senha ---
export const forgotPasswordSchema = z.object({
    mail: z
        .string()
        .trim()
        .min(1, "O e-mail é obrigatório.")
        .email({ message: "O e-mail informado é inválido." }),
});



// --- Tipos Inferidos ---
export type LoginFormInputs = z.infer<typeof loginSchema>;
export type SignupFormInputs = z.infer<typeof signupSchema>;
export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
