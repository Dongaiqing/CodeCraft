import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Editor} from './modules/Editor'
import {Header} from './modules/Header'
import {QuestionFeedbackPanel, QuestionDisplayPanel} from './modules/Question'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor_content: '',
            editor_language: ''
        };
    }

    updateState(key_name, value) {
        console.log(value);
        this.setState({
            [key_name]: value
        });
    }
    render() {
        const items = [
            <Header key={'Header'}/>,
            <QuestionDisplayPanel key={'QuestionDisplayPanel'}/>,
            <Editor key={'Editor'} updating_content={(key_name, value) => this.updateState(key_name, value)} content={this.state.editor_content}/>,
            <QuestionFeedbackPanel key={'QuestionFeedbackPanel'} content={this.state.editor_content} language={this.state.editor_language}/>
        ];
        return <div style={{
            display: 'flex',
            margin: '1em',
            flexDirection: 'column',
            fontFamily: '\'Lato\', sans-serif'
            }}>
            {items}
            </div>
    }
}

ReactDOM.render(<Main/>, document.getElementById('reactdom'));