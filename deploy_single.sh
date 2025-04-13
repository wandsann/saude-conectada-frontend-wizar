#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Iniciando deploy do WandsanBot...${NC}"

# Configurações do servidor
SERVER="69.62.98.30"
USER="root"
PASS="Jp13049//@@@@"
REMOTE_DIR="/opt/wandsanbot"
VENV_DIR="$REMOTE_DIR/venv"

echo -e "${YELLOW}📦 Preparando arquivos...${NC}"

# Criar arquivo de credenciais do Google Drive temporário
cat > credentials.json << EOL
{
  "installed": {
    "client_id": "seu_client_id_google",
    "client_secret": "seu_client_secret_google",
    "redirect_uris": ["http://localhost"]
  }
}
EOL

# Comando SSH para configurar o servidor
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$USER@$SERVER" "
set -e

# Atualizar sistema e instalar dependências
apt-get update
apt-get install -y python3 python3-pip python3-venv redis-server git

# Criar diretório e ambiente virtual
mkdir -p $REMOTE_DIR
cd $REMOTE_DIR
python3 -m venv $VENV_DIR

# Ativar ambiente virtual e instalar dependências
source $VENV_DIR/bin/activate
pip install --upgrade pip
pip install $(cat requirements.txt)

# Criar arquivo de serviço systemd
cat > /etc/systemd/system/wandsanbot.service << 'EOL'
[Unit]
Description=WandsanBot Telegram Service
After=network.target redis.service
Wants=redis.service

[Service]
Type=simple
User=root
WorkingDirectory=$REMOTE_DIR
Environment=PATH=$VENV_DIR/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=$VENV_DIR/bin/python bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

# Configurar Redis
systemctl enable redis
systemctl start redis

# Recarregar systemd e reiniciar serviço
systemctl daemon-reload
systemctl enable wandsanbot
systemctl restart wandsanbot

# Mostrar status do serviço
echo '=== Status do Serviço ==='
systemctl status wandsanbot

# Mostrar últimas linhas do log
echo '=== Últimas linhas do log ==='
journalctl -u wandsanbot -n 10 --no-pager
"

# Copiar arquivos para o servidor
echo -e "${YELLOW}📤 Copiando arquivos para o servidor...${NC}"
sshpass -p "$PASS" scp -r -o StrictHostKeyChecking=no \
    bot.py \
    requirements.txt \
    .env \
    credentials.json \
    "$USER@$SERVER:$REMOTE_DIR/"

# Remover arquivo de credenciais temporário
rm credentials.json

echo -e "${GREEN}✨ Deploy concluído! O bot está rodando como um serviço.${NC}"
echo -e "${YELLOW}📝 Comandos úteis:${NC}"
echo "  Ver logs: ssh $USER@$SERVER 'journalctl -u wandsanbot -f'"
echo "  Reiniciar bot: ssh $USER@$SERVER 'systemctl restart wandsanbot'"
echo "  Ver status: ssh $USER@$SERVER 'systemctl status wandsanbot'" 