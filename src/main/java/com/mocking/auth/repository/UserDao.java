package com.mocking.auth.repository;

import com.mocking.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
/*@author feifei*/
public interface UserDao extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
