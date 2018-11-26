package hello;

import util.RunCode;
import util.SourceCode;
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

import hello.service.UserService;
import hello.service.question_codeService;
import hello.service.question_dataService;
import hello.model.User;
import hello.model.question_code;
import hello.model.question_data;

@Controller
public class UserController {

	@Autowired
    private UserService userService;
	//
    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public long registration(@RequestBody User user) {
    	
        if(userService.findByName(user.getUsername())!=null){
        	userService.save(user);
        }
        else {
        	return 0;
        }
        User temp=userService.findByName(user.getUsername());


        return temp.getId();
    }
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public long login(@RequestBody User user) {
    	
        if(userService.findByName(user.getUsername())!=null){
        	userService.save(user);
        }
        User temp=userService.findByName(user.getUsername());


        return temp.getId();
    }

}



