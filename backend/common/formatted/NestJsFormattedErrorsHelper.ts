import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

// Define a estrutura do tipo objeto que possui chaves (nomes de propriedades) do tipo string e valores do tipo any.
type IErrorMessage = Record<string, any>;

// Função que formata os erros de validação em um objeto com mensagens de erro.
const formatErrorsHelper = (errors: ValidationError[]): IErrorMessage => {

  // Inicializa um objeto vazio para armazenar as mensagens de erro formatadas.
  const result: IErrorMessage = {};

  // Itera sobre cada erro de validação no array "errors".
  errors.map((item) => {
    // Extrai as propriedades relevantes do erro.
    const { property, constraints, children } = item;

    /*

		Formato de cada erro do array  ValidatiionError

			ValidationError {
				target: ContactUsDto {
					fullName: 'a',
					companyName: '',
					mail: 'qa.Coderstest.com',
					telephone: '5511999999',
					message: 'Formação de QAs',
					serviceTags: []
				},
				value: '',
				property: 'companyName',
				children: [],
				constraints: { isNotEmpty: "O campo 'Empresa' é de preenchimento obrigatório." }
		}
		*/

    // Verifica se há apenas uma mensagem de erro para a propriedade.
    if (constraints) {
      // Obtém as keys que são chaves (nomes de propriedades) das mensagens de erro ['isNotEmpty'].
      const constraintKeys = Object.keys(constraints);

      // Verifica se há apenas uma mensagem de erro para a propriedade.
      // Obs: isso pode ser definido dentro da função new ValidationPipe logo abaixo como: 'stopAtFirstError: true'.
      // Interrompe a validação ao encontrar o primeiro erro da propriedade.

      if (constraintKeys.length === 1) {

        // Armazena a mensagem de erro como uma string.
        result[property] = constraints[constraintKeys[0]]; // Armazena a mensagem de erro como uma string.

      } else {

        // Mantém as mensagens de erro como um array se houver várias.
        result[property] = Object.values(constraints);
      }
    }

    // Verifica se há erros aninhados (nested) e se ele é um array.
    if (Array.isArray(children) && children.length > 0) {
			
      // Se o array existe ele chama o callback de formatação de erros novamente.
      result[property] = formatErrorsHelper(children);
    }
  });

  //Retorna o objeto "result" contendo as mensagens de erro formatadas.
  return result;
};

export const formatErrorPipe = new ValidationPipe({

  // Função que extrai os erros do método exceptionFactory.
  exceptionFactory: (errors: ValidationError[]) => {

    // Formata os erros usando a função formatErrorsHelper.
    const validationResult = formatErrorsHelper(errors);

    //  Lança uma BadRequestException contendo os erros formatados.
    return new BadRequestException( {validationResult} );
  },
  stopAtFirstError: true,
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});

//Tambémm tem a possibilidade de tirar o objeto do validateReuslt

// return new BadRequestException(validationResult);