package hello.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hello.model.User;

public interface UserDao extends JpaRepository<User, Long> {
    @Query(value = "select u from user u where u.user_id = :user_id", nativeQuery=true)
    User findById(int user_id);
    
    @Query(value = "select u from user u where u.username = :name", nativeQuery=true)
    User findByName(String name);
    
    @Modifying
	@Query(value = "insert into user (username,password,passwordConfirm) VALUES (:username,:password,:passwordConfirm)", nativeQuery = true)
	@Transactional
	void insertUser(@Param("username") String username,@Param("password") String password,@Param("passwordConfirm") String passwordConfirm);
}
