#!/bin/bash

# Carrega variáveis de ambiente
source .env

# Função para executar comandos via SSH
execute_ssh() {
    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$1"
}

# Instala dependências no servidor
echo "Instalando dependências..."
execute_ssh "apt-get update && apt-get install -y python3 python3-pip docker.io docker-compose redis-server"

# Cria diretório do projeto
echo "Criando diretório do projeto..."
execute_ssh "mkdir -p /opt/telegram-bot"

# Copia arquivos para o servidor
echo "Copiando arquivos..."
sshpass -p "$SERVER_PASS" scp -o StrictHostKeyChecking=no main.py requirements.txt .env "$SERVER_USER@$SERVER_IP:/opt/telegram-bot/"

# Cria e configura ambiente virtual
echo "Configurando ambiente Python..."
execute_ssh "cd /opt/telegram-bot && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"

# Inicia o serviço do Redis
echo "Iniciando Redis..."
execute_ssh "systemctl start redis-server"

# Cria arquivo de serviço systemd
echo "Configurando serviço systemd..."
execute_ssh "cat > /etc/systemd/system/telegram-bot.service << EOL
[Unit]
Description=Telegram Bot Service
After=network.target redis-server.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/telegram-bot
Environment=PATH=/opt/telegram-bot/venv/bin
ExecStart=/opt/telegram-bot/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
EOL"

# Recarrega systemd e inicia o serviço
echo "Iniciando o bot..."
execute_ssh "systemctl daemon-reload && systemctl enable telegram-bot && systemctl start telegram-bot"

echo "Deploy concluído! O bot está rodando como um serviço."
echo "Use 'systemctl status telegram-bot' para verificar o status." 