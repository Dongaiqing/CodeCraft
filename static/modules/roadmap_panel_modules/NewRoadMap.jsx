import React, {Component} from 'react';
import axios from 'axios';

export class CreateNewRoadMap extends Component {
    constructor(props) {
        // assumes user does not change
        super(props);
        this.state.user = this.props.user;
    }

}