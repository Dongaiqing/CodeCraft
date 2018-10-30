package hello.model;

import java.util.Set;


import javax.persistence.*;


@Entity
@Table(name = "question_code")
public class question_code {

	private String source_code;
	private String language;
	private Long id;

	@Id
	public long getId() {
		return id;
	}
	public void setId(long id) {
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
	
}
