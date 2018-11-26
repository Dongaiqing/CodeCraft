package hello;

import org.json.JSONArray;
import org.json.JSONObject;
import util.RunCode;
import util.SourceCode;

import org.apache.catalina.User;
import org.apache.commons.codec.binary.Base64;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
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
    public long registration(@RequestBody user user) {

//        if (userService.findQuantity(user.getUsername()) == 0) {
        userService.save(user);
//        } else {
//            return 0;
//        }

        user usr = userService.findByName(user.getUsername());

        return usr == null ? 1 : 0;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestBody user user) {

        user temp = userService.findByName(user.getUsername());

        return temp.getUsername();
    }

    @RequestMapping(value = "/getProfile", method = RequestMethod.POST)
    public @ResponseBody JSONObject getUserProfile(
                @RequestParam("name") String name) {
        JSONObject response = new JSONObject();
        user user = userService.findByName(name);
        response.put("username", user.getUsername());
        response.put("userEmail", user.getEmail());
        response.put("userPicSource", user.getPicSource());
        response.put("correctQuestionCount", user.getCorrectQuestionCount());
        response.put("commentCount", user.getCommentCount());
        response.put("uploadQuestionCount", user.getUploadQuestionCount());
        response.put("uploadTestCaseCount", user.getUploadTestCaseCount());
        response.put("eBucks", user.geteBucks());
        response.put("level", user.getLevel());
        JSONArray friends = new JSONArray();
        response.put("friends", friends);

        return response;
    }
}
