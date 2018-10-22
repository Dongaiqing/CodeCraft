package com.mocking.auth.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.mocking.auth.model.Client;

public interface ClientDao extends JpaRepository<Client, Long>{
	Client findByName(String name);
}
