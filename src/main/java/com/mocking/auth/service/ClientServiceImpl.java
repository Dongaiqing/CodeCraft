package com.mocking.auth.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mocking.auth.model.Client;
import com.mocking.auth.repository.ClientDao;

@Service
public class ClientServiceImpl implements ClientService {
    @Autowired
    private ClientDao ClientDao;



    @Override
    public void save(Client user) {

        ClientDao.save(user);
    }

    @Override
    public Client findByClientname(String username) {
        return ClientDao.findByName(username);
    }
}
