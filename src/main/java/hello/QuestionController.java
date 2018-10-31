package hello;


import org.apache.commons.codec.binary.Base64;
import java.util.ArrayList;
import java.util.List;

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
import hello.service.question_dataService;
import hello.model.question_code;
import hello.model.question_data;

@Controller
public class QuestionController {

	@Autowired
    private question_dataService question_dataService;
	
	@Autowired
	 private question_codeService question_codeService;
	//
    @RequestMapping(value = "/code_test", method = RequestMethod.GET)
    public @ResponseBody List<question_data> getQuestion(
                @RequestParam("id") long id,
                @RequestParam("title") String name
    		) {
            question_data hello=new question_data();
            List<question_data> list = new ArrayList<>();
            
            
         
            
            
            
            if(id>100) {
            	hello.setId((long) 1);
            	hello.setTitle("outofbound");
            	list.add(hello);
            	return list;
            }
            list=question_dataService.findbyTitle(name);
            for(int i=0;i<list.size();i++) {
            	
            	list.get(i).setArticle(new String(Base64.decodeBase64(list.get(i).getArticle())));
            }
            
            
            // Process the request
            // Prepare the response string
            return question_dataService.findbyTitle(name);
    }
    @RequestMapping(value = "/code_test", method = RequestMethod.POST)
	@ResponseBody
    public question_code saveCode( @RequestBody question_code code) {
    	
    	if(code.getSource_code()=="") {
    		question_codeService.delete(code);
    		code.setResult("deleted");
    		return code;
    	}
    	
    	
    	
    	//System.out.println(question_codeService.findbyid(code));
    	if(question_codeService.findbyid(code)==0) {
    	
    	 //System.out.println(code.getQuestion_id());
    		question_codeService.save(code);
    		code.setSource_code("saved");
    		code.setResult("saved!");
    
    	}
    	else {
    		question_codeService.updatecode(code);
    		code.setResult("updated!");
    	}
    	
        // Process the request
        // Prepare the response string
        return code;    
    }
}



