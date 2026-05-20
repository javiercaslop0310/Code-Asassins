package com.codeAssasins.gestor_tareas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .authorizeHttpRequests(auth -> auth
                // 1. Dejar la puerta abierta para CORS (Peticiones OPTIONS de Angular)
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // 2. Dejar la puerta abierta para que Swagger sea público
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                // 3. Exigir login para todo lo demás (Tus endpoints de /api/proyectos y /api/tareas)
                .anyRequest().authenticated() 
            )
            .httpBasic(Customizer.withDefaults()); 

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Creamos un usuario "admin" con contraseña "admin123"
        // {noop} indica que la contraseña no está encriptada (solo para pruebas)
        UserDetails admin = User.builder()
            .username("admin")
            .password("{noop}admin123")
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin);
    }
}