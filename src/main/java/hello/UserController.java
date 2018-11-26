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

import hello.service.UserService;
import hello.service.question_codeService;
import hello.service.question_dataService;
import hello.model.user;
import hello.model.question_code;
import hello.model.question_data;

@Controller
public class UserController {

	@Autowired
    private UserService userService;
	//
    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    @ResponseBody
    public long  registration(@RequestBody user user) {
    	
        if(userService.findQuantity(user.getUsername())==0){
        	userService.save(user);
        }
        else {
        	return 0;
        }
        
        List<user> temp=userService.findByName(user.getUsername());

        return temp.get(0).getId();
    }
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public long login(@RequestBody user user) {
    	
    	List<user> temp=userService.findByName(user.getUsername());
	
        if (temp.isEmpty())
            return 1;
        else return 0;
//    	return temp.get(0).getId();
    }

}



