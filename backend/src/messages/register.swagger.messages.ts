
export const LoginRegisterMessagesSwagger = {
  API_RESPONSE_SEARCH: 'Usuário específico.',

  LIST_REGISTERS: 'Mostrar todos os registros.',

  DESCRIPTION_CREATE_USER: 'Essa funcionalidade cria um usuário com os campos específicos abaixo.',
}

export const LoginRegisterDescriptionSwagger = {

  DESCRIPTION_RESPONSE_GET_FILTER: 'Filtra e faz a paginação de registros relacionados a esta funcionalidade pelos campos:'
    + '\n\n- " <strong>page</strong > " (númreo de páginas)'
    + '\n\n- " <strong>limit</strong> " (númreo de limite de registros por página)'
    + '\n\n- " <strong>roleName</strong> " (nome do cargo)'
    + '\n\n- " <strong>departmentName</strong> " (nome do departamento)'
    + '\n\n- " <strong>profileName</strong> " (nome do perfil de acesso)'
    + '\n\n- " <strong>matriz</strong> " (CNPJ da empresa)'
    + '\n\n- " <strong>costCenterName</strong> " (nome do centro de custo)'
    + '\n\n- " <strong>status</strong> " (status )'
    + '\n\n- " <strong>createdAt</strong> " (data de criação)'
    + '\n\n- " <strong>updatedAt</strong> " (data de atualização)',

  /* #################################################################################################### */

  DESCRIPTION_CREATE_USER: 'Essa funcionalidade cria um usuário com os campos específicos abaixo.'
    + '\n\n- " <strong>firstName</strong> " (primeiro nome)'
    + '\n\n- " <strong>lastName</strong> " (sobrenome)'
    + '\n\n- " <strong>mail</strong> " (e-mail do usuário)'
    + '\n\n- " <strong>password</strong> " (senha do usuário - 6-10 caracteres, maiúscula, minúscula, número e especial)'
    + '\n\n- " <strong>confirmPassword</strong> " (senha do usuário - 6-10 caracteres, maiúscula, minúscula, número e especial)'
    + '\n\n- " <strong>birthDate</strong> " (data de aniversario)',

  /* #################################################################################################### */

  DESCRIPTION_RESPONSE_UPDATE_PASSWORD: 'Atualiza a senha do usuário usando os campos' 
  + '<strong>password</strong> e <strong>comfirmPassword</strong>.' 
  + '\n\n- " <strong>password</strong> " (senha do usuário)'
  + '\n\n- " <strong>confirmPassword</strong> " (senha de confirmação)',

  /* #################################################################################################### */

  DESCRIPTION_RESPONSE_DELETE_USER: 'Deleta um usuário específico.',

  DESCRIPTION_RESPONSE_SEARCH: 'Faz uma busca específica por <strong>nome</strong> pelos campos " <strong>firstName</strong> " e " <strong>lastName</strong> ".',
};
