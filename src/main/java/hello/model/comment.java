
package hello.model;

import javax.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "comment")
public class comment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private long firstlevelid;
    private String imageSource;
    private String user;
    private String comment;
    private int upvoteNum;
    private int downvoteNum;
    @JoinTable(
            name = "comments",
            joinColumns = @JoinColumn(
                    name = "firstcomment",
                    referencedColumnName = "id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "secondcomment",
                    referencedColumnName = "id"
            )
    )
    @ManyToMany
    private List<comment> comments;
	public String getImagesource() {
		return imageSource;
	}
	public void setImagesource(String imagesource) {
		this.imageSource = imagesource;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public int getUpvotenum() {
		return upvoteNum;
	}
	public void setUpvotenum(int upvotenum) {
		this.upvoteNum = upvotenum;
	}
	public int getDownvotenum() {
		return downvoteNum;
	}
	public void setDownvotenum(int downvotenum) {
		this.downvoteNum = downvotenum;
	}
	public List<comment> getComments() {
		return comments;
	}
	public void setComments(List<comment> comments) {
		this.comments = comments;
	}
	public long getFirstlevelid() {
		return firstlevelid;
	}
	public void setFirstlevelid(long firstlevelid) {
		this.firstlevelid = firstlevelid;
	}


	
	







}
