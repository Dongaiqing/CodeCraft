package hello.model;

import java.util.Set;

import javax.persistence.*;

import hello.model.FriendKeys;

@Entity
@Table(name = "friends")
public class Friends {

    @EmbeddedId
    private FriendKeys friendKey;

    /**
     * @param friendKeys the friendKeys to set
     */
    public void setFriendKeys(FriendKeys friendKeys) {
        this.friendKey = friendKeys;
    }

    /**
     * @return the friendKey
     */
    public FriendKeys getFriendKey() {
        return friendKey;
    }
}
