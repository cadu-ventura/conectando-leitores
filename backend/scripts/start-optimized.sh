#!/bin/bash

# Script otimizado para inicialização com limitação de memória
# Este script é usado em produção para maximizar o uso eficiente da RAM

echo "=== Iniciando aplicação com otimizações de memória ==="

# Configurações de memória para o Node.js
export NODE_OPTIONS="--max-old-space-size=768 --optimize-for-size --expose-gc"

# Configurações adicionais para produção
export NODE_ENV=production

# Força garbage collection antes de iniciar
node --expose-gc -e "global.gc(); console.log('GC executado antes da inicialização');"

echo "=== Executando seed otimizado ==="
# Executa o seed com limitações de memória
node --max-old-space-size=512 --optimize-for-size --expose-gc -r ts-node/register -r tsconfig-paths/register src/seed/seedAdmin.ts

echo "=== Iniciando aplicação principal ==="
# Inicia a aplicação principal
node --max-old-space-size=768 --optimize-for-size --expose-gc dist/main

echo "=== Aplicação iniciada com sucesso ==="
