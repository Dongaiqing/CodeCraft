import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { CodingPanel } from "./modules/CodingPanel";
import { LoginPanel } from "./modules/LoginPanel";
import { HomePanel } from "./modules/HomePanel";
import { ProfilePanel } from "./modules/ProfilePanel";
import { RoulettePanel } from "./modules/RoulettePanel";
import { RoadMapPanel } from "./modules/RoadMapPanel";
import {Header} from "./modules/Header";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
            user: ''
        };
    }

    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <nav>
                            <LoginPanel loggedIn={this.state.loggedIn} updating_parent_method={(key, val) => this.updateState(key, val)}/>
                            {this.state.loggedIn? (
                            <ul>
                                <li>
                                    <Link to={'/'}>Home</Link>
                                </li>
                                <li>
                                    <Link to={'/coding'}>Coding</Link>
                                </li>
                                <li>
                                    <Link to={'/roulette'}>Roulette</Link>
                                </li>
                                <li>
                                    <Link to={'/roadmap'}>RoadMap</Link>
                                </li>
                                <li>
                                    <Link to={'/profile'}>Profile</Link>
                                </li>
                            </ul>) : (null)}
                        </nav>

                        <div>
                            <Header/>
                            <Switch>
                                <Route exact path={'/'} component={HomePanel}/>
                                <Route path={'/coding'} render={() => <CodingPanel user={this.state.user}/>}/>
                                <Route path={'/roulette'} render={() => <RoulettePanel user={this.state.user}/>}/>
                                <Route path={'/roadmap'} render={() => <RoadMapPanel user={this.state.user}/>}/>
                                <Route path={'/profile'} render={() => <ProfilePanel user={this.state.user}/>}/>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}


ReactDOM.render(<Main/>, document.getElementById('reactdom'));