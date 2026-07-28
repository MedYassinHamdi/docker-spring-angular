package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.AddressRequestDTO;
import com.example.backenddocker.entity.Address;
import com.example.backenddocker.entity.User;
import com.example.backenddocker.repository.AddressRepository;
import com.example.backenddocker.repository.UserRepository;
import com.example.backenddocker.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public Address create(AddressRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        Address address = Address.builder()
                .user(user)
                .street(dto.getStreet())
                .city(dto.getCity())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .isDefault(dto.isDefault())
                .build();

        return addressRepository.save(address);
    }

    @Override
    public List<Address> getByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public void delete(Long id) {
        addressRepository.deleteById(id);
    }
}