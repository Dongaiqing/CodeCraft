package hello.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hello.model.comment;
import hello.model.user;

public interface commentDao extends JpaRepository<comment, Long> {

	
	/*
    @Query(value = "select u from user u where u.user_id = :user_id", nativeQuery=true)
    user findById(@Param("user_id")int user_id);
    
    @Query(value = "select * from user u where u.username = :name", nativeQuery=true)
    List<user> findByName(@Param("name")String name);
    
    @Query(value = "select count(*) from user u where u.username = :name", nativeQuery=true)
    long findQuantity(@Param("name")String name);
    
    @Modifying
	@Query(value = "insert into user (username,password,passwordConfirm) VALUES (:username,:password,:passwordConfirm)", nativeQuery = true)
	@Transactional
	void insertUser(@Param("username") String username,@Param("password") String password,@Param("passwordConfirm") String passwordConfirm);
	*/
	
}
