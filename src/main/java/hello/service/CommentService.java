package hello.service;

import java.util.List;

import hello.model.comment;

public interface CommentService {
    void save(comment comment);
    List<comment> findcomment(int id);

}
