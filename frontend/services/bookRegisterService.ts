import { BookRegisterUserInputs } from "@/lib/bookSchema";

export const bookRegisterService = {
  registerBook: async (data: BookRegisterUserInputs, token: string) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR');

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('releaseDate', formattedDate);
      if (data.book) formData.append('book', data.book);
      if (data.cover) formData.append('cover', data.cover);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/book/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Não foi possível concluir o upload. Tente novamente.';
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no registerBook:', error);
      throw error;
    }
  },
};
