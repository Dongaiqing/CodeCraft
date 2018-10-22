package com.mocking.auth.service;

import com.mocking.auth.model.Client;

public interface ClientService {
    void save(Client client);

    Client findByClientname(String username);


}
