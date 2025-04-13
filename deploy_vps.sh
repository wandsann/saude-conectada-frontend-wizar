#!/bin/bash

# Configurações da VPS
VPS_IP="69.62.98.30"
VPS_USER="root"
VPS_PASS="Jp13049//@@@@"
BOT_DIR="/opt/telegrambot"

echo "🚀 Iniciando deploy do bot na VPS..."

# Função para executar comandos SSH
execute_ssh() {
    sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "$1"
}

# Função para copiar arquivos
copy_file() {
    sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no "$1" "$VPS_USER@$VPS_IP:$2"
}

echo "📦 Instalando dependências na VPS..."
execute_ssh "apt-get update && apt-get install -y python3 python3-pip python3-venv redis-server supervisor"

echo "📁 Criando diretório do bot..."
execute_ssh "mkdir -p $BOT_DIR"

echo "📤 Copiando arquivos para a VPS..."
copy_file "bot.py" "$BOT_DIR/"
copy_file "requirements.txt" "$BOT_DIR/"
copy_file ".env" "$BOT_DIR/"

echo "🔧 Configurando ambiente virtual Python..."
execute_ssh "cd $BOT_DIR && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"

# Criar arquivo de configuração do Supervisor
echo "⚙️ Configurando Supervisor..."
execute_ssh "cat > /etc/supervisor/conf.d/telegrambot.conf << 'EOL'
[program:telegrambot]
directory=$BOT_DIR
command=$BOT_DIR/venv/bin/python bot.py
autostart=true
autorestart=true
stderr_logfile=/var/log/telegrambot.err.log
stdout_logfile=/var/log/telegrambot.out.log
user=root
environment=HOME=\"/root\",USER=\"root\"
EOL"

echo "🔄 Recarregando Supervisor..."
execute_ssh "supervisorctl reread && supervisorctl update && supervisorctl restart telegrambot"

echo "📋 Verificando status do bot..."
execute_ssh "supervisorctl status telegrambot"

echo "✅ Deploy concluído! O bot está rodando na VPS."
echo ""
echo "📝 Comandos úteis:"
echo "  Ver logs: ssh $VPS_USER@$VPS_IP 'tail -f /var/log/telegrambot.out.log'"
echo "  Ver erros: ssh $VPS_USER@$VPS_IP 'tail -f /var/log/telegrambot.err.log'"
echo "  Reiniciar bot: ssh $VPS_USER@$VPS_IP 'supervisorctl restart telegrambot'"
echo "  Status do bot: ssh $VPS_USER@$VPS_IP 'supervisorctl status telegrambot'" 