#!/bin/bash

# Criar diretórios para cada bot
mkdir -p bot{1,2,3}

# Copiar requirements.txt para cada bot
for i in {1..3}; do
  cp requirements.txt bot$i/
done

# Copiar main.py para cada bot
for i in {1..3}; do
  cp main.py bot$i/
done

# Criar arquivo .env para cada bot
for i in {1..3}; do
  cat > bot$i/.env << EOL
TELEGRAM_TOKEN=seu_token_aqui
OPENAI_API_KEY=sua_chave_openai_aqui
EOL
done

# Dar permissão de execução ao script
chmod +x setup.sh

echo "Estrutura de diretórios e arquivos criada com sucesso!" 