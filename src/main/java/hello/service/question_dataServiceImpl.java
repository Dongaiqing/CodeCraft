package hello.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hello.model.question_code;
import hello.model.question_data;
import hello.repository.question_dataDao;

@Service
public class question_dataServiceImpl implements question_dataService {

	@Autowired
    private question_dataDao question_dataDao;
	
	@Override
	public void save(question_data mq) {
		// TODO Auto-generated method stub
		question_dataDao.insertquestion(mq.getTitle(),mq.getArticle());
		//question_dataDao.saveAndFlush(mq);
	}
	@Override
	public question_data findbyid(long id) {
		return question_dataDao.findbyid(id);
	}
	@Override
	public List<question_data> findbyTitle(String name){
		return question_dataDao.findbyTitle(name);
	}


	
}