import React, {Component} from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

const rating_submission_url = '';
const rating_receiving_url = '';

class SubmitRating extends Component {
    render() {
        return (
            <div>
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
        this.state.ratings = 0;
    }
    componentDidMount() {
        let is_for_road_map = this.props.for_road_map;
        axios.get(rating_receiving_url, {
            params: {
                // TODO: params
                id: this.props.question_id
            }
        }).then((response) => {
            this.setState({ratings: response.data});
        })
    }
    render() {
        return (
            <div>
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
        let is_for_road_map = this.props.for_road_map;
        axios.post(rating_submission_url, {
            // TODO: params here
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
