package hello.service;

import java.util.List;
import hello.model.question_code;
import hello.model.question_data;



public interface question_dataService {
	 void save(question_data code);
	 question_data findbyid(long id);
	 List<question_data> findbyTitle(String name);
}
