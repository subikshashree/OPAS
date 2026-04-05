package com.opas.service;

import com.opas.dto.JwtResponse;
import com.opas.dto.LoginRequest;
import com.opas.dto.SignupRequest;
import com.opas.model.User;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);

    User registerUser(SignupRequest signupRequest);
}
