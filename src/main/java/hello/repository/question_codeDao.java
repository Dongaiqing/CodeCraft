package hello.repository;
import hello.model.question_code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface question_codeDao extends JpaRepository<question_code, Long>{
	@Modifying
	@Query(value = "insert into question_code (source_code,language) VALUES (:source_code,:language)", nativeQuery = true)
	void insertquestion(@Param("source_code") String source_code,@Param("language") String language);
	@Query(value = "select u from question_code u where u.id = :id")
	question_code findbyid(@Param("id") long id);
}
