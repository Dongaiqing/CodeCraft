import React, {Component} from 'react';
import * as SRD from 'storm-react-diagrams';
require("storm-react-diagrams/dist/style.min.css");

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
        return (
            <div>

            </div>
        );
    }
}