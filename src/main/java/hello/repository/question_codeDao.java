package hello.repository;
import hello.model.question_code;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface question_codeDao extends JpaRepository<question_code, Long>{
	@Modifying
	@Query(value = "insert into question_code (source_code,language) VALUES (:source_code,:language)", nativeQuery = true)
	@Transactional
	void insertquestion(@Param("source_code") String source_code,@Param("language") String language);
	
	@Query(value = "select count(*) from question_code u where u.user_id = :user_id AND u.language=:language AND u.question_id=:question_id")
	int findbyCode(@Param("user_id") long user_id,@Param("question_id") long question_id,@Param("language") String language);
	
	
	@Modifying
	@Query("update question_code u set u.source_code = :source_code where u.user_id = :user_id AND u.language=:language AND u.question_id=:question_id")
	void updatecode(@Param("user_id") long user_id,@Param("question_id") long question_id,@Param("language") String language, @Param("source_code") String source_code);
	
	@Modifying
	@Query("delete from question_code u where u.question_id = :question_id")
	void deletecode(@Param("question_id") long question_id);
}
