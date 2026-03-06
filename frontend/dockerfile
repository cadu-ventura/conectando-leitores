# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

# Instala bash e git
RUN apk add --no-cache bash git

WORKDIR /app

# Copia dependências e instala todas as dependências (incluindo dev)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

# Copia .env e código-fonte
COPY .env ./
COPY . .

# Compila o frontend (Next.js)
RUN yarn build


# Etapa 2: Imagem final
FROM node:20-alpine

WORKDIR /app

# Instala dependências e Zabbix Agent 2
RUN apk add --no-cache bash curl git supervisor zabbix-agent2

# Copia os arquivos de dependências e instala somente as de produção
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --production
RUN npm install --save --legacy-peer-deps @sentry/node @sentry/tracing

# Copia o build
COPY --from=builder /app/.next ./.next
COPY tsconfig.json ./
COPY public ./public

# Configuração do Zabbix Agent 2
RUN mkdir -p /etc/zabbix /var/run/zabbix /var/log/zabbix && \
    echo "PidFile=/var/run/zabbix/zabbix_agent2.pid" > /etc/zabbix/zabbix_agent2.conf && \
    echo "LogFile=/var/log/zabbix/zabbix_agent2.log" >> /etc/zabbix/zabbix_agent2.conf && \
    echo "Server=189.126.106.104" >> /etc/zabbix/zabbix_agent2.conf && \
    echo "ServerActive=189.126.106.104:10051" >> /etc/zabbix/zabbix_agent2.conf && \
    echo "Hostname=oraculo-frontend" >> /etc/zabbix/zabbix_agent2.conf && \
    echo "Plugins.Docker.Endpoint=unix:///var/run/docker.sock" >> /etc/zabbix/zabbix_agent2.conf && \
    chmod 755 /var/run/zabbix /var/log/zabbix

# Configuração do Supervisor
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:zabbix-agent2]" >> /etc/supervisord.conf && \
    echo "command=/usr/sbin/zabbix_agent2 -f -c /etc/zabbix/zabbix_agent2.conf" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:frontend]" >> /etc/supervisord.conf && \
    echo "command=yarn start" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf

# Expõe a porta do app e do agente
EXPOSE 3000 10050

# Inicia o Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
