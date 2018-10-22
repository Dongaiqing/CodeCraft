package com.mocking.auth.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.mocking.auth.model.Client;
import com.mocking.auth.service.ClientService;

@Component
public class ClientValidator implements Validator  {

	@Autowired
    private ClientService ClientService;
	
	@Override
    public boolean supports(Class<?> aClass) {
        return ClientService.class.equals(aClass);
    }

	@Override
	public void validate(Object target, Errors errors) {
		// TODO Auto-generated method stub
		Client config=(Client) target;
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "NotEmpty");
        if (config.getName().length()< 6 || config.getName().length() > 32) {
            errors.rejectValue("name", "Size.userForm.username");
        }
        if (ClientService.findByClientname(config.getName()) != null) {
            errors.rejectValue("name", "Duplicate.userForm.username");
        }


		
	}
    
}
