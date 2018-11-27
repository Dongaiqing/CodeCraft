import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMeteor } from '@fortawesome/free-solid-svg-icons';


import "../styles/HomePanel.scss";

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: false
        };
    }
    render() {
        return <div>
            <h4><FontAwesomeIcon icon={faMeteor} className={'About'} onClick={() => {let prev_toggled = this.state.toggled; this.setState({toggled: !prev_toggled});}}/></h4>
            {this.state.toggled ? (<section>😋</section>) : (null)}
        </div>
    }
}

export class HomePanel extends Component{
    render() {
        return (
            <article>
                <h1>Welcome to CodeCraft!</h1>
                <About/>
            </article>
        );
    }
}