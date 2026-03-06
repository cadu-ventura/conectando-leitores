# Build stage
FROM node:22-slim as builder

WORKDIR /app

# Copia dependências
COPY backend/package.json ./
COPY backend/yarn.lock ./

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala as dependências do projeto
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY backend/src ./src
COPY backend/common ./common
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./
COPY backend/nest-cli.json ./
COPY backend/build.sh ./

# Build do projeto (ignora erros de compilação)
RUN chmod +x ./build.sh && ./build.sh

# Production stage
FROM node:22-slim

WORKDIR /app

# Copia dependências
COPY backend/package.json ./
COPY backend/yarn.lock ./

# Instala dependências do sistema necessárias (mínimas)
RUN apt-get update && apt-get install -y \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Instala apenas dependências de produção
RUN yarn install --frozen-lockfile --production

# Copia o build da stage anterior
COPY --from=builder /app/dist ./dist

# Define ambiente
ENV NODE_ENV=production

# Expõe a porta
EXPOSE 21165

# Inicia a aplicação
CMD ["node", "dist/src/main"]
