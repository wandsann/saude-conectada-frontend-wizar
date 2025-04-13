#!/bin/bash

# Configurações e credenciais
VPS_IP="69.62.98.30"
VPS_USER="root"
VPS_PASS="Jp13049//@@@@"
TELEGRAM_TOKEN="6889063604:AAGxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
OPENAI_API_KEY="sk-XXXXXXXXXXXXXXXXXXXXXXXX"

# Habilita modo de debug e saída de erro em caso de falha
set -e
set -o pipefail

# Função para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

BOT_DIR="/opt/telegrambot"
BACKUP_DIR="/opt/telegrambot_backup_$(date +%Y%m%d_%H%M%S)"

# Função para executar comandos SSH com verificação de erro
execute_ssh() {
    local cmd="$1"
    local error_msg="$2"
    
    if ! sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "$cmd"; then
        log "ERRO: $error_msg"
        exit 1
    fi
}

# Verifica se o diretório já existe e faz backup
log "Verificando diretório existente..."
execute_ssh "if [ -d $BOT_DIR ]; then mv $BOT_DIR $BACKUP_DIR; fi" "Falha ao fazer backup do diretório existente"

# Cria diretório do bot
log "Criando diretório do bot..."
execute_ssh "mkdir -p $BOT_DIR" "Falha ao criar diretório"

# Copia os arquivos para o servidor
log "Copiando arquivos para o servidor..."
sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no main.py requirements.txt $VPS_USER@$VPS_IP:$BOT_DIR/

# Instala dependências no servidor
log "Atualizando sistema e instalando dependências..."
execute_ssh "apt-get update && apt-get install -y python3-pip redis-server" "Falha ao instalar dependências do sistema"

log "Instalando dependências Python..."
execute_ssh "cd $BOT_DIR && pip3 install -r requirements.txt" "Falha ao instalar dependências Python"

# Cria arquivo .env
log "Configurando variáveis de ambiente..."
execute_ssh "cat > $BOT_DIR/.env << EOL
TELEGRAM_TOKEN=$TELEGRAM_TOKEN
OPENAI_API_KEY=$OPENAI_API_KEY
EOL" "Falha ao criar arquivo .env"

# Configura e inicia Redis
log "Configurando Redis..."
execute_ssh "systemctl start redis-server && systemctl enable redis-server" "Falha ao iniciar Redis"

# Cria serviço systemd
log "Configurando serviço systemd..."
execute_ssh "cat > /etc/systemd/system/telegrambot.service << EOL
[Unit]
Description=Telegram Bot Service
After=network.target redis-server.service

[Service]
Type=simple
User=root
WorkingDirectory=$BOT_DIR
ExecStart=/usr/bin/python3 $BOT_DIR/main.py
Restart=always
RestartSec=10
StandardOutput=append:/var/log/telegrambot.log
StandardError=append:/var/log/telegrambot.error.log

[Install]
WantedBy=multi-user.target
EOL" "Falha ao criar arquivo de serviço"

# Recarrega systemd e inicia o serviço
log "Iniciando serviço..."
execute_ssh "systemctl daemon-reload && systemctl start telegrambot && systemctl enable telegrambot" "Falha ao iniciar serviço"

# Verifica status do serviço
log "Verificando status do serviço..."
execute_ssh "systemctl status telegrambot" "Falha ao verificar status do serviço"

log "Configuração concluída com sucesso!"
log "Logs do bot disponíveis em:"
log "  - /var/log/telegrambot.log"
log "  - /var/log/telegrambot.error.log" 