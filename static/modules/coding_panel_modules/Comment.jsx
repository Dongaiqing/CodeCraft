import React, {Component} from 'react';
import axios from 'axios';
import {Editor as DraftEditor, EditorState as DraftEditorState, RichUtils as DraftRichUtils} from 'draft-js';

const comments_url = '';
const num_comments = 10;
/*
* Expected data info:
*   comment id
*   author
*   comments
*   upvotes
*   downvotes
*   secondary
* */

// expects image and name

class FirstLevelCommentDataStructure {
    constructor() {
        this.id = 0;
        this.imageSource = '';
        this.author = '';
        this.comment = '';
        this.upvoteNum = 0;
        this.downvoteNum = 0;
        this.secondaryComments = [];
    }
}

class SecondLevelCommentDataStructure {
    constructor() {
        this.id = 0;
        this.author = '';
        this.comment = '';
        this.upvoteNum = 0;
        this.downvoteNum = 0;
    }
}

class UpvoteDisplay extends Component {
    constructor(props) {
        super(props);
        this.state.clicked = false;
    }
    regulateNum() {
        let prev_value = this.props.num;
        if (this.state.clicked === false) {
            this.setState({clicked: true});
            this.props.updating_upvote(prev_value+1);
        } else {
            this.setState({clicked: false});
            this.props.updating_upvote(prev_value-1);
        }
    }
    render() {
        return <div>
            <i className={'UpvoteIcon'} onClick={() => this.regulateNum()}> </i>
            <p>{this.props.num}</p>
        </div>
    }
}

class DownvoteDisplay extends Component {
    constructor(props) {
        super(props);
        this.state.clicked = false;
    }
    regulateNum() {
        let prev_value = this.props.num;
        if (this.state.clicked === false) {
            this.setState({clicked: true});
            this.props.updating_downvote(prev_value-1);
        } else {
            this.setState({clicked: false});
            this.props.updating_downvote(prev_value+1);
        }
    }
    render() {
        return <div>
            <i className={'DownvoteIcon'} onClick={() => this.regulateNum()}> </i>
            <p>{this.props.num}</p>
        </div>
    }
}

class AuthorInfo extends Component {
    render() {
        return <figure className={'AuthorInfo'}>
            <img src={this.props.src} alt={this.props.author}/>
            <figcaption>{this.props.author}</figcaption>
        </figure>;
    }
}

class SecondLevelComment extends Component {
    render() {
        let curr_comment = this.props.question_ref;
        return <div>
            <div><h6>{curr_comment.author}</h6></div>
            <div><section>{curr_comment.comment}</section></div>
            <div>
                <UpvoteDisplay num={curr_comment.upvoteNum} updating_upvote={val => this.props.updating_upvote(curr_comment.id, val)}/>
                <DownvoteDisplay num={curr_comment.downvoteNum} updating_downvote={val => this.props.updating_downvote(curr_comment.id, val)}/>
            </div>
        </div>
    }
}

class CommentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: DraftEditorState.createEmpty()
        }
    }

    editorOnChangeHandler(editorState) {
        this.setState({editorState: editorState});
    }

    handleKeyboardCommand(command, editorState) {
        const newState = DraftRichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.editorOnChangeHandler(newState);
        }
    }

    updateComment(string) {
        axios.post(comments_url, {
            // TODO: post parameters
        }).then((response) => {
            console.log('Send comment to backend', response.data);
            let id = response.data;
            this.props.updating_comment(id, string);
        })
    }

    render() {
        return (
            <div>
                <DraftEditor editorState={this.state.editorState} readOnly={false} onChange={(editorState) => this.editorOnChangeHandler(editorState)} spellCheck={true} stripPastedStyles={true} handleKeyCommand={(command, editorState) => this.handleKeyboardCommand(command, editorState)}/>
                <button onClick={(string) => this.updateComment(string)}>Submit</button>
            </div>
        )
    }
}

class FirstLevelComment extends Component {
    render() {
        let curr_comment = this.props.question_ref;
        const secondary_comments = [];
        for (let second_level_comment of curr_comment) {
            secondary_comments.push(<SecondLevelComment question_ref={second_level_comment} updating_upvote={(id, val) => this.props.updating_upvote(id, val)} updating_downvote={(id, val) => this.props.updating_downvote(id, val)}/>);
        }
        return <div>
            <div><AuthorInfo src={curr_comment.imageSource} author={curr_comment.author}/></div>
            <div><section>{curr_comment.comment}</section></div>
            <div><UpvoteDisplay num={curr_comment.upvoteNum} updating_upvote={val => this.props.updating_upvote(curr_comment.id, val)}/></div>
            <div><DownvoteDisplay num={curr_comment.downvoteNum} updating_downvote={val => this.props.updating_downvote(curr_comment.id, val)}/></div>
            <div>{secondary_comments}</div>

            <div><CommentEditor updating_comment={(id, string) => this.props.updating_comment(id, string, curr_comment.id)}/></div>
        </div>
    }
}


export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            pageNumber: 0
        };
    }

    componentDidMount() {
        axios.get(comments_url, {
            params: {
                // TODO: get all comments regarding the current question
                allQuestions: true
            }
        }).then((response) => {
            console.log('Get all questions:', response.data);
            this.setState({questions: response.data});
        })
    }

    updatingVote(id, val, is_upvote) {
        let prev_questions = JSON.parse(JSON.stringify(this.state.questions));
        let found = 0;
        for (let first_lev_question of prev_questions) {
            if (first_lev_question.id === id) {
                if (is_upvote) {
                    first_lev_question.upvoteNum = val;
                } else {
                    first_lev_question.downvoteNum = val;
                }
                found = 1;
                break;
            }

            for (let second_lev_question of first_lev_question.secondaryComments) {
                if (second_lev_question.id === id) {
                    if (is_upvote) {
                        second_lev_question.upvoteNum = val;
                    } else {
                        second_lev_question.downvoteNum = val;
                    }
                    found = 1;
                    break;
                }
            }
            if (found === 1) {
                break;
            }
        }
        this.setState({
            questions: prev_questions
        });
    }

    navigatePage(is_nextpage) {
        let prev_pageNumber = this.state.pageNumber;
        if (is_nextpage) {
            if ((prev_pageNumber+1) * num_comments - this.state.questions.length < num_comments) {
                this.setState({pageNumber: prev_pageNumber+1});
            }
        } else {
            if ((prev_pageNumber-1) > 0) {
                this.setState({pageNumber: prev_pageNumber-1});
            }
        }
    }

    insertComment(id, string, parent_id) {

        if (parent_id !== null && parent_id !== undefined) {
            let data = new SecondLevelCommentDataStructure();
            data.author = this.props.author;
            data.comment = string;
            data.downvoteNum = 0;
            data.upvoteNum = 0;
            data.id = id;

            let prev_questions = JSON.parse(JSON.stringify(this.state.questions));
            for (let first_lev_question of prev_questions) {
                if (first_lev_question.id === parent_id) {
                    first_lev_question.secondaryComments.unshift(data);
                    break;
                }
            }
            this.setState({questions: prev_questions});
        } else {
            let data = new FirstLevelCommentDataStructure();
            data.author = this.props.author;
            data.comment = string;
            data.id = id;
            data.downvoteNum = 0;
            data.upvoteNum = 0;
            data.secondaryComments = [];

            let prev_questions = JSON.parse(JSON.stringify(this.state.questions));
            prev_questions.unshift(data);
            this.setState({questions: prev_questions});
        }


    }

    // currently the comments only allow two-level structures
    render() {
        const blocks = [];
        for (let i = this.state.pageNumber*num_comments; i < num_comments; i += 1) {
            if (i >= this.state.questions.length) {
                continue;
            }
            blocks.push(
                <FirstLevelComment question_ref={this.state.questions[i]} updating_upvote={(id, val) => this.updatingVote(id, val, true)} updating_downvote={(id, val) => this.updatingVote(id, val, false)} updating_comment={(id, string, parent_id) => this.insertComment(id, string, parent_id)}/>
            )
        }
        return <section>
            <div><CommentEditor updating_comment={(id, string) => this.insertComment(id, string, null)}/></div>
            <div>{blocks}</div>
            <button onClick={() => this.navigatePage(true)}>Next Page</button>
            <button onClick={() => this.navigatePage(false)}>Previous Page</button>
        </section>
    }
}