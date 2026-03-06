# Otimizações de Memória - Oracle Backend

Este documento descreve as otimizações implementadas para resolver problemas de memória em servidores com limitação de RAM (1GB).

## Problema Identificado

O erro `JavaScript heap out of memory` estava ocorrendo durante a execução do script `seedAdmin.ts` como `prestart`, esgotando a memória heap disponível do Node.js.

## Soluções Implementadas

### 1. Limitação de Memória Heap do Node.js

**Arquivo:** `package.json`

- Configurado `--max-old-space-size=512` para scripts de seed
- Configurado `--max-old-space-size=768` para a aplicação principal
- Adicionado `--optimize-for-size` para otimização de tamanho
- Adicionado `--expose-gc` para controle manual do garbage collection
- Configurado `-r ts-node/register -r tsconfig-paths/register` para compilação TypeScript

### 2. Otimização do Script seedAdmin.ts

**Arquivo:** `src/seed/seedAdmin.ts`

- Configurações otimizadas de conexão MongoDB
- Uso de `.lean()` para queries mais eficientes
- Redução do salt do bcrypt de 10 para 8
- Remoção do spread operator para economizar memória
- Força garbage collection após operações
- `process.exit(0)` para liberar toda a memória ao final

### 3. Configurações de Garbage Collection

**Arquivo:** `src/config/memory.config.ts`

- Configurações centralizadas para otimização de memória
- Garbage collection automático em produção
- Configurações otimizadas do Mongoose
- Logging reduzido em produção

### 4. Otimização do NestJS

**Arquivos:** `src/main.ts`, `src/app.module.ts`

- Logging reduzido em produção (apenas error e warn)
- Configurações otimizadas do Mongoose
- Buffer de logs habilitado
- Garbage collection automático

### 5. Script de Inicialização Otimizado

**Arquivo:** `scripts/start-optimized.sh`

- Script bash para inicialização com otimizações
- Garbage collection antes da inicialização
- Execução sequencial otimizada

## Como Usar

### Para Desenvolvimento
```bash
npm run start:dev
```

### Para Produção (Recomendado)
```bash
npm run start:optimized
```

### Para Produção (Padrão)
```bash
npm run start:prod
```

## Configurações de Memória

### Scripts de Seed
- Limite: 512MB
- Otimização: `--optimize-for-size --expose-gc`

### Aplicação Principal
- Limite: 768MB
- Otimização: `--optimize-for-size --expose-gc`

### Total Disponível
- Servidor: 1GB RAM
- Node.js Seed: 512MB
- Node.js App: 768MB
- Sistema: ~256MB

## Monitoramento

Para monitorar o uso de memória em produção:

```bash
# Verificar uso de memória do processo
ps aux | grep node

# Monitorar em tempo real
top -p $(pgrep node)
```

## Configurações do MongoDB

As seguintes configurações foram aplicadas para otimizar o uso de memória:

```typescript
{
  maxPoolSize: 5, // Limita conexões simultâneas
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false, // Desabilita buffering de comandos
}
```

## Garbage Collection

- Automático a cada 30 segundos em produção
- Manual após operações críticas
- Forçado antes da inicialização

## Logs

Em produção, apenas logs de `error` e `warn` são mantidos para reduzir o uso de memória e I/O.

## Recomendações Adicionais

1. **Monitoramento:** Implementar monitoramento de memória em produção
2. **Scaling:** Considerar scaling horizontal se necessário
3. **Cache:** Implementar cache Redis para reduzir queries ao MongoDB
4. **Cleanup:** Implementar limpeza periódica de dados antigos

## Troubleshooting

Se ainda houver problemas de memória:

1. Verificar se as variáveis de ambiente estão corretas
2. Confirmar que o script otimizado está sendo usado
3. Verificar logs para identificar vazamentos de memória
4. Considerar reduzir ainda mais os limites de heap se necessário
