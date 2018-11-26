package hello.service;

import java.util.List;

import javax.transaction.Transactional;

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
		question_codeDao.insertquestion(mq.getSource_code(),mq.getLanguage(),mq.getUser_id(),mq.getQuestion_id(),mq.getResult());
		//question_codeDao.saveAndFlush(mq);
	}
	@Override
	public long findbyid(question_code mq) {
		//System.out.println(question_codeDao.findbyCode(mq.getUser_id(),mq.getQuestion_id(),mq.getLanguage()));
		return question_codeDao.findbyCode(mq.getUser_id(),mq.getQuestion_id(),mq.getLanguage());
	}
	
	public void updatecode(question_code mq) {
		// TODO Auto-generated method stub
		question_codeDao.updatecode(mq.getUser_id(),mq.getQuestion_id(),mq.getLanguage(),mq.getSource_code());
		//question_codeDao.saveAndFlush(mq);
	}
	@Override
	public void delete(question_code mq) {
		question_codeDao.deletecode(mq.getQuestion_id());
		
	}
	


	
}