import React, {Component} from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/index";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const post_comments_url = '/post_comments';
const get_comments_url = '/get_comments';
const update_comments_url = '/update_comments';
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
        console.log(prev_value);
        if (this.state.clicked === false) {
            this.setState({clicked: true});
            this.props.updating_upvote(prev_value + 1);
        } else {
            this.setState({clicked: false});
            this.props.updating_upvote(prev_value - 1);
        }
    }

    render() {
        return (
            <div>
                <FontAwesomeIcon icon={faArrowUp} className={'UpvoteIcon'} onClick={() => this.regulateNum()}/>
                <span style={{marginLeft: '0.5em'}}>{this.props.num}</span>
            </div>
        );
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
        return (
            <div>
                <FontAwesomeIcon icon={faArrowDown} onClick={() => this.regulateNum()}/>
                <span style={{marginLeft: '0.5em'}}>{this.props.num}</span>
            </div>
        );
    }
}

class UserInfo extends Component {
    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <img style={{order: 1, marginRight: '1em', maxWidth: '5em', maxHeight: '5em', verticalAlign: 'middle', boxShadow: '0 0 0.2em grey'}} src={this.props.src} alt={this.props.user}/>
                <h4 style={{order: 2, verticalAlign: 'center'}}>{this.props.user}</h4>
            </div>
        );
    }
}

class SecondLevelComment extends Component {
    render() {
        let curr_comment = this.props.comment_ref;
        return (
            <div className={'SecondLevelComment_content'}>
                <h4><span>{curr_comment.user}</span></h4>
                <div className={'comment_flex'}>
                    <div className={'comment_blockleft'}>
                        <UpvoteDisplay num={curr_comment.upvoteNum}
                                   updating_upvote={val => this.props.updating_upvote(curr_comment.id, val)}/>
                        <DownvoteDisplay num={curr_comment.downvoteNum}
                                     updating_downvote={val => this.props.updating_downvote(curr_comment.id, val)}/>
                    </div>
                    <div className={'comment_blockright'}>
                        <section dangerouslySetInnerHTML={{__html: curr_comment.comment}}/>
                    </div>
                </div>
            </div>
        );
    }
}

class CommentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    updateComment() {
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
            content: this.state.text
        }).then((response) => {
            console.log('Send comment to backend', response.data);
            let id = response.data[0];
            this.props.updating_comment(id, this.state.text);
        })
    }

    render() {
        return (
            <div>
                <div>
                    <ReactQuill theme="snow" value={this.state.text} onChange={(value) => this.setState({text: value})} />
                </div>
                <button onClick={() => this.updateComment()}>Submit</button>
            </div>
        )
    }
}

class FirstLevelComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_fold: true
        };
    }
    render() {
        let curr_comment = this.props.comment_ref;
        let img_source = curr_comment.imageSource;
        if (img_source === '' || img_source === undefined || img_source === null) {
            img_source = this.props.user_profile.userPicSource;
        }

        const secondary_comments = [];
        for (let second_level_comment of curr_comment.secondaryComments) {
            secondary_comments.push(<SecondLevelComment key={'SecondLevelComment' + second_level_comment.id}
                                                        comment_ref={second_level_comment}
                                                        updating_upvote={(id, val) => this.props.updating_upvote(id, val)}
                                                        updating_downvote={(id, val) => this.props.updating_downvote(id, val)}/>);
        }
        return (
            <div className={'firstLevelComments_content'}>
                <div>
                    <div><UserInfo src={img_source} user={curr_comment.user}/></div>
                    <div className={'comment_flex'}>
                        <div className={'comment_blockleft'}>
                            <div><UpvoteDisplay num={curr_comment.upvoteNum}
                                                updating_upvote={val => this.props.updating_upvote(curr_comment.id, val)}/></div>
                            <div><DownvoteDisplay num={curr_comment.downvoteNum}
                                                  updating_downvote={val => this.props.updating_downvote(curr_comment.id, val)}/>
                            </div>
                        </div>
                        <div className={'comment_blockright'}>
                            <section dangerouslySetInnerHTML={{__html: curr_comment.comment}}/>
                        </div>
                    </div>
                </div>

                <div>{secondary_comments}</div>

                <div>
                    <h5>Write followups {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h5>
                    {
                        this.state.is_fold ? (null) : (<div>
                            <CommentEditor
                            updating_comment={(id, string) => this.props.updating_comment(id, string, curr_comment.id)}
                            current_user={this.props.current_user} current_question_id={this.props.current_question_id}
                            current_parent_comment_id={curr_comment.id}/>
                        </div>)
                    }
                </div>
            </div>
        );
    }
}


export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            pageNumber: 0,
            is_fold: true
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
            console.log('Get all comments:', response.data, Object.keys(response.data).length);
            if (Object.keys(response.data).length > 0) {
                this.setState({comments: response.data, prev_question_id: this.props.question_id});
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.question_id !== prevProps.question_id) {
            let is_for_road_map = this.props.for_road_map === true ? 1 : 0;
            axios.get(get_comments_url, {
                params: {
                    is_for_road_map: is_for_road_map,
                    question_id: this.props.question_id
                }
            }).then((response) => {
                this.setState({
                    comments: response.data,
                    pageNumber: 0,
                    is_fold: true
                });
            });
        }
        return null;
    }

    updatingVote(id, val, is_upvote) {
        axios.post(update_comments_url, {
            username: this.props.user,
            comment_id: id,
            value: val,
            is_upvote: is_upvote === true ? 1 : 0
        }).then(response => {
            let prev_comments = JSON.parse(JSON.stringify(this.state.comments));
            let found = 0;
            for (let first_lev_question of prev_comments) {
                if (first_lev_question.id === id) {
                    if (is_upvote) {
                        console.log('first_lev_question', first_lev_question, val);
                        first_lev_question.upvoteNum = val;
                    } else {
                        first_lev_question.downvoteNum = val;
                    }
                    found = 1;
                    break;
                }
                if (found === 1) {
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
            console.log(prev_comments);
            this.setState({
                comments: prev_comments
            });
        })
    }

    navigatePage(is_nextpage) {
        let prev_pageNumber = this.state.pageNumber;
        if (is_nextpage) {
            if (Math.abs((prev_pageNumber + 1) * num_comments - this.state.comments.length) > 0) {
                this.setState({pageNumber: prev_pageNumber + 1});
            }
        } else {
            console.log(prev_pageNumber);
            if ((prev_pageNumber - 1) >= 0) {
                this.setState({pageNumber: prev_pageNumber - 1});
            }
        }
    }

    insertComment(id, string, parent_id) {

        if (parent_id !== null && parent_id !== undefined) {
            let data = {};
            data.imageSource = '';
            data.secondaryComments = [];
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
            let data = {};
            data.user = this.props.user;
            data.comment = string;
            data.id = id;
            data.downvoteNum = 0;
            data.upvoteNum = 0;
            data.secondaryComments = [];
            data.imageSource = '';

            let prev_comments = JSON.parse(JSON.stringify(this.state.comments));
            prev_comments.unshift(data);
            this.setState({comments: prev_comments});
        }


    }

    // currently the comments only allow two-level structures
    render() {
        let blocks = null;
        if (this.state.comments.length > 0) {
            let user = this.props.user;
            let current_question_id = this.props.question_id;
            let is_for_road_map = this.props.is_for_road_map;
            blocks = [];
            for (let i = this.state.pageNumber * num_comments; i < (this.state.pageNumber+1) * num_comments; i += 1) {
                if (i >= this.state.comments.length) {
                    continue;
                }
                blocks.push(
                    <FirstLevelComment key={'FirstLevelComment' + this.state.comments[i].id}
                                       comment_ref={this.state.comments[i]}
                                       updating_upvote={(id, val) => this.updatingVote(id, val, true)}
                                       updating_downvote={(id, val) => this.updatingVote(id, val, false)}
                                       updating_comment={(id, string, parent_id) => this.insertComment(id, string, parent_id)}
                                       current_user={user} current_question_id={current_question_id} user_profile={this.props.user_profile}/>
                )
            }
        }

        return (<section className={'questionComments_content'}>
            <h3>Show/Leave Comments {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
            {this.state.is_fold ? (null) : (<div>
                <div><CommentEditor for_road_map={this.props.is_for_road_map}
                                    updating_comment={(id, string) => this.insertComment(id, string, null)}
                                    current_user={this.props.user} current_question_id={this.props.question_id}/></div>
                <div>{blocks}</div>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <button style={{display: 'inline-block', marginRight: '1em'}} onClick={() => this.navigatePage(false)}>Previous Page</button>
                    <button style={{display: 'inline-block'}} onClick={() => this.navigatePage(true)}>Next Page</button>

                </div>
            </div>)}
        </section>)
    }
}