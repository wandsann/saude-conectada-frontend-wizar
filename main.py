import os
import logging
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import openai
import redis
import json

# Configuração de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Carrega variáveis de ambiente
load_dotenv()
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Configura OpenAI
openai.api_key = OPENAI_API_KEY

# Configura Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Envia mensagem quando o comando /start é emitido."""
    user = update.effective_user
    await update.message.reply_html(
        f"Olá {user.mention_html()}! 👋\n"
        "Eu sou um bot assistente que usa IA para ajudar você.\n"
        "Como posso te ajudar hoje?"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Envia mensagem quando o comando /help é emitido."""
    await update.message.reply_text(
        "Aqui estão os comandos disponíveis:\n"
        "/start - Inicia a conversa\n"
        "/help - Mostra esta mensagem de ajuda\n\n"
        "Você também pode simplesmente me enviar uma mensagem e eu tentarei ajudar!"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Processa mensagens recebidas e responde usando a API da OpenAI."""
    try:
        # Obtém a mensagem do usuário
        user_message = update.message.text
        chat_id = update.effective_chat.id
        
        # Verifica cache no Redis
        cache_key = f"chat:{chat_id}:{hash(user_message)}"
        cached_response = redis_client.get(cache_key)
        
        if cached_response:
            await update.message.reply_text(cached_response.decode('utf-8'))
            return

        # Gera resposta usando OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente amigável e prestativo."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1000,
            temperature=0.7
        )

        # Extrai a resposta
        bot_response = response.choices[0].message.content.strip()
        
        # Salva no cache por 1 hora
        redis_client.setex(cache_key, 3600, bot_response)
        
        # Envia a resposta
        await update.message.reply_text(bot_response)
        
    except Exception as e:
        logger.error(f"Erro ao processar mensagem: {str(e)}")
        await update.message.reply_text(
            "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde."
        )

async def main() -> None:
    """Inicia o bot."""
    try:
        # Cria o aplicativo e adiciona handlers
        application = Application.builder().token(TELEGRAM_TOKEN).build()

        # Adiciona handlers
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

        # Inicia o bot
        await application.run_polling(allowed_updates=Update.ALL_TYPES)
        
    except Exception as e:
        logger.error(f"Erro ao iniciar o bot: {str(e)}")

if __name__ == '__main__':
    asyncio.run(main()) 