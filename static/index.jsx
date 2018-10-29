import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Editor} from './modules/Coding.js'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <Editor/>;
    }
}

ReactDOM.render(<Main/>, document.getElementById('reactdom'));