import React, {Component} from 'react'
import axios from 'axios'

const login_url = '/login';
const register_url = '/registration';
const successful_login_msg = 0;

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
            if (response.data === successful_login_msg) {
                this.setState({feedback: 'Successfully ' + (this.props.status.isLogin ? 'Logged in!' : 'Registered!')});
                this.props.updating_parent_method('loggedIn', true);
                this.props.updating_method('shouldSubmit', false);
                this.props.updating_parent_method('user', this.props.status.username);
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
            return <section>{this.state.feedback}</section>;
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
        return <button onClick={() => {this.props.updating_parent_method('loggedIn', false);}}>Log Out</button>;
    }
}

export class LoginPanel extends Component {
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
                <div>
                    {
                        this.state.shouldSubmit ? (<LoginStatus status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}  updating_parent_method={(key_name, value) => this.props.updating_parent_method(key_name, value)}/>) : (null)
                    }
                    <LoginForm loggedIn={this.props.loggedIn} status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}/>
                    <LoginToggleButton status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}/>
                </div>
            );
        } else {
            return (
                <div>
                    <LogoutButton updating_parent_method={(key_name, value) => this.props.updating_parent_method(key_name, value)}/>
                </div>
            );
        }
    }
}