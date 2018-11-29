import React, {Component} from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowRight} from '@fortawesome/free-solid-svg-icons';

const user_profile_fetching_url = '/get_user_profile';
const user_profile_updating_url = '/change_user_settings';
// const user_profile_deleting_url = '';

class UserProfile {
    constructor() {
        this.id = 0;
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
        this.friends = []; // list of string
        this.level = 0;
    }
}


class FriendsInfoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            profile: null
        };
    }
    componentDidMount() {
        let username = this.props.username;
        axios.get(user_profile_fetching_url, {
            params: {
                username: username
            }
        }).then(response => {
            this.setState({profile: response.data})
        })
    }
    render() {
        let profile = this.state.profile;
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
    constructor(props) {
        super(props);
        this.state = {
            is_fold: true
        }
    }
    render() {
        let arr = [];
        for (let friend of this.props.profile.friends) {
            arr.push(<li><FriendsInfoItem username={friend}/></li>);
        }
        return (
            <div className={'FriendsInfo_content'}>
                <h3>Friends  {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                <ul>{arr}</ul>
            </div>
        );
    }
}

class ItemsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_fold: true
        }
    }
    render() {
        let profile = this.props.profile;
        let arr = [];
        for (let item of profile.items) {
            arr.push(<li>{item}</li>);
        }
        return (
            <div className={'ContentsInfo_content'}>
                <h3>Achievements {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                <div className={'ContentsInfo_block'}>
                    <h4>You have eBucks left:</h4>
                    <p>${profile.eBucks}</p>
                </div>
                {
                    profile.items.length > 0 ? (
                        <div className={'ContentsInfo_block'}>
                            <h4>You have unlocked those items:</h4>
                            <ul>{arr}</ul>
                        </div>
                    ) : (null)
                }
                <div className={'ContentsInfo_block'}>
                    <h4>Your are currently at level:</h4>
                    <p>{profile.level}</p>
                </div>
            </div>
        );
    }
}

class CountsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_fold: true
        }
    }
    render() {
        let profile = this.props.profile;
        return (
            <div className={'CountsInfo_content'}>
                <h3>Statistics {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                <div className={'CountsInfo_block'}>
                    <h4>You have correctly answered questions:</h4>
                    <p>{profile.correctQuestionCount}</p>
                </div>
                <div className={'CountsInfo_block'}>
                    <h4>You have made comments:</h4>
                    <p>{profile.commentCount}</p>
                </div>
                <div className={'CountsInfo_block'}>
                    <h4>You have uploaded questions:</h4>
                    <p>{profile.uploadQuestionCount}</p>
                </div>
                <div className={'CountsInfo_block'}>
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
            password: this.state.newPassword,
            email: this.state.newEmail,
            user_id: this.props.profile.id
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
            arr.push(<div>Leave blank any input you don't want to change</div>);
            arr.push(<div>
                <label htmlFor={'settings_password'}>Change Password</label>
                <input id={'settings_password'} key={'settings_password'} type={'password'} value={this.state.newPassword} onChange={(e) => this.setState({newPassword: e.target.value})}/>
            </div>);
            arr.push(<div>
                <label htmlFor={'settings_email'}>Change Password</label>
                <input id={'settings_email'} key={'settings_email'} type={'text'} value={this.state.newEmail} onChange={(e) => this.setState({newEmail: e.target.value})}/>
            </div>);
            arr.push(<button onClick={() => this.handleSettingSubmit()}>Submit</button>);
        }
        return (
            <div className={'UserBasicInfo_content'}>
                <h2>Profile</h2>
                <div>{arr}</div>
            </div>
        );
    }
}

export default class ProfilePanel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_profile: new UserProfile()
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
                username: user
            }
        }).then((response) => {
            console.log('user profile is ', response.data, );
            this.setState({user_profile: response.data});
        })
    }

    render() {
        let user = this.props.user;
        return (
            <div className={'ProfilePanel_content'}>
                <UserBasicInfo profile={this.state.user_profile} updating_email={val => this.updatingEmail(val)}/>
                <CountsInfo profile={this.state.user_profile}/>
                <ItemsInfo profile={this.state.user_profile}/>
                <FriendsInfo profile={this.state.user_profile}/>
            </div>
        );
    }
}