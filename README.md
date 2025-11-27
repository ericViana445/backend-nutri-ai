# ⚙️ Backend - Nutri A.I (Spring Boot)

## Descrição

Aplicação Java/Spring Boot que fornece a API REST para o frontend da aplicação Nutri A.I. Integra-se com a API Gemini (IA) e com o serviço Python de machine learning (XGBoost).

## 📁 Estrutura

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/server_side_and_api_gemini/
│   │   │   ├── ServerSideAndApiGeminiApplication.java  # Classe principal
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java                     # Configuração CORS
│   │   │   │   └── JpaConfig.java
│   │   │   ├── controllers/
│   │   │   │   ├── NutriAIController.java             # Endpoint de análise
│   │   │   │   └── PatientController.java             # Endpoint de pacientes
│   │   │   ├── services/
│   │   │   │   ├── NutriAIService.java                # Lógica de análise
│   │   │   │   ├── PatientService.java
│   │   │   │   └── DiagnosisService.java
│   │   │   ├── repositories/
│   │   │   │   ├── DiagnosisRecordRepository.java
│   │   │   │   └── PatientRepository.java
│   │   │   ├── entities/
│   │   │   │   ├── Patient.java
│   │   │   │   ├── DiagnosisRecord.java
│   │   │   │   └── Analysis.java
│   │   │   ├── dtos/
│   │   │   │   ├── DiagnosisInput.java
│   │   │   │   ├── GeminiRequest.java
│   │   │   │   └── XGBoostRequest.java
│   │   │   └── clients/
│   │   │       ├── GeminiClient.java                  # Cliente da API Gemini
│   │   │       └── XGBoostClient.java                 # Cliente do serviço Python
│   │   └── resources/
│   │       ├── application.properties                # Config prod
│   │       ├── application-dev.properties            # Config dev
│   │       ├── application-test.properties           # Config testes
│   │       ├── import.sql                            # Dados iniciais do BD
│   │       └── META-INF/
│   └── test/
│       └── java/...                                   # Testes unitários
├── pom.xml                                            # Dependências Maven
├── mvnw                                               # Maven Wrapper (Unix)
├── mvnw.cmd                                           # Maven Wrapper (Windows)
└── README.md                                          # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos

- **Java 11+** instalado
- **Maven 3.6+** instalado (ou use o Maven Wrapper incluído)
- Variáveis de ambiente configuradas:
  - `API_KEY_GEMINI` - Sua chave de API do Google Gemini
  - `APP_PROFILE` - (opcional) `dev`, `test` ou deixe em branco para produção

### Executar em Desenvolvimento

```bash
cd backend

# Com Maven Wrapper (Windows)
mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Com Maven Wrapper (Linux/Mac)
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Ou simplesmente
./mvnw spring-boot:run
```

O servidor estará disponível em: **http://localhost:8080**

### Executar Testes

```bash
./mvnw test
```

### Build para Produção

```bash
./mvnw clean package

# Executar o JAR gerado
java -jar target/server_side_and_api_gemini-0.0.1-SNAPSHOT.jar
```

## 🔌 Endpoints da API

### Diagnóstico

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/diagnose/run-analysis` | Executa análise nutricional completa |

**Parâmetros (multipart/form-data):**
- `patientId` (Long) - ID do paciente
- `weightKg` (double) - Peso em kg
- `heightCm` (double) - Altura em cm
- `isEdema` (boolean) - Indicador de edema
- `imageFile` (File) - Imagem clínica (JPEG/PNG)

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:8080/api/v1/diagnose/run-analysis \
  -F "patientId=1" \
  -F "weightKg=15.5" \
  -F "heightCm=110" \
  -F "isEdema=false" \
  -F "imageFile=@foto.jpg"
```

### Pacientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/patients/create` | Cria novo paciente |
| GET | `/api/v1/patients/{id}` | Busca paciente por ID |

## ⚙️ Configuração

### `application.properties` (Principal)

```properties
# Aplicação
spring.application.name=server_side_and_api_gemini
spring.profiles.active=test  # ou dev, ou deixe vazio para prod

# Banco de Dados
spring.jpa.open-in-view=false

# Serviços Externos
app.services.xgboost.url=http://localhost:8000/api/v1/diagnose/tabular
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
gemini.api.key=${API_KEY_GEMINI}

# Servidor
server.port=8080

# Arquivos Estáticos (Frontend)
spring.mvc.static-path-pattern=/**
spring.web.resources.static-locations=classpath:/static/,classpath:/public/
```

### Variáveis de Ambiente

Configure antes de executar:

```bash
# Linux/Mac
export API_KEY_GEMINI="sua-chave-aqui"
export APP_PROFILE="dev"

# Windows (PowerShell)
$env:API_KEY_GEMINI="sua-chave-aqui"
$env:APP_PROFILE="dev"
```

## 🔗 Comunicação com Serviços Externos

### API Gemini (IA)

```
GET https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

Classe responsável: `GeminiClient.java`

### Serviço XGBoost (Python)

```
POST http://localhost:8000/api/v1/diagnose/tabular
```

Classe responsável: `XGBoostClient.java`

## 🔐 CORS (Cross-Origin Resource Sharing)

Configurado em `config/CorsConfig.java` para permitir requisições do frontend.

Domínios autorizados (editar em `CorsConfig.java`):
- `http://localhost:3000` - Frontend local
- `http://localhost:5173` - Vite dev server
- Adicione seus domínios em produção

## 🐛 Troubleshooting

### Erro: "API_KEY_GEMINI não encontrada"
```bash
# Defina a variável de ambiente
export API_KEY_GEMINI="sua-chave-aqui"
```

### Erro: "Conexão recusada no XGBoost"
- Verifique se o serviço Python está rodando em `http://localhost:8000`
- Altere a URL em `application.properties` se necessário

### Erro: "Falha na requisição do Frontend"
- Verifique se CORS está configurado em `CorsConfig.java`
- Verifique a URL do frontend em `allowedOrigins`

## 📚 Dependências Principais

- **Spring Boot 3.x** - Framework web
- **Spring Data JPA** - ORM/Persistência
- **H2 Database** - Banco de dados em memória
- **Spring Web** - REST API
- **Retrofit 2** - Cliente HTTP para APIs externas

## 🚢 Deploy

### Docker

```dockerfile
FROM openjdk:11-jre-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build e executar:
```bash
docker build -t nutri-ai-backend .
docker run -p 8080:8080 -e API_KEY_GEMINI="sua-chave" nutri-ai-backend
```

### Heroku/Railway/AWS

Veja documentação específica da plataforma.

