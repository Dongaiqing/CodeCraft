
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
    private String imagesource;
    private String user;
    private String comment;
    private int upvotenum;
    private int downvotenum;
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
		return imagesource;
	}
	public void setImagesource(String imagesource) {
		this.imagesource = imagesource;
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
		return upvotenum;
	}
	public void setUpvotenum(int upvotenum) {
		this.upvotenum = upvotenum;
	}
	public int getDownvotenum() {
		return downvotenum;
	}
	public void setDownvotenum(int downvotenum) {
		this.downvotenum = downvotenum;
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
