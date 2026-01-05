# Solo Sense - Sistema de Monitoramento de Umidade do Solo

Sistema completo de monitoramento de umidade do solo utilizando ESP32, servidor PHP (Slim Framework) e interface web em React. O projeto permite a leitura automática de umidade através de sensores, armazenamento de dados históricos e visualização em tempo real.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Instalação](#configuração-e-instalação)
  - [1. Server (Backend)](#1-server-backend)
  - [2. Client (Frontend)](#2-client-frontend)
  - [3. ESP32 (Hardware)](#3-esp32-hardware)
- [Uso](#uso)
- [Troubleshooting](#troubleshooting)

## Visão Geral

O **Solo Sense** é um sistema IoT para monitoramento de umidade do solo que integra:

- **Hardware**: ESP32/ESP8266 com sensor de umidade do solo
- **Backend**: API REST em PHP com Slim Framework e banco MySQL
- **Frontend**: Interface web responsiva em React + TypeScript + Tailwind CSS

O sistema coleta dados de umidade do solo através de sensores conectados ao ESP32, envia para uma API REST que armazena os dados em um banco MySQL, e apresenta as informações em uma interface web intuitiva.

# Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   ESP32     │  HTTP   │   Server     │  HTTP   │   Client    │
│  + Sensor   │ ──────> │   PHP/Slim   │ <────── │    React    │
│             │         │   + MySQL    │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
```

# Tecnologias Utilizadas

### Backend (Server)
- **PHP** com Slim Framework 4
- **MySQL** para armazenamento de dados
- **Doctrine Migrations** para gerenciamento do banco de dados
- **Docker** & **Docker Compose** para containerização
- **PSR-7** e **PSR-11** para padrões PHP

### Frontend (Client)
- **React 19** com TypeScript
- **Vite** como build tool
- **Tailwind CSS** para estilização
- **ESLint** para linting

### Hardware (ESP32)
- **ESP8266/ESP32**
- Sensor de umidade do solo analógico
- WiFi para conectividade

## Estrutura do Projeto

```
agro-sense-server/
├── client/              # Frontend React
│   ├── src/
│   │   ├── App.tsx      # Componente principal
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── server/              # Backend PHP
│   ├── public/
│   │   └── index.php    # Entry point
│   ├── src/
│   │   ├── Application/ # Use Cases e DTOs
│   │   ├── Controllers/
│   │   ├── Infra/       # Middlewares
│   │   └── InterfaceAdapters/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── composer.json
│
└── esp32-e/             # Código do ESP32
    └── solo_sense/
        └── solo_sense.ino
```

## Configuração e Instalação

### 1. Server (Backend)

#### Pré-requisitos
- Docker e Docker Compose instalados
- Porta 8080 disponível

#### Passo a Passo

1. **Navegue até a pasta do servidor:**
   ```bash
   cd server
   ```

2. **Configure as variáveis de ambiente:**
   
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com as seguintes configurações:
   ```env
   DB_HOST=db
   DB_NAME=example_db
   DB_USER=application
   DB_PASSWORD=password
   DB_PORT=3306
   API_TOKEN=your_api_token
   ```
   
   >  **Importante**: `DB_HOST=db` corresponde ao nome do container MySQL no docker-compose. Altere `API_TOKEN` para um valor seguro.

3. **Inicie os containers Docker:**
   ```bash
   docker-compose up -d
   ```
   
   Isso irá:
   - Criar e iniciar o container PHP (porta 8080)
   - Criar e iniciar o container MySQL
   - Configurar a rede entre os containers

4. **Execute as migrations do banco de dados:**
   ```bash
   docker exec -it php-server vendor/bin/doctrine-migrations migrate
   ```
   
   Confirme a execução quando solicitado.

5. **Verifique se o servidor está rodando:**
   ```bash
   curl http://localhost:8080
   ```

O servidor estará disponível em `http://localhost:8080`

---

### 2. Client (Frontend)

#### Pré-requisitos
- Node.js 18+ e npm/yarn instalados

#### Passo a Passo

1. **Navegue até a pasta do cliente:**
   ```bash
   cd client
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env`:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_API_TOKEN=your_api_token
   ```
   
   >  **Importante**: O `VITE_API_TOKEN` deve ser o mesmo valor configurado no servidor.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   
   O frontend estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite)

#### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

---

### 3. ESP32 (Hardware)

#### Pré-requisitos
- Arduino IDE ou PlatformIO
- Biblioteca ESP8266WiFi (para ESP8266) ou WiFi.h (para ESP32)
- Biblioteca ESP8266HTTPClient (para ESP8266) ou HTTPClient.h (para ESP32)
- Sensor de umidade do solo analógico

#### Configuração do Hardware

1. **Conexões:**
   - Sensor VCC → 3.3V do ESP32
   - Sensor GND → GND do ESP32
   - Sensor AO → Pino A0 (analógico)

#### Configuração do Código

1. **Abra o arquivo:**
   ```
   esp32-e/solo_sense/solo_sense.ino
   ```

2. **Configure as credenciais WiFi:**
   ```cpp
   const char* ssid     = "sua_rede_wifi";
   const char* password = "sua_senha_wifi";
   ```

3. **Configure a URL do servidor e token:**
   ```cpp
   String url = "http://SEU_SERVIDOR:8080/humidity/" + String(rawValue);
   String apiToken = "your_api_token";
   ```
   
   >  Substitua `SEU_SERVIDOR` pelo IP ou domínio onde o servidor está rodando e use o mesmo `API_TOKEN` configurado no servidor.

4. **Compile e faça upload para o ESP32:**
   - Selecione a placa correta (ESP8266/ESP32)
   - Selecione a porta COM correta
   - Clique em "Upload"

5. **Monitore a saída serial:**
   - Abra o Serial Monitor (9600 baud)
   - Verifique a conexão WiFi e o envio de dados

## Uso

### Interface Web (Client)

A interface oferece três funcionalidades principais:

1. **Visualização da Umidade Atual**: Mostra a última leitura de umidade registrada
2. **Histórico de Umidade**: Exibe um gráfico/lista com todas as leituras anteriores
3. **Limpar Histórico**: Botão para apagar todos os registros históricos

### Fluxo de Dados

1. O ESP32 lê o sensor de umidade a cada 2 segundos
2. Envia o valor via HTTP POST para o servidor
3. O servidor armazena no banco MySQL
4. O cliente consulta e exibe os dados em tempo real

