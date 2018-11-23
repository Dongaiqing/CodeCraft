import React, {Component} from 'react'
import axios from 'axios'

const login_url = '';
const successful_login_msg = '';

class LoginStatus extends Component {
    constructor(props) {
        super(props);
        this.state.feedback = '';
        this.url = login_url;
    }
    componentDidMount() {
        axios.post(this.url, {
            username: this.props.status.username,
            password: this.props.status.password
        }).then((response) => {
            console.log('Post', response.data);
            this.setState({feedback: response.data});
            this.props.updating_method('shouldSubmit', false);

            // if login succeeded
            if (response.data === successful_login_msg) {
                this.props.updating_method('loggedIn', true);
                this.props.updating_parent_method('loggedIn', true);
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
        return <form>
            <h2>{this.props.isLogin ? 'Login' : 'Register'}</h2>
            <div className={'form-group'}>
                <label htmlFor={username_id}>Username</label>
                <input type={'username'} id={username_id} value={this.props.status.username} name={'username'} onChange={(e) => this.updateInput(e)}/>
            </div>
            <div className={'form-group'}>
                <label htmlFor={password_id}>Password</label>
                <input type={'password'} id={password_id} value={this.props.status.password} name={'password'} onChange={(e) => this.updateInput(e)}/>
            </div>
            <button>Submit</button>
        </form>
    }
}

class LoginToggleButton extends Component {
    render() {
        return <button onClick={() => this.props.updating_method('shouldSubmit', true)}>{this.props.isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
    }
}

class LogoutButton extends Component {
    render() {
        return <button onClick={() => {this.props.updating_method('loggedIn', false); this.props.updating_parent_method('loggedIn', false);}}>Log Out</button>;
    }
}

export class LoginPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLogin: true,
            shouldSubmit: false,
            loggedIn: false
        };
    }


    updateState(key_name, value) {
        console.log('index', key_name, value);
        this.setState({
            [key_name]: value
        });
    }

    render() {
        if (this.state.loggedIn === false) {
            return (
                <div>
                    {(() => {
                        if (this.state.shouldSubmit === true) {
                            return (<LoginStatus status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}  updating_parent_method={(key_name, value) => this.props.updating_parent_method(key_name, value)}/>)
                        }
                        return (null)
                    })()}
                    <LoginForm status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}/>
                    <LoginToggleButton status={this.state} updating_method={(key_name, value) => this.updateState(key_name, value)}/>
                </div>
            );
        } else {
            return (
                <div>
                    <LogoutButton updating_method={(key_name, value) => this.updateState(key_name, value)}  updating_parent_method={(key_name, value) => this.props.updating_parent_method(key_name, value)}/>
                </div>
            );
        }
    }
}