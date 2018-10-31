package hello.model;

import java.util.Set;


import javax.persistence.*;


@Entity 
@Table(name = "question_code")
public class question_code {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String source_code;
	private String language;
	private Long user_id;
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getSource_code() {
		return source_code;
	}
	
	public void setSource_code(String source_code) {
		this.source_code = source_code;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	public Long getUser_id() {
		return user_id;
	}
	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}
	
}
