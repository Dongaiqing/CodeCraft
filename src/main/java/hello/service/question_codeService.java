package hello.service;

import java.util.List;
import hello.model.question_code;



public interface question_codeService {
	 void save(question_code code);
	 int findbyid(question_code mq);
	 void updatecode(question_code mq);
}
