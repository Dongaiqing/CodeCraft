package hello;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import hello.service.question_codeService;

import hello.model.question_code;

@Controller
public class QuestionController {

	@Autowired
    private question_codeService question_codeService;
    @RequestMapping(value = "/code_test", method = RequestMethod.GET)
    public @ResponseBody question_code getQuestion(
                @RequestParam("id") long id) {
            question_code hello=new question_code();
   
            
            if(id>100) {
            	hello.setId((long) 1);
            	hello.setLanguage("outofbound");
            	hello.setSource_code("outofbound");
            	return hello;
            }
            hello=question_codeService.findbyid(id);
            // Process the request
            // Prepare the response string
            return hello;
    }
    @RequestMapping(value = "/code_test", method = RequestMethod.POST)
	@ResponseBody
    public question_code saveCode( @RequestBody question_code code) {
    	
    	question_codeService.save(code);
    	
        // Process the request
        // Prepare the response string
        return code;    
    }
}



