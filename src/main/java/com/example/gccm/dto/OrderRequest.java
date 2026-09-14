package com.example.gccm.dto;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String customerNote;
    private List<OrderItemRequest> items;
}