import logging
import os
import subprocess
import shutil
import asyncio
import re
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
from dotenv import load_dotenv
import requests
import aiohttp
from github import Github
from onedrivesdk import get_default_client, AuthProvider
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Configurar logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()
TOKEN = os.getenv('TELEGRAM_TOKEN')

class NLPHandler:
    def __init__(self):
        self.commands = {
            'criar_arquivo': r'(?:crie|criar|gerar|fazer)(?: um)? arquivo(?: chamado)? (?P<filename>[\w.-]+)(?: com(?: o)? conte[úu]do)? (?P<content>.*)',
            'compactar': r'(?:compactar|zipar|comprimir)(?: os)? arquivos? (?P<files>[\w\s,.-]+)',
            'executar_script': r'(?:executar?|rodar)(?: o)? (?:script|comando)(?:\s*:\s*|\s+)(?P<script>.*)',
            'listar_diretorio': r'(?:listar?|mostrar?|ver)(?: o)?(?: conte[úu]do)?(?: do)? diret[óo]rio(?: atual)?',
            'upload_github': r'(?:fazer |realizar )?upload(?: para)?(?: o)? github(?: do arquivo)? (?P<filename>[\w.-]+)',
            'upload_drive': r'(?:fazer |realizar )?upload(?: para)?(?: o)? drive(?: do arquivo)? (?P<filename>[\w.-]+)',
            'upload_onedrive': r'(?:fazer |realizar )?upload(?: para)?(?: o)? onedrive(?: do arquivo)? (?P<filename>[\w.-]+)'
        }

    def parse_command(self, text: str) -> tuple:
        for cmd, pattern in self.commands.items():
            match = re.match(pattern, text.lower().strip())
            if match:
                return cmd, match.groupdict()
        return None, None

class FileManager:
    @staticmethod
    async def create_file(filename: str, content: str) -> bool:
        try:
            with open(filename, 'w') as f:
                f.write(content)
            return True
        except Exception as e:
            logger.error(f"Erro ao criar arquivo: {e}")
            return False

    @staticmethod
    async def compress_files(files: list, output_filename: str) -> bool:
        try:
            shutil.make_archive(output_filename, 'zip', root_dir='.', base_dir=None)
            return True
        except Exception as e:
            logger.error(f"Erro ao compactar arquivos: {e}")
            return False

    @staticmethod
    async def execute_script(script_content: str) -> tuple:
        try:
            temp_script = 'temp_script.sh'
            with open(temp_script, 'w') as f:
                f.write(script_content)
            os.chmod(temp_script, 0o755)
            
            process = await asyncio.create_subprocess_shell(
                f'./{temp_script}',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            os.remove(temp_script)
            return stdout.decode(), stderr.decode()
        except Exception as e:
            logger.error(f"Erro ao executar script: {e}")
            return None, str(e)

class Bot:
    def __init__(self):
        self.file_manager = FileManager()
        self.nlp_handler = NLPHandler()

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        welcome_text = """
Olá! Eu sou um bot assistente que pode te ajudar com várias tarefas. 
Você pode me pedir coisas como:

- Criar arquivos
- Compactar arquivos
- Executar scripts
- Fazer upload para GitHub/Drive/OneDrive
- Listar diretórios

Alguns exemplos de comandos:
• "criar arquivo teste.txt com o conteúdo Olá mundo"
• "compactar arquivos arquivo1.txt, arquivo2.txt"
• "executar script: echo 'teste'"
• "listar diretório"
• "fazer upload para github do arquivo teste.txt"

Como posso te ajudar hoje?
"""
        await update.message.reply_text(welcome_text)

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        text = update.message.text
        cmd, params = self.nlp_handler.parse_command(text)

        if cmd is None:
            await update.message.reply_text(
                "Desculpe, não entendi o comando. Use /start para ver exemplos de como me pedir as coisas."
            )
            return

        if cmd == 'criar_arquivo':
            success = await self.file_manager.create_file(
                params['filename'],
                params['content']
            )
            if success:
                await update.message.reply_text(f"✅ Arquivo {params['filename']} criado com sucesso!")
            else:
                await update.message.reply_text("❌ Erro ao criar o arquivo")

        elif cmd == 'compactar':
            files = [f.strip() for f in params['files'].split(',')]
            success = await self.file_manager.compress_files(files, 'arquivos_compactados')
            if success:
                await update.message.reply_document(
                    document=open('arquivos_compactados.zip', 'rb'),
                    caption="✅ Arquivos compactados com sucesso!"
                )
            else:
                await update.message.reply_text("❌ Erro ao compactar os arquivos")

        elif cmd == 'executar_script':
            stdout, stderr = await self.file_manager.execute_script(params['script'])
            if stdout:
                await update.message.reply_text(f"✅ Saída do script:\n{stdout}")
            if stderr:
                await update.message.reply_text(f"⚠️ Erros do script:\n{stderr}")

        elif cmd == 'listar_diretorio':
            try:
                files = os.listdir('.')
                files_text = '\n'.join(files)
                await update.message.reply_text(f"📁 Conteúdo do diretório:\n\n{files_text}")
            except Exception as e:
                await update.message.reply_text(f"❌ Erro ao listar diretório: {e}")

def main():
    try:
        bot = Bot()
        application = Application.builder().token(TOKEN).build()

        application.add_handler(CommandHandler("start", bot.start))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))

        logger.info("Bot iniciado!")
        application.run_polling(allowed_updates=Update.ALL_TYPES)

    except Exception as e:
        logger.error(f"Erro ao iniciar o bot: {e}")

if __name__ == '__main__':
    main() 