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
            .csrf(csrf -> csrf.disable()) // Desactivamos CSRF para facilitar pruebas en APIs REST
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated() // Exige login para cualquier petición
            )
            .httpBasic(Customizer.withDefaults()); // Usa autenticación básica (Headers)

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