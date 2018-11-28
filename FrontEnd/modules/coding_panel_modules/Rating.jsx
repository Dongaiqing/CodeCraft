import React, {Component} from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

const rating_submission_url = '/post_rating';
const rating_receiving_url = '/get_rating';

class SubmitRating extends Component {
    render() {
        return (
            <div className={'submitRating_content'}>
                <h3>Submit your rating here!</h3>
                <StarRatingComponent
                    name="Rating"
                    starCount={5}
                    value={this.props.rating}
                    onStarClick={(nextValue, prevValue, name) => this.props.ratingOnClickHander(nextValue, prevValue, name)}
                />
            </div>
        );
    }
}

class DisplayRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratings: 0
        };
    }
    componentDidMount() {
        let is_for_road_map = this.props.for_road_map === true ? 1 : 0;
        axios.get(rating_receiving_url, {
            params: {
                question_id: this.props.question_id,
                is_for_road_map: is_for_road_map
            }
        }).then((response) => {
            this.setState({ratings: response.data});
        })
    }
    render() {
        return (
            <div className={'displayRating_content'}>
                <StarRatingComponent
                    name="Rating"
                    starCount={5}
                    value={this.state.ratings}
                />
            </div>
        );
    }
}

export class Rating extends Component {
    constructor(props){
        super(props);
        this.state = {
            rating: 0,
            is_display_rating: false
        };
    }

    ratingOnClickHander(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
        let user = this.props.user;
        let current_question_id = this.props.question_id;
        let is_for_road_map = this.props.for_road_map === true ? 1: 0;
        console.log('is_for_road_map', is_for_road_map)
        axios.post(rating_submission_url, {
            question_id: current_question_id,
            is_for_road_map: is_for_road_map,
            value: nextValue
        }).then((response) => {
            this.setState({is_display_rating: true});
        })
    }

    render() {
        if (this.state.is_display_rating === false) {
            return (<SubmitRating rating={this.state.rating} ratingOnClickHander={(nextValue, prevValue, name) => this.ratingOnClickHander(nextValue, prevValue, name)}/>);
        } else {
            return (<DisplayRating for_road_map={this.props.for_road_map} question_id={this.props.question_id}/>);
        }
    }
}
