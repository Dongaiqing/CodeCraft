import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Editor} from './modules/Editor'
import {Header} from './modules/Header'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return [
            <Header/>,
            <Editor/>
        ];
    }
}

ReactDOM.render(<Main/>, document.getElementById('reactdom'));