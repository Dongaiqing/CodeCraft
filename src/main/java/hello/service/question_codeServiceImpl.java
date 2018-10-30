package hello.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hello.model.question_code;
import hello.repository.question_codeDao;

@Service
public class question_codeServiceImpl implements question_codeService {

	@Autowired
    private question_codeDao question_codeDao;
	
	@Override
	public void save(question_code mq) {
		// TODO Auto-generated method stub
		question_codeDao.insertquestion(mq.getSource_code(),mq.getLanguage());
		//question_codeDao.saveAndFlush(mq);
	}
	@Override
	public question_code findbyid(long id) {
		return question_codeDao.findbyid(id);
	}


	
}