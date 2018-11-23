import React, {Component} from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

library.add(faHeart);

class About extends Component {
    constructor(props) {
        super(props);
        this.state.toggled = false;
    }
    render() {
        return <div>
            <FontAwesomeIcon icon="heart" className={'About'} onClick={() => {let prev_toggled = this.state.toggled; this.setState({toggled: !prev_toggled});}}/>
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