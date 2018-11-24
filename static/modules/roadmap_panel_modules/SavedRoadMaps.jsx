import React, {Component} from 'react';
import axios from 'axios';
import {RoadMapInfoCard} from "./RoadMapInfoDisplay";

const road_map_fetch_url = '';
const road_map_delete_url = '';

class RoadMapDataStructure {
    constructor() {
        this.id = 0;
        this.graphData = {};
        this.name = '';
        this.author = '';
        this.upvoteNum = 0;
        this.downvoteNum = 0;
        this.comments = [];
        // thumbnails?
    }
}

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
                // TODO: params
            }
        }).then((response) => {
            this.setState({roadMaps: response.data});
        })
    }

    deleteRoadMap(id) {
        let user = this.props.user;
        axios.post(road_map_delete_url, {
            // TODO: params
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

    render() {
        let arr = [];
        let user = this.props.user;
        for (let data of this.state.roadMaps) {
            arr.push(<RoadMapInfoCard profile={data} user={this.props.user} delete_roadmap={id => this.deleteRoadMap(id)}/>);
        }
        return (
            <div>
                <h2>Your saved roadmaps</h2>
                <div>{arr}</div>
            </div>
        );
    }
}