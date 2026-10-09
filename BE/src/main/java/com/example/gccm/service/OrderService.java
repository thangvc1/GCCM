package com.example.gccm.service;

import com.example.gccm.dto.OrderDetailResponseDTO;
import com.example.gccm.dto.OrderResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.gccm.dto.OrderItemRequest;
import com.example.gccm.dto.OrderRequest;
import com.example.gccm.entity.*;
import com.example.gccm.enums.NotificationType;
import com.example.gccm.repository.*;
import com.example.gccm.security.CustomUserDetails;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public OrderService(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository,
                        ProductRepository productRepository, CustomerRepository customerRepository,
                        NotificationRepository notificationRepository,
                        SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {

        Customer currentCustomer = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            currentCustomer = customerRepository.findByAccountId(userDetails.getAccount().getId()).orElse(null);
        }

        Order order = new Order();
        order.setCustomer(currentCustomer);
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCustomerNote(request.getCustomerNote());
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAreaM2(BigDecimal.ZERO);
        order.setTotalPrice(BigDecimal.ZERO);
        order.setFinalAmount(BigDecimal.ZERO);

        order = orderRepository.save(order);

        BigDecimal totalArea = BigDecimal.ZERO;
        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderDetail> details = new ArrayList<>();

        StringBuilder notifContent = new StringBuilder();
        notifContent.append("Khách hàng: ").append(request.getReceiverName())
                .append(" - SĐT: ").append(request.getReceiverPhone())
                .append(" đã đặt mua:\n");

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + itemReq.getProductId()));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantityM2(itemReq.getQuantityM2());
            detail.setUnitPrice(product.getUnitPrice());

            BigDecimal subtotal = product.getUnitPrice().multiply(itemReq.getQuantityM2());
            detail.setSubtotal(subtotal);
            details.add(detail);

            totalArea = totalArea.add(itemReq.getQuantityM2());
            totalPrice = totalPrice.add(subtotal);

            notifContent.append("- ").append(itemReq.getQuantityM2()).append("m2 ")
                    .append(product.getName()).append(" (Dày: ").append(product.getThicknessMm()).append("mm)\n");
        }

        orderDetailRepository.saveAll(details);

        order.setTotalAreaM2(totalArea);
        order.setTotalPrice(totalPrice);
        order.setFinalAmount(totalPrice);
        orderRepository.save(order);

        Notification notif = new Notification();
        notif.setTitle("Đơn hàng mới từ " + request.getReceiverName());
        notif.setContent(notifContent.toString());
        notif.setOrderId(order.getId());
        notif.setType(NotificationType.NEW_ORDER);
        notif.setIsRead(0);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                messagingTemplate.convertAndSend("/topic/admin/notifications", notif);
            }
        });

        return order;
    }

    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToOrderResponseDTO);
    }

    public Page<OrderResponseDTO> getOrdersByCustomer(Long customerId, Pageable pageable) {
        return orderRepository.findByCustomerId(customerId, pageable).map(this::mapToOrderResponseDTO);
    }

    // HÀM MỚI TÍCH HỢP CHO TÌM KIẾM ĐƠN HÀNG
    public Page<OrderResponseDTO> searchAdminOrders(String keyword, Integer thickness, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return orderRepository.searchAdminOrders(keyword, thickness, startDate, endDate, pageable)
                .map(this::mapToOrderResponseDTO);
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {

        List<OrderDetailResponseDTO> itemDTOs = order.getOrderDetails().stream()
                .map(detail -> OrderDetailResponseDTO.builder()
                        .productId(detail.getProduct().getId())
                        .productName(detail.getProduct().getName())
                        .thicknessMm(detail.getProduct().getThicknessMm())
                        .quantityM2(detail.getQuantityM2())
                        .unitPrice(detail.getUnitPrice())
                        .subtotal(detail.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomer() != null ? order.getCustomer().getFullName() : "Khách vãng lai")
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .totalAreaM2(order.getTotalAreaM2())
                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .customerNote(order.getCustomerNote())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }
}