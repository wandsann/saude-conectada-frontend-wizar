#!/bin/bash

# Configurações
VPS_IP="69.62.98.30"
VPS_USER="root"
VPS_PASS="Jp13049//@@@@"
TELEGRAM_TOKEN="8038971105:AAGdBMrEu9qL5QVmFGaJZPk2udMXvLBBvpE"

# Função para executar comandos via SSH
execute_ssh() {
    sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "$1"
}

# Instalar dependências básicas
echo "Instalando dependências básicas..."
execute_ssh "apt-get update && apt-get install -y python3-pip python3-venv nodejs npm docker.io docker-compose curl"

# Instalar Ollama
echo "Instalando Ollama..."
execute_ssh "curl -fsSL https://ollama.com/install.sh | sh"

# Criar diretório do projeto
execute_ssh "mkdir -p /opt/telegram-bots"

# Criar arquivo docker-compose.yml
execute_ssh "cat > /opt/telegram-bots/docker-compose.yml << 'EOF'
version: '3.8'

services:
  ollama-bot:
    build: ./ollama-bot
    environment:
      - TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
      - BOT_NAME=Llama3_Assistant
    network_mode: host
    restart: always
    volumes:
      - ./ollama-bot/data:/app/data

  deepseek-bot:
    build: ./deepseek-bot
    environment:
      - TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
      - BOT_NAME=DeepSeek_Assistant
    restart: always
    volumes:
      - ./deepseek-bot/data:/app/data

  huggingface-bot:
    build: ./huggingface-bot
    environment:
      - TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
      - BOT_NAME=HuggingFace_Assistant
    restart: always
    volumes:
      - ./huggingface-bot/data:/app/data

  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data

volumes:
  redis_data:
EOF"

# Configurar Ollama Bot
echo "Configurando Ollama Bot..."
execute_ssh "mkdir -p /opt/telegram-bots/ollama-bot"
execute_ssh "cat > /opt/telegram-bots/ollama-bot/requirements.txt << 'EOF'
python-telegram-bot==13.7
requests==2.31.0
python-dotenv==0.19.2
EOF"

execute_ssh "cat > /opt/telegram-bots/ollama-bot/Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD [\"python\", \"main.py\"]
EOF"

execute_ssh "cat > /opt/telegram-bots/ollama-bot/main.py << 'EOF'
import os
import logging
import requests
from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_API = 'http://localhost:11434/api/generate'

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Olá! Sou o assistente Llama 3. Como posso ajudar?')

def handle_message(update: Update, context: CallbackContext) -> None:
    try:
        response = requests.post(OLLAMA_API, json={
            'model': 'llama2',
            'prompt': update.message.text,
            'stream': False
        })
        if response.status_code == 200:
            ai_response = response.json().get('response', 'Desculpe, não consegui processar sua mensagem.')
            update.message.reply_text(ai_response)
        else:
            update.message.reply_text('Desculpe, estou tendo problemas para processar sua mensagem.')
    except Exception as e:
        logger.error(f'Erro ao processar mensagem: {e}')
        update.message.reply_text('Ocorreu um erro ao processar sua mensagem.')

def main():
    updater = Updater(os.getenv('TELEGRAM_TOKEN'))
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler('start', start))
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
EOF"

# Configurar DeepSeek Bot
echo "Configurando DeepSeek Bot..."
execute_ssh "mkdir -p /opt/telegram-bots/deepseek-bot"
execute_ssh "cat > /opt/telegram-bots/deepseek-bot/requirements.txt << 'EOF'
python-telegram-bot==13.7
requests==2.31.0
python-dotenv==0.19.2
EOF"

execute_ssh "cat > /opt/telegram-bots/deepseek-bot/Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD [\"python\", \"main.py\"]
EOF"

execute_ssh "cat > /opt/telegram-bots/deepseek-bot/main.py << 'EOF'
import os
import logging
import requests
from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'  # Ajuste conforme documentação
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Olá! Sou o assistente DeepSeek. Como posso ajudar?')

def handle_message(update: Update, context: CallbackContext) -> None:
    try:
        headers = {
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        }
        response = requests.post(
            DEEPSEEK_API_URL,
            headers=headers,
            json={
                'messages': [{'role': 'user', 'content': update.message.text}],
                'model': 'deepseek-chat'
            }
        )
        if response.status_code == 200:
            ai_response = response.json()['choices'][0]['message']['content']
            update.message.reply_text(ai_response)
        else:
            update.message.reply_text('Desculpe, estou tendo problemas para processar sua mensagem.')
    except Exception as e:
        logger.error(f'Erro ao processar mensagem: {e}')
        update.message.reply_text('Ocorreu um erro ao processar sua mensagem.')

def main():
    updater = Updater(os.getenv('TELEGRAM_TOKEN'))
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler('start', start))
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
EOF"

# Configurar HuggingFace Bot
echo "Configurando HuggingFace Bot..."
execute_ssh "mkdir -p /opt/telegram-bots/huggingface-bot"
execute_ssh "cat > /opt/telegram-bots/huggingface-bot/requirements.txt << 'EOF'
python-telegram-bot==13.7
requests==2.31.0
python-dotenv==0.19.2
transformers==4.26.0
torch==1.10.1
EOF"

execute_ssh "cat > /opt/telegram-bots/huggingface-bot/Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD [\"python\", \"main.py\"]
EOF"

execute_ssh "cat > /opt/telegram-bots/huggingface-bot/main.py << 'EOF'
import os
import logging
import requests
from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/'
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY', '')
MODEL_NAME = 'facebook/blenderbot-400M-distill'  # Modelo pequeno para exemplo

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Olá! Sou o assistente HuggingFace. Como posso ajudar?')

def handle_message(update: Update, context: CallbackContext) -> None:
    try:
        headers = {'Authorization': f'Bearer {HUGGINGFACE_API_KEY}'}
        response = requests.post(
            f'{HUGGINGFACE_API_URL}{MODEL_NAME}',
            headers=headers,
            json={'inputs': update.message.text}
        )
        if response.status_code == 200:
            ai_response = response.json()[0]['generated_text']
            update.message.reply_text(ai_response)
        else:
            update.message.reply_text('Desculpe, estou tendo problemas para processar sua mensagem.')
    except Exception as e:
        logger.error(f'Erro ao processar mensagem: {e}')
        update.message.reply_text('Ocorreu um erro ao processar sua mensagem.')

def main():
    updater = Updater(os.getenv('TELEGRAM_TOKEN'))
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler('start', start))
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
EOF"

# Criar arquivo .env
execute_ssh "cat > /opt/telegram-bots/.env << EOF
TELEGRAM_TOKEN=$TELEGRAM_TOKEN
DEEPSEEK_API_KEY=seu_deepseek_api_key
HUGGINGFACE_API_KEY=seu_huggingface_api_key
EOF"

# Baixar modelo Llama 3 no Ollama
echo "Baixando modelo Llama 3..."
execute_ssh "ollama pull llama2"

# Iniciar os containers
echo "Iniciando os containers..."
execute_ssh "cd /opt/telegram-bots && docker-compose up -d"

echo "Instalação concluída! Os bots estão rodando em containers Docker."
echo "IMPORTANTE: Você precisa configurar suas chaves de API no arquivo .env:"
echo "1. DeepSeek API Key"
echo "2. HuggingFace API Key"
echo "Para configurar, use o comando:"
echo "nano /opt/telegram-bots/.env" 