package com.mocking.auth.model;

import javax.persistence.*;

/*@author feifei*/

@Entity
@Table(name = "client")
public class Client {

	 private long id;
	 private String name;
	 private String email;
	 private String type;
	 private String address1;
	 private String address2;
	 private String zip_code;
	 
	 public Client(String name, String email, String type, String address1, String address2, String zip_code) {
			this.name = name;
			this.email = email;
			this.type = type;
			this.address1 = address1;
			this.address2 = address2;
			this.zip_code = zip_code;
		}
	 
	 public Client() {
		// TODO Auto-generated constructor stub
	}


	@Id
	 @Column(name = "client_id")
     @GeneratedValue
	 public long getId() {
	 return id;
	 }
	 
	 public void setId(long id) {
	    this.id = id;
	 }
	 
	 public String getName() {
	    return name;
	 }
	 
	 public void setName(String name) {
		 this.name = name;
	 }
	 
	 public String getEmail() {
	     return email;
	 }
	 
	 public void setEmail(String email) {
	    this.email = email;
	 }

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getZip_code() {
		return zip_code;
	}

	public void setZip_code(String zip_code) {
		this.zip_code = zip_code;
	}  
}
