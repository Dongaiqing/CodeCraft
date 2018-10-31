package hello.repository;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hello.model.question_data;

public interface question_dataDao extends JpaRepository<question_data, Long>{
	@Modifying
	@Query(value = "insert into question_data (source_code,language) VALUES (:source_code,:language)", nativeQuery = true)
	@Transactional
	void insertquestion(@Param("source_code") String source_code,@Param("language") String language);
	@Query(value = "select u from question_data u where u.id = :id")
	question_data findbyid(@Param("id") long id);
	@Query(value = "select u from question_data u where u.title = :name")
	List<question_data> findbyTitle(@Param("name") String name);
}
