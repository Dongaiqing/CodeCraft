package hello.service;



import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hello.model.user;
import hello.repository.UserDao;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;


	@Override
	public void save(user user) {
		// TODO Auto-generated method stub
		userDao.save(user);
		
	}

	@Override
	public user findById(int id) {
		return userDao.findById(id);
	}

	@Override
	public List<user> findByName(String name) {
		return userDao.findByName(name);
	}

	@Override
	public long findQuantity(String name) {
		
		return userDao.findQuantity(name);
	}
}
