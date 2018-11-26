package hello.service;



import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hello.model.comment;
import hello.model.user;
import hello.repository.UserDao;
import hello.repository.commentDao;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private commentDao commentDao;

	@Override
	public void save(comment comment) {
		// TODO Auto-generated method stub
		commentDao.save(comment);
		
	}

	@Override
	public List<comment> findcomment(int id) {
		return commentDao.findByid(id);
		
	}

	
}
