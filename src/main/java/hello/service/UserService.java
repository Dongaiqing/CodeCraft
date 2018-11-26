package hello.service;

import java.util.List;

import hello.model.user;

public interface UserService {
    void save(user user);

//    user findById(int id);
    
    user findByName(String name);
    
//    long findQuantity(String name);
}
