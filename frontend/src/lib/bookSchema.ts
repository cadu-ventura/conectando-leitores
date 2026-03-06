import { z } from "zod";

// --- Schema para Registro de Livro pelo Usuário ---
export const bookRegisterUserSchema = z.object({
    title: z
        .string()
        .min(1, "O campo Título do Livro é obrigatório.")
        .max(50, "O campo Título do Livro deve conter até 50 caracteres.")
        .refine((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\S]+$/.test(val), {
            message:
                "O campo Título do Livro aceita letras, espaços, acentuação, caracteres especiais e números.",
        }),
    author: z
        .string()
        .min(1, "O campo Autor é obrigatório.")
        .max(50, "O campo Autor deve conter até 50 caracteres.")
        .refine((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(val), {
            message:
                "O campo Autor aceita apenas letras, acentuação e espaços.",
        }),
    category: z.string().min(1, "O campo categoria é obrigatório."),
    description: z
        .string()
        .min(1, "O campo descrição é obrigatório.")
        .max(800, "O campo descrição deve conter até 800 caracteres."),
    book: z.instanceof(File, { message: "O campo Upload do arquivo do livro é obrigatório." }),
    cover: z.instanceof(File).optional(),
});

export const adminRegisterSchema = z
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

        password: z
            .string()
            .min(6, "A senha deve ter no mínimo 6 caracteres")
            .max(10, "A senha deve ter no máximo 10 caracteres")
            .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula")
            .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula")
            .regex(/\d/, "A senha deve ter pelo menos um número")
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                "A senha deve ter pelo menos um caractere especial",
            )
            .refine((val) => !/\s/.test(val), {
                message: "A senha não pode conter espaços",
            }),

        confirmPassword: z
            .string()
            .min(1, "O campo confirmação de senha é obrigatório."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem.",
        path: ["confirmPassword"],
    });

//--- Schema de Rejeitar Obra ---

export const RejectingBookSchema = z.object({
    justification: z.string().min(1, "O campo justificativa é obrigatório."),
});

export const RejectingUserSchema = z.object({
    justification: z.string().min(1, "O campo justificativa é obrigatório."),
});
export type BookRegisterUserInputs = z.infer<typeof bookRegisterUserSchema>;
export type AdminRegisterInputs = z.infer<typeof adminRegisterSchema>;
export type RejectingBookInput = z.infer<typeof RejectingBookSchema>;
export type RejectingUserInput = z.infer<typeof RejectingUserSchema>;