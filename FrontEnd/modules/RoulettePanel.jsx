import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import "../styles/RoulettePanel.scss"
import {Fonts, Themes} from "./fontsAndThemes";


const all_theme_names = Themes;
const all_font_names = Fonts;

const get_user_profile_url = '/get_user_profile';
const update_user_profile_url = '/update_balance_and_items';

const update_success_msg = 'Success';

const theme_pool_entrance_limit = 100;
const font_pool_entrance_limit = 10;

const random_items = (arr, num) => {
    return _.shuffle(arr).slice(0, num);
};

class FontPool extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showListclicked: false,
            is_1_clicked: false,
            is_10_clicked: false,
            items_chosen: []
        };
    }

    getCurrentPool() {
        let existing_items = new Set(this.props.existing_items);
        return all_font_names.filter(item => !(existing_items.has(item)));
    }

    handleButtonClick(is_1) {
        let current_balance = this.props.balance;
        if (is_1 && current_balance < font_pool_entrance_limit) {
            return;
        }
        if (!is_1 && current_balance < font_pool_entrance_limit*10) {
            return;
        }
        let items = [];
        if (is_1) {
            items = random_items(this.getCurrentPool(), 1);
            this.setState({is_1_clicked: true, is_10_clicked: false, items_chosen: items});
            this.props.updating_storage(items, current_balance-font_pool_entrance_limit);
        } else {
            items = random_items(this.getCurrentPool(), 10);
            this.setState({is_1_clicked: false, is_10_clicked: true, items_chosen: items});
            this.props.updating_storage(items, current_balance-font_pool_entrance_limit*10);
        }

    }

    render() {

        let display_arr = this.getCurrentPool().map(item => <li><span>{item}</span></li>);

        let random_arr = this.state.items_chosen.map(item => <li><span>{item}</span></li>);
        return (
            <div>
                <h3>Here is the pool for fonts</h3>
                <button onClick={() => this.setState({showListclicked: !this.state.showListclicked})}>Show List</button>
                {
                    this.state.showListclicked ? (<section><ul>{display_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(true)}>*1</button>
                {
                    this.state.is_1_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(false)}>*10</button>
                {
                    this.state.is_10_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
            </div>
        );
    }
}

class ThemePool extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showListclicked: false,
            is_1_clicked: false,
            is_10_clicked: false,
            items_chosen: []
        };
    }

    getCurrentPool() {
        let existing_items = new Set(this.props.existing_items);
        return all_theme_names.filter(item => !(existing_items.has(item)));
    }

    handleButtonClick(is_1) {
        let current_balance = this.props.balance;
        if (is_1 && current_balance < theme_pool_entrance_limit) {
            return;
        }
        if (!is_1 && current_balance < theme_pool_entrance_limit*10) {
            return;
        }
        let items = [];
        if (is_1) {
            items = random_items(this.getCurrentPool(), 1);
            this.setState({is_1_clicked: true, is_10_clicked: false, items_chosen: items});
            this.props.updating_storage(items, current_balance-theme_pool_entrance_limit);
        } else {
            items = random_items(this.getCurrentPool(), 10);
            this.setState({is_1_clicked: false, is_10_clicked: true, items_chosen: items});
            this.props.updating_storage(items, current_balance-theme_pool_entrance_limit*10);
        }

    }

    render() {
        let current_balance = this.props.balance;
        if (current_balance < theme_pool_entrance_limit) {
            return (<section><h3>Your balance is not enough for theme pool!</h3></section>);
        }
        let display_arr = this.getCurrentPool().map(item => <li><span>{item}</span></li>);

        let random_arr = this.state.items_chosen.map(item => <li><span>{item}</span></li>);
        return (
            <div>
                <h3>Here is the pool for themes</h3>
                <button onClick={() => this.setState({showListclicked: !this.state.showListclicked})}>Show List</button>
                {
                    this.state.showListclicked ? (<section><ul>{display_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(true)}>*1</button>
                {
                    this.state.is_1_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(false)}>*10</button>
                {
                    this.state.is_10_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
            </div>
        );
    }
}

class EBucksDisplay extends Component {
    render() {
        return (
            <section>
                <h3>Your current balance is:</h3>
                <div>{this.props.balance}</div>
            </section>
        )
    }
}

export default class RoulettePanel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            existing_items: []
        };
    }
    componentDidMount() {
        let user = this.props.user;
        axios.get(get_user_profile_url, {
            params: {
                username: user
            }
        }).then((response) => {
            this.setState({balance: response.data.eBucks, existing_items: response.data.items});
        })
    }
    
    updateStorage(newItem, newBalance) {
        let user = this.props.user;
        axios.post(update_user_profile_url, {
            username: user,
            new_items: newItem,
            new_balance: newBalance
        }).then((response) => {
            if (response.data === update_success_msg) {
                let prev_items = this.state.existing_items.slice();
                if (Array.isArray(newItem)) {
                    prev_items.push(...newItem);
                } else {
                    prev_items.push(newItem);
                }
                this.setState({existing_items: prev_items, balance: newBalance});
            }
        });
    }

    render() {
        let balance = this.state.balance;
        if (balance < font_pool_entrance_limit) {
            return (
                <section><h3>Your balance is not enough!</h3></section>
            );
        }
        return (
            <div className={'guessingContent'}>
                <EBucksDisplay balance={balance}/>
                <FontPool balance={balance} existing_items={this.state.existing_items} updating_storage={(newItem, newBalance) => this.updateStorage(newItem, newBalance)}/>
                <ThemePool balance={balance} existing_items={this.state.existing_items} updating_storage={(newItem, newBalance) => this.updateStorage(newItem, newBalance)}/>
            </div>
        );
    }
}