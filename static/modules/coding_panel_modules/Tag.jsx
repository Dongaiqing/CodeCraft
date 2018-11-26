import React, {Component} from 'react';
import axios from 'axios';
import {Doughnut} from 'react-chartjs-2';

const tag_submission_url = '';
const tag_receiving_url = '';

const frequenct_threshold = 0.3;

class SubmitTags extends Component {
    constructor(props) {
        super(props);
        this.state.tagString = '';
    }

    handleSubmit() {
        let current_user = this.props.current_user;
        let current_question_id = this.props.current_question_id;

        axios.post(tag_submission_url, {
            // TODO: params
        }).then((response) => {
            this.props.updating_tags(this.state.tagString.split(','));
            this.props.updating_display_tags();
        })
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
        this.state.chartData = {};
    }
    componentDidMount() {
        let current_question_id = this.props.current_question_id;

        axios.get(tag_receiving_url, {
            params: {
                // apply params here
            }
        }).then((response) => {
            console.log('Tag response is ', response.data);
            let raw_data = response.data;
            let max_frequency = Math.max.apply(Math, raw_data.map(function(o) { return o.tagFrequency; }));

            let temp_data = raw_data.filter(item => item.tagFrequency >= max_frequency * frequenct_threshold);
            let random_color = temp_data.map(() => '#'+(Math.random()*0xFFFFFF<<0).toString(16));
            let chart_data = {
                labels: Object.keys(temp_data),
                datasets: [{
                    data: Object.values(temp_data),
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
        this.setState({tags: tags});
        let user = this.props.user;
        let current_question_id = this.props.question_id;
        axios.post(tag_submission_url, {
            // TODO: params here
        }).then((response) => {
            this.setState({is_display_tags: true});
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