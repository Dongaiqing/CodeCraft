import React, {Component} from 'react';
import axios from 'axios';
import {Doughnut} from 'react-chartjs-2';
import * as stringSimilarity from 'string-similarity';

const tag_submission_url = '/post_tag';
const tag_receiving_url = '/get_tag';

const frequenct_threshold = 0.3;
const similarity_threshold = 0.5;

class SubmitTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagString: ''
        };
    }

    handleSubmit() {
        this.props.updating_tags(this.state.tagString.split(',').map(item => item.trim()));
        this.props.updating_display_tags();
    }

    render() {
        return (
            <div>
                <h3>Submit your tags here!</h3>
                <p>Plase separate each tag by comma</p>
                <input value={this.state.tagString} onChange={(e) => this.setState({tagString: e.target.value})}/>
                <button onClick={() => this.handleSubmit()}>Submit</button>
            </div>
        );
    }
}

class TagDataStructure {
    constructor() {
        this.tagName = '';
        this.tagFrequency = 0;
    }
}
class DisplayTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {}
        };
    }

    generateFrequency(data) {
        let dict = {};
        for (let item of data) {
            let find_flag = 0;
            for (let key in dict) {
                if (dict.hasOwnProperty(key)) {
                    console.log(item, key);
                    if (stringSimilarity.compareTwoStrings(item, key) > similarity_threshold) {
                        dict[key] += 1;
                        find_flag = 1;
                        break;
                    }
                }
            }
            if (find_flag === 0) {
                dict[item] = 1
            }
        }
        console.log(dict);
        let arr = [];
        for (let key in dict) {
            if (dict.hasOwnProperty(key)) {
                arr.push({tagName: key, tagFrequency: dict[key]})
            }
        }
        return arr;
    }
    componentDidMount() {

        let question_id = this.props.question_id;

        axios.get(tag_receiving_url, {
            params: {
                question_id: question_id
            }
        }).then((response) => {
            console.log('Tag response is ', response.data);
            let raw_data = this.generateFrequency(response.data);
            let max_frequency = Math.max.apply(Math, raw_data.map(item => item.tagFrequency));

            let temp_data = raw_data.filter(item => item.tagFrequency / max_frequency >= frequenct_threshold);
            let random_color = temp_data.map(() => '#'+(Math.random()*0xFFFFFF<<0).toString(16));
            let chart_data = {
                labels: temp_data.map(item => item.tagName),
                datasets: [{
                    data: temp_data.map(item => item.tagFrequency),
                    backgroundColor: random_color,
                    hoverBackgroundColor: random_color
                }]
            };
            this.setState({chartData: chart_data});
        })
    }
    render() {
        return (
            <div>
                <Doughnut data={this.state.chartData} />
            </div>
        );
    }
}

export class Tag extends Component {
    constructor(props){
        super(props);
        this.state = {
            tags: [],
            is_display_tags: false
        };
    }
    updateTags(tags) {

        let user = this.props.user;
        let current_question_id = this.props.question_id;
        axios.post(tag_submission_url, {
            question_id: current_question_id,
            tags: tags
        }).then((response) => {
            this.setState({is_display_tags: true, tags: tags});
        })
    }

    updatingDisplayTags() {
        let prev_tag = this.state.is_display_tags;
        this.setState({is_display_tags: !prev_tag});
    }

    render() {
        if (this.state.is_display_tags === false) {
            return (<SubmitTags updating_tags={(tags) => this.updateTags(tags)} updating_display_tags={() => this.updatingDisplayTags()} current_user={this.props.user} current_question_id={this.props.current_question_id}/>);
        } else {
            return (<DisplayTags question_id={this.props.question_id}  current_question_id={this.props.current_question_id}/>);
        }
    }
}