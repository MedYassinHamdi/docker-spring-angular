package com.example.backenddocker.service;

import com.example.backenddocker.dto.UserRequestDTO;
import com.example.backenddocker.dto.UserResponseDTO;
import java.util.List;

public interface UserService {
    UserResponseDTO create(UserRequestDTO dto);
    UserResponseDTO getById(Long id);
    List<UserResponseDTO> getAll();
    UserResponseDTO update(Long id, UserRequestDTO dto);
    void delete(Long id);
}