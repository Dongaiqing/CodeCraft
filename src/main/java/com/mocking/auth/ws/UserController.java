package com.mocking.auth.ws;

import com.mocking.auth.model.TestForm;
import com.mocking.auth.model.User;
import com.mocking.auth.service.SecurityService;
import com.mocking.auth.service.UserService;
import com.mocking.auth.validator.UserValidator;
import util.RunCode;
import util.SourceCode;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/*@author feifei*/

@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private UserValidator userValidator;

    @RequestMapping(value = "/registration", method = RequestMethod.GET)
    public String registration(Model model) {
        model.addAttribute("userForm", new User());

        return "registration";
    }

    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public String registration(@ModelAttribute("userForm") User userForm, BindingResult bindingResult, Model model) {
        userValidator.validate(userForm, bindingResult);

        if (bindingResult.hasErrors()) {
            return "registration";
        }

        userService.save(userForm);

        securityService.autologin(userForm.getUsername(), userForm.getPasswordConfirm());

        return "redirect:/welcome";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(Model model, String error, String logout) {
        if (error != null)
            model.addAttribute("error", "Your username and password is invalid.");

        if (logout != null)
            model.addAttribute("message", "You have been logged out successfully.");

        return "login";
    }

    @RequestMapping(value = {"/", "/welcome"}, method = RequestMethod.GET)
    public String welcome(Model model) {
        return "welcome";
    }
    
    @RequestMapping(value = "timer", method = RequestMethod.GET)
    public String getTimer(Model model) {
    	model.addAttribute("form", new TestForm());
        return "timer";
    }
    @RequestMapping(value = {"/test"}, method = RequestMethod.POST)
    public ModelAndView test(@ModelAttribute("form") TestForm form,Model model)  {
    	System.out.println(form.getSource_code());
    	
    	SourceCode UserCode=new SourceCode("hello",form.getSource_code(),"java");
    	RunCode TheProcess=new RunCode(UserCode);
    	Path hello = TheProcess.executeCode();
    	Map<String, Object> params = new HashMap<>();
    	FileReader fr;
		try {
			String data = "";
		    data = new String(Files.readAllBytes(Paths.get(hello+"/"+"log.txt")));
		    System.out.println(data);
		    
		    params.put("feedback", data);
		    System.out.println("done reading file");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    		 
    	
    	System.out.println("done");
    	
    	
    	return new ModelAndView("timer", params);
    }
}
