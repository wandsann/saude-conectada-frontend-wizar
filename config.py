import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do Telegram
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')

# Configurações do Redis
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))

# Configurações do Ollama
OLLAMA_URL = "http://localhost:11434"

# Configurações de contexto
MAX_CONTEXT_LENGTH = 8192  # Aumentado para manter mais histórico
CONTEXT_EXPIRY = None  # Desabilitado expiração automática

# Personalidade do Bot
PERSONALITY = {
    'greeting': [
        "Oi! Tudo bem? 😊",
        "Olá! Como posso ajudar você hoje? 💫",
        "Opa! Que bom ter você por aqui! 🌟",
        "Fala aí! Como posso ser útil? 😃"
    ],
    'thinking': [
        "Hmm, deixa eu pensar...",
        "Processando sua mensagem...",
        "Analisando isso com carinho...",
        "Só um minutinho..."
    ],
    'error': [
        "Poxa, me desculpe! Tive um probleminha aqui 😅",
        "Eita, algo deu errado. Vamos tentar de novo?",
        "Opa, tive uma dificuldade. Pode reformular?",
        "Nossa, me perdi aqui. Pode repetir?"
    ],
    'success': [
        "Prontinho! 🎉",
        "Aí está! Espero ter ajudado 😊",
        "Feito! Mais alguma coisa? 🌟",
        "Pronto! Ficou bom assim? 💫"
    ],
    'farewell': [
        "Até mais! Foi ótimo conversar com você 👋",
        "Tchau! Volte sempre 🤗",
        "Até a próxima! Adorei nossa conversa 💫",
        "Tchau tchau! Qualquer coisa é só chamar 😊"
    ],
    'backup': [
        "Backup do histórico criado com sucesso! 📚",
        "Histórico salvo com sucesso! 💾",
        "Pronto! Seu histórico está guardado! 🗄️"
    ],
    'clear': [
        "Histórico limpo com sucesso! 🧹",
        "Pronto! Histórico apagado! 🗑️",
        "Ok! Começando uma nova conversa do zero! 🆕"
    ],
    'system_prompt': """Você é um assistente amigável e prestativo que fala em português brasileiro informal, 
    mas sempre mantendo o profissionalismo. Use emojis moderadamente para tornar a conversa mais 
    acolhedora. Seja empático e tente entender o contexto do usuário antes de responder. 
    Evite respostas muito longas e técnicas, preferindo explicações claras e diretas."""
}

# Comandos do bot
COMMANDS = {
    'start': 'Iniciar o bot',
    'help': 'Ver lista de comandos disponíveis',
    'clear': 'Limpar histórico da conversa',
    'backup': 'Criar backup do histórico',
    'restore': 'Restaurar último backup',
    'ollama': 'Usar modelo Llama2 local',
    'deepseek': 'Usar DeepSeek Chat',
    'huggingface': 'Usar Microsoft Phi-2',
    'openrouter': 'Usar OpenRouter (Claude-2)'
}

# Configurações gerais
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN', '@Wandsan_bot')
REDIS_HOST = 'localhost'
REDIS_PORT = 6379

# Configurações dos modelos
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY', '')

# Configurações dos modelos
MODELS = {
    'ollama': {
        'name': 'llama2',
        'url': OLLAMA_URL,
        'type': 'local'
    },
    'deepseek': {
        'name': 'deepseek-chat',
        'api_key': DEEPSEEK_API_KEY,
        'type': 'cloud'
    },
    'huggingface': {
        'name': 'microsoft/phi-2',
        'api_key': HUGGINGFACE_API_KEY,
        'type': 'cloud'
    }
} 