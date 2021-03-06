import React, {Component} from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowRight} from '@fortawesome/free-solid-svg-icons';

import {Fonts, Themes} from "./fontsAndThemes";

import "../styles/ProfilePanel.scss";

const user_profile_fetching_url = '/get_user_profile';
const user_profile_updating_url = '/change_user_settings';
const add_friend_url = '/add_friend_by_search';

const change_font_url = '/change_font';
const change_theme_url = '/change_theme';

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
        axios.get(user_profile_fetching_url, {
            params: {
                username: this.props.friend_username
            }
        }).then(response => {
            this.setState({profile: response.data})
        })
    }
    render() {
        let profile = this.state.profile;
        if (profile === null) {
            return (null);
        }
        return (
            <div key={'friendsInfoItem_'+profile.username} className={'friendsInfoItem_card'}>
                <div>
                    <div onClick={() => this.setState({clicked: !this.state.clicked})}>
                        <h4>{profile.username}</h4>
                    </div>
                    {
                        this.state.clicked ? (
                            <div className={'friendsInfoItem_list'}>
                                <dl className={'friendsInfoItem_list_flex'}>
                                    <dt>Submitted Solutions</dt>
                                    <dd>{profile.correctQuestionCount}</dd>

                                    <dt>Uploaded Questions</dt>
                                    <dd>{profile.uploadQuestionCount}</dd>

                                    <dt>Unlocked Items</dt>
                                    <dd>{profile.items.length}</dd>

                                    <dt>Level</dt>
                                    <dd>{profile.level}</dd>
                                </dl>
                            </div>
                        ) : (null)
                    }
                </div>
            </div>
        );
    }
}

class FriendsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_fold: true,
            search_string: '',
            show_error: false
        }
    }

    addFriends() {
        axios.post(add_friend_url, {
            username: this.props.current_user,
            search_string: this.state.search_string
        }).then(response => {
            if (response.data.msg !== 'Success') {
                this.setState({show_error: true})
            } else {
                this.setState({show_error: false});
                this.props.updating_profile(response.data.userProfile)
            }
        })
    }

    render() {
        let arr = [];
        for (let friend of this.props.profile.friends) {
            arr.push(<div><FriendsInfoItem friend_username={friend}/></div>);
        }
        const friends_arr = <div className={'friendsInfoItem_flex'}>{arr}</div>;
        const add_friends = (<div>
            <label>Add friends by ID/Username</label>
            <input type={'text'} value={this.state.search_string} onChange={e => this.setState({search_string: e.target.value})}/>
            <button onClick={() => this.addFriends()}>Submit</button>
            {this.state.show_error ? (<article>Failed to add friends!</article>) : (null)}
        </div>);
        return (
            <div className={'FriendsInfo_content'}>
                <h3>Friends  {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                {
                    this.state.is_fold ? (null) : (
                        <div>
                            {add_friends}
                            {friends_arr}
                        </div>
                    )
                }
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
            <div className={'ItemsInfo_content'}>
                <h3>Achievements {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                {
                    this.state.is_fold ? (null) : (
                        <div className={'ItemsInfo_flex'}>
                        <div className={'ItemsInfo_block'}>
                            <h4>You have eBucks left:</h4>
                            <p>${profile.eBucks}</p>
                        </div>
                        {
                            profile.items.length > 0 ? (
                                <div className={'ItemsInfo_block'}>
                                    <h4 style={{marginBottom: '0.5em'}}>You have unlocked those items:</h4>
                                    <div style={{height: '5em', overflowY: 'auto'}}><ul>{arr}</ul></div>
                                </div>
                            ) : (null)
                        }
                        <div className={'ItemsInfo_block'}>
                            <h4>Your are currently at level:</h4>
                            <p>{profile.level}</p>
                        </div>
                    </div>
                    )
                }
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
                {
                    this.state.is_fold ? (null) : (
                        <div className={'CountsInfo_flex'}>
                        <div className={'CountsInfo_block'}>
                        <h4>You have submitted answers:</h4>
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
                    </div>
                    )
                }
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
        let profile = this.props.profile;
        console.log(profile.userPicSource)
        return (
            <div className={'UserBasicInfo_content'}>
                <h2>Profile</h2>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{order: '1', marginRight: '1em', whiteSpace: 'nowrap'}}>
                        <span style={{display: 'inline-block', height: '100%', verticalAlign: 'middle'}}/>
                        <img style={{maxWidth: '5em', maxHeight: '5em', verticalAlign: 'middle', boxShadow: '0 0 0.2em grey'}} key={'UserBasicInfo_img'} src={profile.userPicSource} alt={profile.username}/>
                    </div>
                    <div style={{order: '2'}}>
                        {
                            this.state.displaySettings ? (
                                <div>
                                    <div key={'UserBasicInfo_changeMSG'}>Leave blank any input you don't want to change</div>
                                    <div key={'UserBasicInfo_changePASSWORD'}>
                                        <label htmlFor={'settings_password'}>Change Password</label>
                                        <input id={'settings_password'} key={'settings_password'} type={'password'} value={this.state.newPassword} onChange={(e) => this.setState({newPassword: e.target.value})}/>
                                    </div>
                                    <div key={'UserBasicInfo_changeEMAIL'}>
                                        <label htmlFor={'settings_email'}>Change Email</label>
                                        <input id={'settings_email'} key={'settings_email'} type={'text'} value={this.state.newEmail} onChange={(e) => this.setState({newEmail: e.target.value})}/>
                                    </div>
                                    <button key={'UserBasicInfo_changeSUBMIT'} onClick={() => this.handleSettingSubmit()}>Submit</button>
                                    <button onClick={() => this.setState({displaySettings: false})}>Back</button>
                                </div>
                            ) : (
                                <div>
                                    <h3 key={'UserBasicInfo_username'}>{profile.username}</h3>
                                    <h4 key={'UserBasicInfo_useremail'}>{profile.userEmail}</h4>
                                    <button key={'UserBasicInfo_changeBTN'} onClick={() => this.setState({displaySettings: true})}>Change Email or Password</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

class PreferenceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_font: 'default',
            current_theme: 'default',
            is_fold: true
        }
    }

    changeFont() {
        console.log(this.state.current_font)
        axios.post(change_font_url,  {
            username: this.props.profile.username,
            new_font: this.state.current_font
        }).then(response => {
            window.location.reload();
        })
    }
    
    changeTheme() {
        axios.post(change_theme_url, {
            username: this.props.profile.username,
            new_theme: this.state.current_theme
        }).then(response => {
            window.location.reload();
        })
    }

    render() {
        let profile = this.props.profile;
        const all_themes = profile.items.filter(item => Themes.includes(item));
        const all_fonts = profile.items.filter(item => Fonts.includes(item));
        const fonts_arr = all_fonts.map(item => <option value={item}>{item}</option>);
        fonts_arr.unshift(<option value={'default'}>{'default'}</option>);
        const themes_arr = all_themes.map(item => <option value={item}>{item}</option>);
        themes_arr.unshift(<option value={'default'}>{'default'}</option>);
        return (
            <div className={'PreferencesPanel_content'}>
                <h3>Preferences {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                {
                    this.state.is_fold ? (null) : (
                        <div>
                            <p>After choosing new fonts/themes, please refresh your page!</p>
                            <div>
                                <div>
                                    <label htmlFor={'ProfilePanel_select_fonts'}>Change fonts here!</label>
                                    <select onChange={e => this.setState({current_font: e.target.value})} id={'ProfilePanel_select_fonts'}>{fonts_arr}</select>
                                    <button onClick={() => this.changeFont()}>Submit</button>
                                </div>
                                <div>
                                    <label htmlFor={'ProfilePanel_select_themes'}>Change themes here!</label>
                                    <select onChange={e => this.setState({current_theme: e.target.value})} id={'ProfilePanel_select_themes'}>{themes_arr}</select>
                                    <button onClick={() => this.changeTheme()}>Submit</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
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

    updateProfile(friends_profile) {
        let prev_user_profile = JSON.parse(JSON.stringify(this.state.user_profile));
        prev_user_profile.friends.push(friends_profile.username);
        this.setState({user_profile: prev_user_profile});
    }

    render() {
        let user = this.props.user;
        return (
            <div className={'ProfilePanel_content'}>
                <UserBasicInfo profile={this.state.user_profile} updating_email={val => this.updatingEmail(val)}/>
                <CountsInfo profile={this.state.user_profile}/>
                <ItemsInfo profile={this.state.user_profile}/>
                <FriendsInfo updating_profile={(friend_profile) => this.updateProfile(friend_profile)} current_user={user} profile={this.state.user_profile}/>
                <PreferenceInfo profile={this.state.user_profile}/>
            </div>
        );
    }
}