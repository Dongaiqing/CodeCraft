import React, {Component} from 'react'
import axios from 'axios'

const sendURL = '';
const receieveURL = '';


class GetContainer extends Component {
    constructor() {
        super();
        this.url = sendURL;
    }

    updateStatus(content) {
        this.props.updating_method('should_send_request', false);
        this.props.updating_method('current_content', content);
    }

    componentDidMount() {
        console.log({
            id: this.props.current_number
        });
        axios.get(this.url, {
            params: {
                id: this.props.current_number
            }
        }).then((response) => {
            console.log(response);
            this.updateStatus(JSON.stringify(response));
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return <div> </div>;
    }
}

class PostContainer extends Component {
    constructor() {
        super();
        this.url = receieveURL;
    }

    updateStatus(content) {
        this.props.updating_method('should_send_request', false);
        this.props.updating_method('current_content', content);
    }

    componentDidMount() {
        console.log({
            source_code: this.props.content, // TOD
            language: this.props.language
        });
        axios.post(this.url, {
            source_code: this.props.content, // TOD
            language: this.props.language
        }).then((response) => {
            console.log(response);
            this.updateStatus(JSON.stringify(response));
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return <div> </div>;
    }
}

class QuestionGenerateButton extends Component {
    sendGetRequest() {
        this.props.updating_method('should_send_request', true);
    }
    render() {
        return <button onClick={() => this.sendGetRequest()}>Next Question!</button>;
    }
}

class QuestionSubmitButton extends Component {
    sendPostRequest() {
        this.props.updating_method('should_send_request', true);
    }
    render() {
        return <button onClick={() => this.sendPostRequest()}>Submit Question!</button>;
    }
}

class QuestionIDInput extends Component {
    render() {
        return [
            <input
                key={'QuestionIDInput_input'}
                type={'number'}
                name={'question_number'}
                id={'QuestionIDInput'}
                value={this.props.current_number}
                onChange={(e) => this.props.updating_method('current_question_number', e.target.value)}
            />,
            <label key={'QuestionIDInput_label'} htmlFor={'QuestionIDInput'}>Put your question ID here!</label>
        ];
    }
}
export class QuestionDisplayPanel extends Component {
    constructor() {
        super();
        this.state = {
            should_send_request: false,
            current_content: '',
            current_question_number: 0
        };
    }

    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }
    render() {
        const state = this.state;
        const arr_elem = [];
        if (state.current_content !== '' && state.should_send_request === false) {
            arr_elem.push(<section key={'QuestionDisplayPanel_section'}>{state.current_content}</section>);
        }
        if (state.should_send_request === true) {
            arr_elem.push(<GetContainer key={'QuestionDisplayPanel_GetContainer'} updating_method={(key, val) => this.updateState(key, val)} current_number={this.state.current_question_number}/>);
        }
        arr_elem.push(<QuestionGenerateButton key={'QuestionDisplayPanel_QuestionGenerateButton'} updating_method={(key, val) => this.updateState(key, val)}/>);
        arr_elem.push(<QuestionIDInput key={'QuestionDisplayPanel_QuestionIDInput'} updating_method={(key, val) => this.updateState(key, val)} current_number={this.state.current_question_number}/>);
        return arr_elem;
    }
}

export class QuestionFeedbackPanel extends Component {
    constructor() {
        super();
        this.state = {
            should_send_request: false,
            current_content: ''
        };
    }
    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }
    render() {
        const state = this.state;
        const arr_elem = [];
        if (state.current_content !== '' && state.should_send_request === false) {
            arr_elem.push(<section key={'QuestionFeedbackPanel_section'}>{state.current_content}</section>);
        }
        if (state.should_send_request === true) {
            arr_elem.push(<PostContainer key={'QuestionFeedbackPanel_PostContainer'} updating_method={(key, val) => this.updateState(key, val)} content={this.props.content} language={this.props.language}/>);
        }
        arr_elem.push(<QuestionSubmitButton key={'QuestionFeedbackPanel_QuestionSubmitButton'} updating_method={(key, val) => this.updateState(key, val)}/>);
        return arr_elem;
    }
}
