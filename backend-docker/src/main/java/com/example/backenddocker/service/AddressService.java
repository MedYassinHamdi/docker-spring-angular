package com.example.backenddocker.service;

import com.example.backenddocker.dto.AddressRequestDTO;
import com.example.backenddocker.entity.Address;
import java.util.List;

public interface AddressService {
    Address create(AddressRequestDTO dto);
    List<Address> getByUserId(Long userId);
    void delete(Long id);
}