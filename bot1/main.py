import os
import logging
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import openai
import redis

# Configurar logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Configurar OpenAI
openai.api_key = OPENAI_API_KEY

# Configurar Redis
redis_client = redis.Redis(
    host='redis',  # Nome do serviço Redis no docker-compose
    port=6379,
    db=0,
    decode_responses=True
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Envia mensagem quando o comando /start é emitido."""
    user = update.effective_user
    await update.message.reply_html(
        f"Olá {user.mention_html()}! Eu sou um bot de IA. Como posso ajudar?"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Envia mensagem quando o comando /help é emitido."""
    await update.message.reply_text("Envie uma mensagem e eu responderei usando IA!")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Processa mensagens recebidas e responde usando a OpenAI."""
    try:
        # Obter a mensagem do usuário
        message = update.message.text
        
        # Criar uma conversa com a OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente amigável e prestativo."},
                {"role": "user", "content": message}
            ]
        )
        
        # Enviar a resposta
        await update.message.reply_text(response.choices[0].message.content)
        
    except Exception as e:
        logger.error(f"Erro ao processar mensagem: {str(e)}")
        await update.message.reply_text(
            "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde."
        )

def main():
    """Função principal para iniciar o bot."""
    try:
        # Criar a aplicação
        application = Application.builder().token(TELEGRAM_TOKEN).build()

        # Adicionar handlers
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

        # Iniciar o bot
        application.run_polling(allowed_updates=Update.ALL_TYPES)
        
    except Exception as e:
        logger.error(f"Erro ao iniciar o bot: {str(e)}")

if __name__ == '__main__':
    main() 