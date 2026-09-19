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
        // Hỗ trợ cả 2 loại kênh: "/topic" (phát chung) và "/queue" (phát riêng hoặc hàng đợi)
        registry.enableSimpleBroker("/topic", "/queue");

        registry.setApplicationDestinationPrefixes("/app");

        // Thêm cấu hình này để STOMP hiểu các destination bắt đầu bằng "/user"
        // là tin nhắn dành riêng cho một user cụ thể.
        registry.setUserDestinationPrefix("/user");
    }
}