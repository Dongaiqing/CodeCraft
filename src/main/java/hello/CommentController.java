package hello;

import util.RunCode;
import util.SourceCode;

import org.apache.catalina.User;
import org.apache.commons.codec.binary.Base64;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import hello.service.CommentService;
import hello.service.UserService;
import hello.service.question_codeService;
import hello.service.question_dataService;
import hello.model.user;
import hello.model.comment;
import hello.model.question_code;
import hello.model.question_data;

@Controller
public class CommentController {

	@Autowired
    private CommentService commentService;
	//
    @RequestMapping(value = "/comment", method = RequestMethod.GET)
    @ResponseBody
    public comment  getcomment(@RequestParam("id") int id) {
		List<comment> firstcomment =commentService.findcomment(id);
		
		
    	
    	
    	return firstcomment.get(0);
    	
       
    }
    @RequestMapping(value = "/comment", method = RequestMethod.POST)
    @ResponseBody
    public long pushcomment(@RequestBody comment comment) {
		commentService.save(comment);
		return 0;
    	
    	
    }
    @RequestMapping(value = "/secondcomment", method = RequestMethod.POST)
    @ResponseBody
    public long pushsecondcomment(@RequestBody comment comment) {
    	List<comment> firstcomment =commentService.findcomment((int) comment.getFirstlevelid());
    	firstcomment.get(0).getComments().add(comment);
    	commentService.save(comment);
		return 0;
    	
    	
    }
    

}



