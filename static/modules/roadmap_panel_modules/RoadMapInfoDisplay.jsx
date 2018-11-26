import React, {Component} from 'react';

import Popup from "reactjs-popup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';

import {RoadMapDraw} from "./RoadMapDraw";
import {UpvoteDisplay, DownvoteDisplay} from "../coding_panel_modules/Comment";
import {Comment} from "../coding_panel_modules/Comment";
import {Rating} from "../coding_panel_modules/Rating";


class RoadMapDataStructure {
    constructor() {
        this.id = 0;
        this.description = '';
        this.graphData = {};
        this.name = '';
        this.author = '';
        this.upvoteNum = 0;
        this.downvoteNum = 0;
        this.comments = [];
        // thumbnails?
    }
}

class RoadMapPopup extends Component {
    constructor(props){
        super(props);
        this.state = {
            delete_clicked: false,
            like_clicked: false
        };
    }
    render() {
        let profile = this.props.profile;
        let like_button = null;
        let delete_button = null;
        if (this.props.delete_roadmap) {
            delete_button = <div><span onClick={() => {this.props.delete_roadmap(profile.id); this.setState({delete_clicked: !this.state.delete_clicked})}}><FontAwesomeIcon icon={this.state.delete_clicked ? faHeart : faTimes}/></span></div>;
        }
        if (this.props.add_roadmap) {
            like_button = <div><span onClick={() => {this.props.add_roadmap(profile.id); this.setState({delete_clicked: !this.state.like_clicked})}}><FontAwesomeIcon icon={this.state.like_clicked ? faTimes : faHeart}/></span></div>;
        }
        return (
            <Popup open={this.props.open} closeOnDocumentClick onClose={() => this.props.onClose()}>
                <div>
                    <RoadMapDraw data={profile.graphData}/>
                </div>
                <div><h4>Name: {profile.name}</h4></div>
                <div><h4>Author: {profile.author}</h4></div>
                <div>
                    <h4>Description</h4>
                    <section>{profile.description}</section>
                </div>
                <div><UpvoteDisplay num={profile.upvoteNum} updating_upvote={val => this.props.updating_upvote(val)}/></div>
                <div><DownvoteDisplay num={profile.downvoteNum} updating_downvote={val => this.props.updating_downvote(val)}/></div>
                <div><Rating user={this.props.user} question_id={profile.id} for_road_map={true}/></div>
                {delete_button}
                {like_button}
                <div><Comment user={this.props.user} question_id={profile.id} for_road_map={true}/></div>
                <div><button onClick={() => this.props.onClose()}>Close</button></div>
            </Popup>
        );
    }
}

/*
*   props:
*   user
*   profile
*   delete_roadmap
*   add_roadmap
*   updating_upvote
*   updating_downvote
* */

export class RoadMapInfoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
    }

    render() {
        let profile = this.props.profile;
        let user = this.props.user;
        return (
            <div>
                <div onClick={() => this.setState({clicked: !this.state.clicked})}>
                    <div><h4>Name: {profile.name}</h4></div>
                    <div><h4>Author: {profile.author}</h4></div>
                    <div><UpvoteDisplay num={profile.upvoteNum} updating_upvote={val => this.props.updating_upvote(val)}/></div>
                    <div><DownvoteDisplay num={profile.downvoteNum} updating_downvote={val => this.props.updating_downvote(val)}/></div>
                </div>
                {
                    this.props.delete_roadmap ? (<div><span onClick={() => this.props.delete_roadmap(profile.id)}><FontAwesomeIcon icon={faTimes}/></span></div>) : (null)
                }
                {
                    this.props.add_roadmap ? (<div><span onClick={() => this.props.add_roadmap(profile.id)}><FontAwesomeIcon icon={faHeart}/></span></div>) : (null)
                }
                <div>
                    <RoadMapPopup
                        user={user}
                        profile={profile}
                        open={this.state.clicked}
                        onClose={() => this.setState({clicked: !this.state.clicked})}
                        updating_upvote={val => this.props.updating_upvote(profile.id, val)}
                        updating_downvote={val => this.props.updating_downvote(profile.id, val)}
                        delete_roadmap={() => this.props.delete_roadmap ? this.props.delete_roadmap(profile.id) : null}
                        add_roadmap={() => this.props.add_roadmap ? this.props.add_roadmap(profile.id) : null}
                    />
                </div>
            </div>
        );
    }
}
