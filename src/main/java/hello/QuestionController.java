package hello;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
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
    public @ResponseBody String processAJAXRequest(
                @RequestParam("id") String firstname,
                @RequestParam("lastname") String lastname   ) {
            String response = "";
            // Process the request
            // Prepare the response string
            return response;
    }
    @RequestMapping(value = "/code_test", method = RequestMethod.POST)
	@ResponseBody
    public String saveHosting( @RequestParam("source_code") String code,
    		 				   @RequestParam("language") String language
    		) {
    	question_code question_code = new question_code();
    	question_code.setLanguage(language);
    	question_code.setSource_code(code);
    	question_codeService.save(question_code);
    	String response = language;
        // Process the request
        // Prepare the response string
        return response;    
    }
}



