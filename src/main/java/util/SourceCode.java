package util;

public class SourceCode {
	private String title;
	private String code;
	private String fileExt;

	/**
	 * @return the fileExt
	 */
	public String getFileExt() {
		return fileExt;
	}

	/**
	 * @param fileExt the fileExt to set
	 */
	public void setFileExt(String fileExt) {
		this.fileExt = fileExt;
	}

	public SourceCode(String title, String code) {
		super();
		this.title = title;
		this.code = code;
	}

	public SourceCode(String title, String code, String fileExt) {
		super();
		this.title = title;
		this.code = code;
		this.fileExt = fileExt;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}
	
}
