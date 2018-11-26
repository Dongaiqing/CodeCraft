import React, {Component} from 'react';
import axios from 'axios';

const user_profile_fetching_url = '';
const user_profile_updating_url = '';
const get_friends_list_url = '';
const get_friends_info_url = '';
// const user_profile_deleting_url = '';

class UserProfile {
    constructor() {
        this.id = '';
        this.username = '';
        this.userEmail = '';
        this.userNewPassword = '';
        this.userPicSource = '';
        this.correctQuestionCount = 0;
        this.commentCount = 0;
        this.uploadQuestionCount = 0;
        this.uploadTestCaseCount = 0;
        this.eBucks = 0;
        this.items = []; // assume items are just texts
        this.friends = [];
        this.level = 0;
    }
}


class FriendsInfoItem extends Component {
    constructor(props) {
        super(props);
        this.state.clicked = false;
    }
    render() {
        let profile = this.props.profile;
        if (this.state.clicked) {
            return (
                <div>
                    <div onClick={() => this.setState({clicked: false})}>
                        <span>{profile.username}</span>
                        <span>{profile.level}</span>
                    </div>
                    <div>
                        <dl>
                            <dt>Correct Questions</dt>
                            <dd>{profile.correctQuestionCount}</dd>

                            <dt>Uploaded Questions</dt>
                            <dd>{profile.uploadQuestionCount}</dd>

                            <dt>Uploaded Testcases</dt>
                            <dd>{profile.uploadTestCaseCount}</dd>

                            <dt>Unlocked Items</dt>
                            <dd>{profile.items.length}</dd>
                        </dl>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div onClick={() => this.setState({clicked: true})}>
                        <span>{profile.username}</span>
                        <span>{profile.level}</span>
                    </div>
                </div>
            );
        }
    }
}

class FriendsInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            friendsList: []
        };
    }

    componentDidMount() {
        let profile = this.props.profile;
        axios.get(get_friends_list_url, {
            params: {
                // TODO: params
            }
        }).then((response) => {
            console.log('friends list: ', response.data);
            this.setState({friendsList: response.data});
        })
    }

    render() {
        let arr = [];
        for (let friend of this.state.friendsList) {
            arr.push(<li><FriendsInfoItem profile={friend}/></li>);
        }
        return (
            <div>
                <ul>{arr}</ul>
            </div>
        );
    }
}

class ItemsInfo extends Component {
    render() {
        let profile = this.props.profile;
        let arr = [];
        for (let item of profile.items) {
            arr.push(<p>{item}</p>);
        }
        return (
            <div>
                <div>
                    <h4>You have eBucks left:</h4>
                    <p>${profile.eBucks}</p>
                </div>
                {
                    profile.items.length > 0 ? (
                        <div>
                            <h4>You have unlocked those items:</h4>
                            <div>{arr}</div>
                        </div>
                    ) : (null)
                }
                <div>
                    <h4>Your are currently at level:</h4>
                    <p>{profile.level}</p>
                </div>
            </div>
        );
    }
}

class CountsInfo extends Component {
    render() {
        let profile = this.props.profile;
        return (
            <div>
                <div>
                    <h4>You have correctly answered questions:</h4>
                    <p>{profile.correctQuestionCount}</p>
                </div>
                <div>
                    <h4>You have made comments:</h4>
                    <p>{profile.commentCount}</p>
                </div>
                <div>
                    <h4>You have uploaded questions:</h4>
                    <p>{profile.uploadQuestionCount}</p>
                </div>
                <div>
                    <h4>You have submitted testcases:</h4>
                    <p>{profile.uploadTestCaseCount}</p>
                </div>
            </div>
        );
    }
}

class UserBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySettings : false,
            newPassword: '',
            newEmail: ''
        };
    }
    handleSettingSubmit() {
        axios.post(user_profile_updating_url, {
            // TODO: params
        }).then((response) => {
            this.setState({displaySettings: false});
            if (this.state.newEmail !== '') {
                this.props.updating_email(this.state.newEmail);
            }
        })
    }
    render() {
        // TODO: user theme settings
        let arr = [];
        let profile = this.props.profile;
        arr.push(<img src={profile.userPicSource}/>);
        if (this.state.displaySettings === false) {
            arr.push(<h3>{profile.username}</h3>);
            arr.push(<h4>{profile.userEmail}</h4>);
            arr.push(<button onClick={() => this.setState({displaySettings: true})}>Change Email or Password</button>);
        } else {
            arr.push(<input type={'password'} value={this.state.newPassword} onChange={(e) => this.setState({newPassword: e.target.value})}/>);
            arr.push(<input type={'text'} value={this.state.newEmail} onChange={(e) => this.setState({newEmail: e.target.value})}/>);
            arr.push(<button onClick={() => this.handleSettingSubmit()}>Submit</button>);
        }
        return (
            <div>{arr}</div>
        );
    }
}

export class ProfilePanel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_profile: null
        }
    }
    updatingEmail(newEmail) {
        let prev_profile = JSON.parse(JSON.stringify(this.state.user_profile));
        prev_profile.userEmail = newEmail;
        this.setState({user_profile: prev_profile});
    }


    componentDidMount() {
        let user = this.props.user;
        axios.get(user_profile_fetching_url, {
            params: {
                // TODO: params
            }
        }).then((response) => {
            console.log('user profile is ', response.data);
            this.setState({user_profile: response.data});
        })
    }

    render() {
        let user = this.props.user;
        return (
            <div>
                <UserBasicInfo profile={this.state.user_profile} updating_email={val => this.updatingEmail(val)}/>
                <CountsInfo profile={this.state.user_profile}/>
                <ItemsInfo profile={this.state.user_profile}/>
                <FriendsInfo profile={this.state.user_profile}/>
            </div>
        );
    }
}