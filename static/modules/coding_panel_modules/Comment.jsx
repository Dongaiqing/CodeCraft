import React, {Component} from 'react';
import axios from 'axios';
import {stateToHTML} from 'draft-js-export-html';
import {Editor as DraftEditor, EditorState as DraftEditorState, RichUtils as DraftRichUtils} from 'draft-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';

const post_comments_url = '/post_comments';
const get_comments_url = '/get_comments';
const num_comments = 10;
/*
* Expected data info:
*   comment id
*   user
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
        this.user = '';
        this.comment = '';
        this.upvoteNum = 0;
        this.downvoteNum = 0;
        this.secondaryComments = [];
    }
}

class SecondLevelCommentDataStructure {
    constructor() {
        this.id = 0;
        this.imageSource = '';
        this.user = '';
        this.comment = '';
        this.upvoteNum = 0;
        this.downvoteNum = 0;
    }
}

export class UpvoteDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
    }

    regulateNum() {
        let prev_value = this.props.num;
        if (this.state.clicked === false) {
            this.setState({clicked: true});
            this.props.updating_upvote(prev_value + 1);
        } else {
            this.setState({clicked: false});
            this.props.updating_upvote(prev_value - 1);
        }
    }

    render() {
        return <div>
            <FontAwesomeIcon icon={faArrowUp} className={'UpvoteIcon'} onClick={() => this.regulateNum()}/>
            <p>{this.props.num}</p>
        </div>
    }
}

export class DownvoteDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
    }

    regulateNum() {
        let prev_value = this.props.num;
        if (this.state.clicked === false) {
            this.setState({clicked: true});
            this.props.updating_downvote(prev_value - 1);
        } else {
            this.setState({clicked: false});
            this.props.updating_downvote(prev_value + 1);
        }
    }

    render() {
        return <div>
            <FontAwesomeIcon icon={faArrowDown} onClick={() => this.regulateNum()}/>
            <p>{this.props.num}</p>
        </div>
    }
}

class UserInfo extends Component {
    render() {
        return <figure className={'userInfo'}>
            <img src={this.props.src} alt={this.props.user}/>
            <figcaption>{this.props.user}</figcaption>
        </figure>;
    }
}

class SecondLevelComment extends Component {
    render() {
        let curr_comment = this.props.comment_ref;
        return (
            <div>
                <div><h6>{curr_comment.user}</h6></div>
                <div>
                    <section>{curr_comment.comment}</section>
                </div>
                <div>
                    <UpvoteDisplay num={curr_comment.upvoteNum}
                                   updating_upvote={val => this.props.updating_upvote(curr_comment.id, val)}/>
                    <DownvoteDisplay num={curr_comment.downvoteNum}
                                     updating_downvote={val => this.props.updating_downvote(curr_comment.id, val)}/>
                </div>
            </div>
        );
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
        let current_user = this.props.current_user;
        let current_question_id = this.props.current_question_id;
        // this variable can be null/undefined!
        let current_parent_id = this.props.current_parent_comment_id == null ? -1 : this.props.current_parent_comment_id;
        let is_for_road_map = this.props.for_road_map === true ? 1 : 0;
        axios.post(post_comments_url, {
            username: current_user,
            question_id: current_question_id,
            parent_comment_id: current_parent_id,
            is_for_road_map: is_for_road_map,
            content: stateToHTML(this.state.editorState.getCurrentContent())
        }).then((response) => {
            console.log('Send comment to backend', response.data);
            let id = response.data;
            this.props.updating_comment(id, stateToHTML(this.state.editorState.getCurrentContent()));
        })
    }

    render() {
        return (
            <div>
                <DraftEditor editorState={this.state.editorState} readOnly={false}
                             onChange={(editorState) => this.editorOnChangeHandler(editorState)} spellCheck={true}
                             stripPastedStyles={true}
                             handleKeyCommand={(command, editorState) => this.handleKeyboardCommand(command, editorState)}/>
                <button onClick={() => this.updateComment()}>Submit</button>
            </div>
        )
    }
}

class FirstLevelComment extends Component {
    render() {
        let curr_comment = this.props.comment_ref;
        const secondary_comments = [];
        for (let second_level_comment of curr_comment.secondaryComments) {
            secondary_comments.push(<SecondLevelComment key={'SecondLevelComment' + second_level_comment.id}
                                                        comment_ref={second_level_comment}
                                                        updating_upvote={(id, val) => this.props.updating_upvote(id, val)}
                                                        updating_downvote={(id, val) => this.props.updating_downvote(id, val)}/>);
        }
        return (
            <div>
                <div><UserInfo src={curr_comment.imageSource} user={curr_comment.user}/></div>
                <div>
                    <section>{curr_comment.comment}</section>
                </div>
                <div><UpvoteDisplay num={curr_comment.upvoteNum}
                                    updating_upvote={val => this.props.updating_upvote(curr_comment.id, val)}/></div>
                <div><DownvoteDisplay num={curr_comment.downvoteNum}
                                      updating_downvote={val => this.props.updating_downvote(curr_comment.id, val)}/>
                </div>
                <div>{secondary_comments}</div>

                <div><CommentEditor
                    updating_comment={(id, string) => this.props.updating_comment(id, string, curr_comment.id)}
                    current_user={this.props.current_user} current_question_id={this.props.current_question_id}
                    current_parent_comment_id={curr_comment.id}/></div>
            </div>
        );
    }
}


export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            pageNumber: 0
        };
    }

    componentDidMount() {
        let is_for_road_map = this.props.for_road_map === true ? 1 : 0;
        axios.get(get_comments_url, {
            params: {
                is_for_road_map: is_for_road_map,
                question_id: this.props.question_id
            }
        }).then((response) => {
            console.log('Get all comments:', response.data);
            if (Object.keys(response.data).length === 0) {
                this.setState({comments: response.data});
            }
        })
    }

    updatingVote(id, val, is_upvote) {
        let prev_comments = JSON.parse(JSON.stringify(this.state.comments));
        let found = 0;
        for (let first_lev_question of prev_comments) {
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
            comments: prev_comments
        });
    }

    navigatePage(is_nextpage) {
        let prev_pageNumber = this.state.pageNumber;
        if (is_nextpage) {
            if ((prev_pageNumber + 1) * num_comments - this.state.comments.length < num_comments) {
                this.setState({pageNumber: prev_pageNumber + 1});
            }
        } else {
            if ((prev_pageNumber - 1) > 0) {
                this.setState({pageNumber: prev_pageNumber - 1});
            }
        }
    }

    insertComment(id, string, parent_id) {

        if (parent_id !== null && parent_id !== undefined) {
            let data = new SecondLevelCommentDataStructure();
            data.user = this.props.user;
            data.comment = string;
            data.downvoteNum = 0;
            data.upvoteNum = 0;
            data.id = id;

            let prev_comments = JSON.parse(JSON.stringify(this.state.comments));
            for (let first_lev_question of prev_comments) {
                if (first_lev_question.id === parent_id) {
                    first_lev_question.secondaryComments.unshift(data);
                    break;
                }
            }
            this.setState({comments: prev_comments});
        } else {
            let data = new FirstLevelCommentDataStructure();
            data.user = this.props.user;
            data.comment = string;
            data.id = id;
            data.downvoteNum = 0;
            data.upvoteNum = 0;
            data.secondaryComments = [];

            let prev_comments = JSON.parse(JSON.stringify(this.state.comments));
            prev_comments.unshift(data);
            this.setState({comments: prev_comments});
        }


    }

    // currently the comments only allow two-level structures
    render() {
        let blocks = null;
        if (this.state.comments.length > 0) {
            console.log(this.state.comments)
            let user = this.props.user;
            let current_question_id = this.props.question_id;
            let is_for_road_map = this.props.is_for_road_map;
            blocks = [];
            for (let i = this.state.pageNumber * num_comments; i < num_comments; i += 1) {
                if (i >= this.state.comments.length) {
                    continue;
                }
                blocks.push(
                    <FirstLevelComment key={'FirstLevelComment' + this.state.comments[i].id}
                                       comment_ref={this.state.comments[i]}
                                       updating_upvote={(id, val) => this.updatingVote(id, val, true)}
                                       updating_downvote={(id, val) => this.updatingVote(id, val, false)}
                                       updating_comment={(id, string, parent_id) => this.insertComment(id, string, parent_id)}
                                       current_user={user} current_question_id={current_question_id}/>
                )
            }
        }

        return (<section>
            <div><CommentEditor for_road_map={this.props.is_for_road_map}
                                updating_comment={(id, string) => this.insertComment(id, string, null)}
                                current_user={this.props.user} current_question_id={this.props.question_id}/></div>
            <div>{blocks}</div>
            <button onClick={() => this.navigatePage(true)}>Next Page</button>
            <button onClick={() => this.navigatePage(false)}>Previous Page</button>
        </section>)
    }
}