package hello.model;

import java.io.Serializable;
import javax.persistence.*;

@Embeddable
public class FriendKeys implements Serializable {

    public FriendKeys(String id1, String id2) {
        this.id1 = id1;
        this.id2 = id2;
    }

    @Column(name = "id1", nullable = false)
    private String id1;

    @Column(name = "id2", nullable = false)
    private String id2;

    /** getters and setters **/
    /**
     * @return the id1
     */
    public String getId1() {
        return id1;
    }

    /**
     * @return the id2
     */
    public String getId2() {
        return id2;
    }

    /**
     * @param id1 the id1 to set
     */
    public void setId1(String id1) {
        this.id1 = id1;
    }

    /**
     * @param id2 the id2 to set
     */
    public void setId2(String id2) {
        this.id2 = id2;
    }
}