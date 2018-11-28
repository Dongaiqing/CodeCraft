import React, {Component} from 'react';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowRight} from '@fortawesome/free-solid-svg-icons';

const submit_question_url = '/post_question';
const submit_testcase_url = '/post_testcase';
const success_submit_question_msg = 'Success';
const success_submit_testcase_msg = 'Success';

export class UploadQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_submitted: false,
            msg: '',
            question_name: '',
            question_content: '',
            is_fold: true
        };
    }

    submitQuestion() {
        let user = this.props.user;
        axios.post(submit_question_url, {
            username: user,
            title: this.state.question_name,
            content: this.state.question_content
        }).then(response => {
            console.log(response.data);
            if (response.data === success_submit_question_msg) {
                this.setState({msg: 'Successfully Submitted Question!', question_name: '', question_content: ''});
            } else {
                this.setState({msg: 'Failed to submit your question!', question_name: '', question_content: ''});
            }
        })
    }

    render() {
        let submitted_msg = null;
        if (this.state.msg !== '') {
            submitted_msg = (<section>{this.state.msg}</section>);
        }
        return (
            <div className={'uploadQuestion_content'}>
                <h3>Upload your question!  {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                {
                    this.state.is_fold ? (null) : (<div>
                        <div>
                        <h4>Question Title</h4>
                        <input type={'text'} value={this.state.question_name} onChange={e => this.setState({question_name: e.target.value})}/>
                    </div>
                        <div>
                            <h4>Question Content</h4>
                            <textarea value={this.state.question_content} onChange={e => this.setState({question_content: e.target.value})}/>
                        </div>
                        <button onClick={() => this.submitQuestion()}>Submit</button>
                        {submitted_msg}
                        </div>)
                }
            </div>
        );
    }
}


export class UploadTestcase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            testcase_content: '',
            is_fold: true
        };
    }

    submitTestcase() {
        let user = this.props.user;
        let current_question = this.props.question_id;
        console.log(current_question);
        axios.post(submit_testcase_url, {
            username: user,
            question_id: current_question,
            content: this.state.testcase_content
        }).then(response => {
            if (response.data === success_submit_testcase_msg) {
                this.setState({msg: 'Successfully Submitted Testcase!', testcase_content: ''});
            } else {
                this.setState({msg: 'Failed to submit your Testcase!', testcase_content: ''});
            }
        })
    }

    render() {
        let submitted_msg = null;
        if (this.state.msg !== '') {
            submitted_msg = (<section>{this.state.msg}</section>);
        }
        return (
            <div className={'uploadTestcase_content'}>
                <h3>Upload your testcase! {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
                {
                    this.state.is_fold ? (null) : (<div>
                        <div>
                            <h4>Testcase Content</h4>
                            <textarea value={this.state.question_content} onChange={e => this.setState({testcase_content: e.target.value})}/>
                        </div>
                        <button onClick={() => this.submitTestcase()}>Submit</button>
                        {submitted_msg}
                    </div>)
                }
            </div>
        );
    }
}