package hello.service;

import hello.model.User;

public interface UserService {
    void save(User user);

    User findById(int id);
    
    User findByName(String name);
}
