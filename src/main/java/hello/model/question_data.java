package hello.model;

import java.util.Set;
import javax.persistence.*;

@Entity
@Table(name = "question_data")
public class question_data {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
	private String title;
    private String article;

    
    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}

	public String getArticle() {
		return article;
	}
	public void setArticle(String article) {
		this.article = article;
	}
    
}
