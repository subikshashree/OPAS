package com.opas.dto;

import lombok.Data;
import com.opas.model.Role;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}
