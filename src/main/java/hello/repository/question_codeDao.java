package hello.repository;
import hello.model.question_code;
import org.springframework.data.jpa.repository.JpaRepository;

public interface question_codeDao extends JpaRepository<question_code, Long>{
	
}
