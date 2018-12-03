import React, {Component} from 'react';
import axios from 'axios';
import {RoadMapInfoCard} from "./RoadMapInfoDisplay";

const road_map_fetch_url = '/get_user_roadmap';
const road_map_delete_url = '/delete_user_roadmap';

const road_map_update_upvote_url = '/upvote_roadmap';
const road_map_update_downvote_url = '/downvote_roadmap';

export class DisplaySavedRoadMaps extends Component {
    constructor(props) {
        // assumes user does not change
        super(props);
        this.state = {
            roadMaps: []
        };
    }

    componentDidMount() {
        let user = this.props.user;
        axios.get(road_map_fetch_url, {
            params: {
                username: user
            }
        }).then((response) => {
            this.setState({roadMaps: response.data});
        })
    }

    deleteRoadMap(id) {
        let user = this.props.user;
        axios.post(road_map_delete_url, {
            username: user,
            roadmap_id: id
        }).then((response) => {
            let prev_roadmaps = JSON.parse(JSON.stringify(this.state.roadMaps));
            let counter = 0;
            for (let item of prev_roadmaps) {
                if (item.id === id) {
                    break;
                }
                counter += 1;
            }
            prev_roadmaps.splice(counter, 1);
            this.setState({roadMaps: prev_roadmaps});
        })
    }

    updateVotes(id, val, is_update) {
        let user = this.props.user;
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

    render() {
        let arr = [];
        let user = this.props.user;
        for (let data of this.state.roadMaps) {
            arr.push(<div className={'savedRoadMap_item'}><RoadMapInfoCard profile={data} user={user} delete_roadmap={id => this.deleteRoadMap(id)} updating_upvote={(id, val) => this.updateVotes(id, val, true)} updating_downvote={(id, val) => this.updateVotes(id, val, false)}/></div>);
        }
        return (
            <div className={'savedRoadMap_content'}>
                {arr}
            </div>
        );
    }
}