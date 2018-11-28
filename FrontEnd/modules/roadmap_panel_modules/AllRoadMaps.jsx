import React, {Component} from 'react';
import axios from 'axios';
import {RoadMapInfoCard} from "./RoadMapInfoDisplay";

const fetch_all_url = '/all_roadmap';
const road_map_update_upvote_url = '/upvote_roadmap';
const road_map_update_downvote_url = '/downvote_roadmap';
const add_fav_roadmap_url = '/add_to_fav_roadmap';

export class DisplayAllRoadMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_roadmaps: []
        };
    }

    componentDidMount() {
        axios.get(fetch_all_url).then(response => {
            this.setState({all_roadmaps: response.data});
        })
    }

    updateVotes(id, val, is_update) {

        axios.post(is_update ? road_map_update_upvote_url : road_map_update_downvote_url, {
            roadmap_id: id,
            value: val
        }).then(response => {
            let prev_roadMaps = JSON.parse(JSON.stringify(this.state.roadMaps));
            for (let item of prev_roadMaps) {
                if (item.id === id) {
                    if (is_update) {
                        item.upvoteNum = val;
                    } else {
                        item.downvoteNum = val;
                    }
                }
            }
            this.setState({roadMaps: prev_roadMaps});
        })
    }

    addRoadMap(id) {
        let user = this.props.user;
        axios.post(add_fav_roadmap_url, {
            username: user,
            roadmap_id: id
        }).then(response => {

        })
    }
    render() {
        let arr = [];
        let user = this.props.user;
        for (let item of this.state.all_roadmaps) {
            arr.push(<div><RoadMapInfoCard add_roadmap={id => this.addRoadMap(id)} profile={item} user={user} updating_upvote={(id, val) => this.updateVotes(id, val, true)} updating_downvote={(id, val) => this.updateVotes(id, val, false)}/></div>);
        }
        return (
            <div className={'allRoadMaps_content'}>
                <div className={'allRoadMaps_item'}>{arr}</div>
            </div>
        );
    }
}
