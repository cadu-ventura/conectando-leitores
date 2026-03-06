export const LoginRegisterValidationMessagesError = {

  REGISTER_EMAIL_NOT_VALID: 'O e-mail informado é inválido. Informe um e-mail no formato [nome@domínio.com].',
  REGISTER_EMAIL_NOT_EMPTY: 'O campo email não pode estar vazio.',

  REGISTER_NAME_NOT_EMPTY: 'O campo nome completo é obrigatório.',
  REGISTER_NAME_NOT_VALID_LENGTH: 'O campo Nome deve conter entre 2 e 50 caracteres.',
  REGISTER_NAME_NOT_VALID: 'O campo Nome aceita apenas letras, acentuação e espaços.',

  SURNAME_NOT_EMPTY: 'O campo sobrenome completo é obrigatório.',
  SURNAME_NOT_VALID_LENGTH: 'O campo Sobrenome deve conter entre 2 e 50 caracteres.',
  SURNAME_NOT_VALID: 'O campo Sobrenome aceita apenas letras, acentuação e espaços.',

  REGISTER_PASSWORD_NOT_EMPTY: 'O campo senha é obrigatório.',
  REGISTER_PASSWORD_NOT_VALID: 'A senha deve conter no mínimo 6 e no máximo 10 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número, um caractere especial e não pode conter espaços.',
  
  UPDATE_REGISTER_PASSWORD_NOT_VALID: 'Senha precisa conter: pelo menos uma letra maiúscula e minúscula, número, um caractere especial, entre 6 e 10 caracteres e não pode conter espaços.',
  UPDATE_REGISTER_CONFIRM_PASSWORD_NOT_EMPTY: 'O campo de confirmação de senha não pode estar vazio.',
  UPDATE_REGISTER_CONFIRM_PASSWORD_NOT_VALID: 'As senhas não coincidem.',

  REGISTER_ROLE_NAME_NOT_VALID: 'O campo cargo é obrigatório.',
  REGISTER_DEPARTMENT_NOT_VALID: 'O campo departamento é obrigatório.',
  REGISTER_ACCESS_PROFILE_NOT_VALID: 'O campo perfil de acesso é obrigatório.',

  REGISTER_MATRIZ_NOT_VALID: 'O campo CNPJ deve ter 14 dígitos numéricos.',
  REGISTER_MATRIZ_NOT_EMPTY: 'O campo CNPJ é obrigatório.',

  REGISTER_COST_CENTER_NAME_NOT_VALID: 'O campo nome do centro de custo de ter no mínimo 3 e no máximo 100 caracteres.',
  REGISTER_COST_CENTER_NAME_NOT_EMPTY: 'O campo nome do centro de custo é obrigatório.',

  REGISTER_STATUS_NOT_VALID: 'O campo status é obrigatório.',

  REGISTER_BIRTH_DATE_NOT_VALID: 'A data de nascimento deve estar no formato YYYY-MM-DD.',
  REGISTER_BIRTH_DATE_NOT_EMPTY: 'O campo data de nascimento é obrigatório.',

}
