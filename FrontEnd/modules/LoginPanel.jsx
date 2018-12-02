import React, {Component} from 'react';
import axios from 'axios';
import {ThemesObj} from "./fontsAndThemes";

import '../styles/LoginPanel.scss'

const login_url = '/login';
const register_url = '/registration';
const successful_login_msg = 0;

const change_styles = (name) => {
    const styles = ThemesObj.filter(item => item.name === name)[0].styles;
    let nav = document.getElementsByClassName('index_nav')[0];
    nav.style.background = styles.background;
    nav.style.color = styles.font;
    console.log(styles, styles.emphasis);

    document.querySelectorAll('.index_nav_login h2, .index_nav_login h3, .index_nav_login h4').forEach(elem => {
        elem.style.color = styles.font;
    });

    document.querySelectorAll('.index_nav_login').forEach(elem => {
        elem.style['border-bottom'] = '0.1em solid ' + styles.emphasis;
    });

    document.querySelectorAll('.index_nav_login button').forEach(elem => {
        elem.style.color = styles.font;
        elem.style.background = styles.background;
        elem.style.border = '0.2em solid ' + styles.emphasis;

        elem.addEventListener('mouseover', () => {
            if (!elem.hasOwnProperty('original_styles')) {
                elem.original_styles = {};
                elem.original_styles.color = JSON.parse(JSON.stringify(elem.style.color));
                elem.original_styles.background = JSON.parse(JSON.stringify(elem.style.background));
            }
            elem.style.color = styles.font;
            elem.style.background = styles.emphasis;
        });
        elem.addEventListener('mouseout', () => {
            elem.style.color = JSON.parse(JSON.stringify(elem.original_styles.color));
            elem.style.background = JSON.parse(JSON.stringify(elem.original_styles.background));
        });
    });


    document.querySelectorAll('.index_nav_menu a').forEach(elem => {
        elem.addEventListener('mouseover', () => {
            if (!elem.hasOwnProperty('original_styles')) {
                elem.original_styles = {};
                elem.original_styles['border-bottom'] = JSON.parse(JSON.stringify(elem.style['border-bottom']));
            }
            elem.style['border-bottom'] = '0.1em solid '+styles.emphasis;
        });
        elem.addEventListener('mouseout', () => {
            elem.style['border-bottom'] = JSON.parse(JSON.stringify(elem.original_styles['border-bottom']));
        });
    });

    ((light_color, dark_color, base_color) => {
        let root = document.getElementById('reactdom');
        let canvas = document.createElement('canvas');
        let view_width = root.offsetWidth;
        let view_height = root.offsetHeight;
        canvas.width = view_width;
        canvas.height = view_height;
        canvas.style['image-rendering'] = 'pixelated';
        root.appendChild(canvas);
        let ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0.3;

        const colors = [light_color, dark_color, base_color];
        for (let i = 0; i < 35; i += 1) {
            ctx.beginPath();
            ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
            let x = Math.floor(Math.random()*view_width) + 1;
            let y = Math.floor(Math.random()*view_height) + 1;
            let radius = Math.floor(Math.random()*20) + 5;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            if (i % 2 === 1) {
              ctx.fill();
            } else {
                ctx.lineWidth = Math.floor(Math.random()*3) + 1;
                ctx.stroke();
            }
        }
        root.removeChild(canvas);
        root.style['background-image'] = 'url('+canvas.toDataURL()+')';
    })(styles.background, styles.emphasis, '#E5E7E9');
};

class LoginStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback: ''
        };
    }
    componentDidMount() {
        axios.post(this.props.status.isLogin ? login_url : register_url, {
            username: this.props.status.username,
            password: this.props.status.password,
            email: this.props.status.email
        }).then((response) => {
            console.log('Post in LoginStatus', response.data);
            // if login succeeded
            if (response.data.msg === successful_login_msg) {
                this.setState({feedback: 'Successfully ' + (this.props.status.isLogin ? 'Logged in!' : 'Registered!')});
                this.props.updating_parent_method('loggedIn', true);
                this.props.updating_method('shouldSubmit', false);
                this.props.updating_parent_method('user', this.props.status.username);
                console.log(response.data.preference)
                this.props.updating_parent_method('preference', response.data.preference);
                if (response.data.preference.theme_name !== 'default') {
                    change_styles(response.data.preference.theme_name);
                }
            } else {
                this.setState({feedback: 'Failed to ' + (this.props.status.isLogin ? 'log in!' : 'register!')});
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        if (this.state.feedback === '') {
            return (null);
        } else {
            return <section className={'error_section'}>{this.state.feedback}</section>;
        }
    }
}

class LoginForm extends Component {
    updateInput(e) {
        this.props.updating_method(e.target.name, e.target.value);
    }
    render() {
        const username_id = 'login_username_input';
        const password_id = 'login_password_input';
        let register_email = null;
        if (this.props.status.isLogin === false) {
            register_email = (<div className={'form-group'}><label htmlFor={'useremail_id'}>Email</label>
                <input type={'text'} id={'useremail_id'} name={'email'} value={this.props.status.email} onChange={(e) => this.updateInput(e)}/></div>);
        }
        return <form>
            <h2>{this.props.status.isLogin ? 'Login' : 'Register'}</h2>
            <div className={'form-group'}>
                <label htmlFor={username_id}>Username</label>
                <input type={'text'} id={username_id} value={this.props.status.username} name={'username'} onChange={(e) => this.updateInput(e)}/>
            </div>
            <div className={'form-group'}>
                <label htmlFor={password_id}>Password</label>
                <input type={'password'} id={password_id} value={this.props.status.password} name={'password'} onChange={(e) => this.updateInput(e)}/>
            </div>
            {register_email}
            <button onClick={(e) => {e.preventDefault(); let prev_status = this.props.status.shouldSubmit; this.props.updating_method('shouldSubmit', !prev_status)}}>Submit</button>
        </form>
    }
}

class LoginToggleButton extends Component {
    render() {
        return <button onClick={() => this.props.updating_method('isLogin', !this.props.status.isLogin)}>{this.props.status.isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
    }
}

class LogoutButton extends Component {
    render() {
        return <button onClick={() => {this.props.updating_parent_method('loggedIn', false); window.location.reload();}}>Log Out</button>;
    }
}

export default class LoginPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            isLogin: true,
            shouldSubmit: false
        };
    }


    updateState(key_name, value) {
        this.setState({
            [key_name]: value
        });
    }

    render() {
        if (this.props.loggedIn === false) {
            return (
                <div className={this.props.className}>
                    <LoginForm loggedIn={this.props.loggedIn} status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}/>
                    {
                        this.state.shouldSubmit ? (<LoginStatus status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}  updating_parent_method={(key_name, value) => this.props.updating_parent_method(key_name, value)}/>) : (null)
                    }
                    <LoginToggleButton status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}/>
                </div>
            );
        } else {
            return (
                <div className={this.props.className}>
                    <h4>Welcome {this.state.username}</h4>
                    <LogoutButton updating_parent_method={(key_name, value) => this.props.updating_parent_method(key_name, value)}/>
                </div>
            );
        }
    }
}