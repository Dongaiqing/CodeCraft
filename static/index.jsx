import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { CodingPanel } from "./modules/CodingPanel";
import { LoginPanel } from "./modules/LoginPanel";
import { HomePanel } from "./modules/HomePanel";
import { ProfilePanel } from "./modules/ProfilePanel";
import { RoulettePanel } from "./modules/RoulettePanel";
import { RoadMapPanel } from "./modules/RoadMapPanel";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loggedIn: false
        };
    }

    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }
    render() {
        return <div>
            <LoginPanel updating_parent_method={(key, val) => this.updateState(key, val)}/>
            {this.state.loggedIn? (<Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to={'/home/'}>Home</Link>
                            </li>
                            <li>
                                <Link to={'/coding/'}>Coding</Link>
                            </li>
                            <li>
                                <Link to={'/roulette/'}>Roulette</Link>
                            </li>
                            <li>
                                <Link to={'/roadmap/'}>RoadMap</Link>
                            </li>
                            <li>
                                <Link to={'/profile/'}>Profile</Link>
                            </li>
                        </ul>
                    </nav>

                    <Switch>
                        <Route path={'/home/'} component={HomePanel}/>
                        <Route path={'/coding/'} component={CodingPanel}/>
                        <Route path={'/roulette/'} component={RoulettePanel}/>
                        <Route path={'/roadmap/'} component={RoadMapPanel}/>
                        <Route path={'/profile/'} component={ProfilePanel}/>
                    </Switch>
                </div>
            </Router>) : (null)}
        </div>;
    }
}

ReactDOM.render(<Main/>, document.getElementById('reactdom'));