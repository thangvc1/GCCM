package com.example.gccm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Khai báo endpoint "/ws" để Frontend kết nối vào
        // .setAllowedOriginPatterns("*") giúp tránh lỗi CORS
        // .withSockJS() hỗ trợ các trình duyệt cũ không tương thích WebSocket thuần
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // "/topic" là tiền tố cho các kênh (channel) mà Frontend sẽ lắng nghe
        registry.enableSimpleBroker("/topic");
        // "/app" là tiền tố nếu Frontend muốn gửi message ngược lại lên Backend
        registry.setApplicationDestinationPrefixes("/app");
    }
}