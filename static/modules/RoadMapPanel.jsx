import React, {Component} from 'react';

import {DisplaySavedRoadMaps} from "./roadmap_panel_modules/SavedRoadMaps";
import {DisplayAllRoadMaps} from "./roadmap_panel_modules/AllRoadMaps";
import {CreateNewRoadMap} from "./roadmap_panel_modules/NewRoadMap";


const road_map_add_url = '';


export class RoadMapPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        let user = this.props.user;
        return (
            <div>
                <div><h2>Saved Roadmaps</h2><DisplaySavedRoadMaps user={user}/></div>
                <div><h2>All Roadmaps</h2><DisplayAllRoadMaps user={user}/></div>
                <div><h2>Create New RoadMap</h2><CreateNewRoadMap user={user}/></div>
            </div>
        );
    }
}