# Use uma imagem base Python
FROM python:3.11-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de requisitos
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do bot
COPY main.py .
COPY .env .

# Define a variável de ambiente para logs coloridos
ENV PYTHONUNBUFFERED=1

# Comando para executar o bot
CMD ["python", "main.py"] 