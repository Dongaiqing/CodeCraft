import React, {Component} from 'react';

import {DisplaySavedRoadMaps} from "./roadmap_panel_modules/SavedRoadMaps";
import {DisplayAllRoadMaps} from "./roadmap_panel_modules/AllRoadMaps";
import {CreateNewRoadMap} from "./roadmap_panel_modules/NewRoadMap";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowRight} from '@fortawesome/free-solid-svg-icons';

const road_map_add_url = '';


export class RoadMapPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_fold_saved: true,
            is_fold_all: true,
            is_fold_new: true
        };
    }
    render() {
        let user = this.props.user;
        return (
            <div className={'roadMapPanel_content'}>
                <div>
                    <h2>Saved Roadmaps {this.state.is_fold_saved ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold_saved: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold_saved: true})}/>)}</h2>
                    {this.state.is_fold_saved ? (null) : (<DisplaySavedRoadMaps user={user}/>)}
                </div>
                <div>
                    <h2>All Roadmaps {this.state.is_fold_all ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold_all: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold_all: true})}/>)}</h2>
                    {this.state.is_fold_all ? (null) : (<DisplayAllRoadMaps user={user}/>)}
                </div>
                <div>
                    <h2>Create New RoadMap {this.state.is_fold_new ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold_new: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold_new: true})}/>)}</h2>
                    {this.state.is_fold_new ? (null) : (<CreateNewRoadMap user={user}/>)}
                </div>
            </div>
        );
    }
}