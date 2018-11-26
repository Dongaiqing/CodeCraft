package hello.model;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "user")
public class user {

    @Id
    private String username;
    private String password;
    private String email;
    private String picSource;
    private int correctQuestionCount;
    private int commentCount = 0;
    private int uploadQuestionCount = 0;
    private int uploadTestCaseCount = 0;
    private int eBucks = 0;
    private int level = 0;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @param commentCount the commentCount to set
     */
    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    /**
     * @return the commentCount
     */
    public int getCommentCount() {
        return commentCount;
    }

    /**
     * @param eBucks the eBucks to set
     */
    public void seteBucks(int eBucks) {
        this.eBucks = eBucks;
    }

    /**
     * @return the eBucks
     */
    public int geteBucks() {
        return eBucks;
    }

    /**
     * @return the correctQuestionCount
     */
    public int getCorrectQuestionCount() {
        return correctQuestionCount;
    }

    /**
     * @param correctQuestionCount the correctQuestionCount to set
     */
    public void setCorrectQuestionCount(int correctQuestionCount) {
        this.correctQuestionCount = correctQuestionCount;
    }

    /**
     * @return the level
     */
    public int getLevel() {
        return level;
    }

    /**
     * @param level the level to set
     */
    public void setLevel(int level) {
        this.level = level;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the picSource
     */
    public String getPicSource() {
        return picSource;
    }

    /**
     * @param picSource the picSource to set
     */
    public void setPicSource(String picSource) {
        this.picSource = picSource;
    }

    /**
     * @return the uploadQuestionCount
     */
    public int getUploadQuestionCount() {
        return uploadQuestionCount;
    }

    /**
     * @param uploadQuestionCount the uploadQuestionCount to set
     */
    public void setUploadQuestionCount(int uploadQuestionCount) {
        this.uploadQuestionCount = uploadQuestionCount;
    }

    /**
     * @return the uploadTestCaseCount
     */
    public int getUploadTestCaseCount() {
        return uploadTestCaseCount;
    }

    /**
     * @param uploadTestCaseCount the uploadTestCaseCount to set
     */
    public void setUploadTestCaseCount(int uploadTestCaseCount) {
        this.uploadTestCaseCount = uploadTestCaseCount;
    }

}