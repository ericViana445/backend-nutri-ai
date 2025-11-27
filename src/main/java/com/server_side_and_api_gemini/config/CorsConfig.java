package com.server_side_and_api_gemini.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração de CORS (Cross-Origin Resource Sharing)
 * Permite que o frontend faça requisições para o backend de domínios diferentes
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Permitir requisições do frontend local e remoto
                .allowedOrigins(
                        "http://localhost:3000",      // Frontend local (porta 3000)
                        "http://localhost:5173",      // Vite dev server
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:5173",
                        "http://127.0.0.1:5173",
                        "https://backend-nutri-ai-production.up.railway.app"
                        // Adicione aqui o domínio do seu frontend em produção
                        // "https://seu-dominio-frontend.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
