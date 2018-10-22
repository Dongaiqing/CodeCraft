package com.mocking.auth.service;

import com.mocking.auth.model.User;

public interface UserService {
    void save(User user);

    User findByUsername(String username);
}
