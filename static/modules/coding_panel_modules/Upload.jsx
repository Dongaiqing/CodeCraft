import React, {Component} from 'react';
import axios from 'axios';

const submit_question_url = '';
const submit_testcase_url = '';
const success_submit_question_msg = '';
const success_submit_testcase_msg = '';

export class UploadQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_submitted: false,
            msg: '',
            question_name: '',
            question_content: ''
        };
    }

    submitQuestion() {
        let user = this.props.user;
        axios.post(submit_question_url, {
            // TODO: params
        }).then(response => {
            if (response.data === success_submit_question_msg) {
                this.setState({msg: 'Successfully Submitted Question!'});
            } else {
                this.setState({msg: 'Failed to submit your question!'});
            }
        })
    }

    render() {
        let submitted_msg = null;
        if (this.state.is_submitted) {
            submitted_msg = (<section>{this.state.msg}</section>);
        }
        return (
            <div>
                <div>
                    <h4>Question Title</h4>
                    <input type={'text'} value={this.state.question_name} onChange={e => this.setState({question_name: e.target.value})}/>
                </div>
                <div>
                    <h4>Question Content</h4>
                    <textarea value={this.state.question_content} onChange={e => this.setState({question_name: e.target.value})}/>
                </div>
                <button onClick={() => this.submitQuestion()}>Submit</button>
                {submitted_msg}
            </div>
        );
    }
}


export class UploadTestcase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_submitted: false,
            msg: '',
            testcase_content: ''
        };
    }

    submitTestcase() {
        let user = this.props.user;
        let current_question = this.props.question_id;
        axios.post(submit_question_url, {
            // TODO: params
        }).then(response => {
            if (response.data === success_submit_question_msg) {
                this.setState({msg: 'Successfully Submitted Testcase!'});
            } else {
                this.setState({msg: 'Failed to submit your Testcase!'});
            }
        })
    }

    render() {
        let submitted_msg = null;
        if (this.state.is_submitted) {
            submitted_msg = (<section>{this.state.msg}</section>);
        }
        return (
            <div>
                <div>
                    <h4>Testcase Content</h4>
                    <textarea value={this.state.question_content} onChange={e => this.setState({testcase_content: e.target.value})}/>
                </div>
                <button onClick={() => this.submitTestcase()}>Submit</button>
                {submitted_msg}
            </div>
        );
    }
}