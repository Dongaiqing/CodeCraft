import React, {Component} from 'react';
import axios from 'axios';
import {Editor, staticSettings} from './coding_panel_modules/Editor';
import {QuestionFeedbackPanel, QuestionDisplayPanel} from './coding_panel_modules/Question';
import {Comment} from "./coding_panel_modules/Comment";
import {Rating} from "./coding_panel_modules/Rating";
import {UploadQuestion} from "./coding_panel_modules/Upload";
import {Tag} from "./coding_panel_modules/Tag";

import "../styles/CodingPanel.scss";

const user_profile_fetching_url = '/get_user_profile';

export default class CodingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_profile: {},
            editor_content: '',
            editor_language: '',
            editor_theme: '',
            current_question_name: '',
            current_question_id: 0,
            current_question_state: {}
        };
    }

    updateState(key_name, value) {
        console.log('index', key_name, value);
        this.setState({
            [key_name]: value
        });
    }

    componentDidMount() {
        let user = this.props.user;
        axios.get(user_profile_fetching_url, {
            params: {
                username: user
            }
        }).then((response) => {
            this.setState({user_profile: response.data});
        })
    }

    render() {
        console.log('this.state.current_question_id', this.state.current_question_id);
        return (
            <div className={'codingpanel_content'}>
                <QuestionDisplayPanel
                    key={'QuestionDisplayPanel'}
                    updating_method={(key_name, value) => this.updateState(key_name, value)}
                    current_question_name={this.state.current_question_name}
                    current_question_id={this.state.current_question_id}
                />
                <div className={'questionMeta_content'}>
                    {
                        this.state.current_question_id === 0 ? (null) : (<div className={'questionMeta_flex'}>
                            <Rating
                                key={'CodingRating'}
                                user={this.props.user}
                                question_id={this.state.current_question_id}
                            />
                            <Tag
                                key={'CodingTags'}
                                user={this.props.user}
                                question_id={this.state.current_question_id}
                            />
                        </div>)
                    }
                </div>

                <Editor
                    key={'Editor'}
                    updating_content={(key_name, value) => this.updateState(key_name, value)}
                    content={this.state.editor_content}
                />
                {
                    this.state.current_question_id === 0 ? (<section className={'questionFeedbackPanel_content'} style={{paddingBottom:'1em', paddingTop: '1em'}}>Submit after you have chosen a question!</section>) : (<QuestionFeedbackPanel
                        key={'QuestionFeedbackPanel'}
                        content={this.state.editor_content}
                        language={this.state.editor_language}
                        updating_method={(key, value) => this.updateState(key, value)}
                        current_question_id={this.state.current_question_id}
                        current_question_name={this.state.current_question_name}
                        current_question_state={this.state.current_question_state}
                        user={this.props.user}
                    />)
                }
                {
                    this.state.current_question_id === 0 ? (null) : (<Comment
                        key={'CodingCommentSection'}
                        user={this.props.user}
                        question_id={this.state.current_question_id}
                        user_profile={this.state.user_profile}
                    />)
                }
                <UploadQuestion key={'CodingUploadQuestion'} user={this.props.user}/>
            </div>);
    }
}