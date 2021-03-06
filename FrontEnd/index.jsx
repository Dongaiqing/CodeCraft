import React, {Component, lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import LoginPanel from "./modules/LoginPanel";
import Header from "./modules/Header";
import axios from "axios";

const CodingPanel = lazy(() => import('./modules/CodingPanel'));
const HomePanel = lazy(() => import('./modules/HomePanel'));
const ProfilePanel = lazy(() => import('./modules/ProfilePanel'));
const RoulettePanel = lazy(() => import('./modules/RoulettePanel'));
const RoadMapPanel = lazy(() => import('./modules/RoadMapPanel'));

import "./styles/index.scss";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: '',
            is_fold: false,
            preference: {
                font_name: 'default',
                theme_name: 'default'
            }
        };
    }

    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }

    render() {
        if (this.state.preference.font_name !== 'default') {
            let font_name = this.state.preference.font_name;
            const formatted = font_name.indexOf(' ') === -1 ? font_name : font_name.split(' ').join('+');
            const url = 'https://fonts.googleapis.com/css?family='+formatted;
            axios.get(url).then(response => {
                let node = document.createElement('style');
                node.innerHTML = response.data;
                document.getElementsByTagName("head")[0].appendChild(node);
                document.getElementById('reactdom').style['font-family'] = font_name+', sans-serif';
            });
        }
        return (
            <div style={{height: '100%', width: '100%'}}>
                <Router>

                    <div className={'index_main'}>
                        <nav className={'index_nav'} style={(() => {
                            if (this.state.is_fold === true) {
                                return {display: 'none'}
                            } else {
                                return {display: 'block'}
                            }
                        })()}>
                            <LoginPanel className={'index_nav_login'} loggedIn={this.state.loggedIn}
                                        updating_parent_method={(key, val) => this.updateState(key, val)}/>
                            {this.state.loggedIn ? (
                                <ul className={'index_nav_menu'}>
                                    <li>
                                        <Link to={'/'}>Home</Link>
                                    </li>
                                    <li>
                                        <Link to={'/coding'}>Coding</Link>
                                    </li>
                                    <li>
                                        <Link to={'/roulette'}>Guessing Game</Link>
                                    </li>
                                    <li>
                                        <Link to={'/roadmap'}>RoadMap</Link>
                                    </li>
                                    <li>
                                        <Link to={'/profile'}>Profile</Link>
                                    </li>
                                </ul>) : (null)}
                        </nav>


                        <Header style={(() => {
                            if (this.state.is_fold === true) {
                                return {gridColumn: 'span 6'}
                            }
                        })()} className={'index_header'} is_fold={this.state.is_fold}
                                updating_method={val => this.setState({is_fold: val})}/>
                        <div style={(() => {
                            if (this.state.is_fold === true) {
                                return {gridColumn: 'span 6'}
                            }
                        })()} className={'index_content'}>
                            <Suspense fallback={<h3>Loading Components🤪</h3>}>
                                <Switch>
                                    <Route exact path={'/'} render={() => <HomePanel/>}/>
                                    <Route path={'/coding'} render={() => <CodingPanel user={this.state.user}/>}/>
                                    <Route path={'/roulette'} render={() => <RoulettePanel user={this.state.user}/>}/>
                                    <Route path={'/roadmap'} render={() => <RoadMapPanel user={this.state.user}/>}/>
                                    <Route path={'/profile'} render={() => <ProfilePanel user={this.state.user}/>}/>
                                </Switch>
                            </Suspense>
                        </div>

                    </div>

                </Router>
            </div>
        );
    }
}


ReactDOM.render(<Main/>, document.getElementById('reactdom'));