import { AdminRegisterInputs } from "@/lib/bookSchema";

export const adminRegisterService = {
  registerAdmin: async (data: AdminRegisterInputs, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/register`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Erro ao enviar dados para o backend');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro no registerService:', error);
      throw error;
    }
  },
};