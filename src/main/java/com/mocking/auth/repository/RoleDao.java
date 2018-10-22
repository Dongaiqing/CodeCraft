package com.mocking.auth.repository;

import com.mocking.auth.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
/*@author feifei*/

public interface RoleDao extends JpaRepository<Role, Long>{
}
