import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Editor, staticSettings} from './modules/Editor'
import {Header} from './modules/Header'
import {QuestionFeedbackPanel, QuestionDisplayPanel} from './modules/Question'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor_content: '',
            editor_language: '',
            editor_theme: '',
            current_question_name: '',
            current_question_id: 0,
            current_question_state: false
        };
    }

    updateState(key_name, value) {
        console.log('index', key_name, value);
        this.setState({
            [key_name]: value
        });
    }
    render() {
        const items = [
            <Header
                key={'Header'}
            />,
            <QuestionDisplayPanel
                key={'QuestionDisplayPanel'}
                updating_method={(key_name, value) => this.updateState(key_name, value)}
                current_question_name={this.state.current_question_name}
                current_question_id={this.state.current_question_id}
            />,
            <Editor
                key={'Editor'}
                updating_content={(key_name, value) => this.updateState(key_name, value)}
                content={this.state.editor_content}
            />,
            <QuestionFeedbackPanel
                key={'QuestionFeedbackPanel'}
                content={this.state.editor_content}
                language={this.state.editor_language}
                updating_method={(key, value) => this.updateState(key, value)}
                current_question_id={this.state.current_question_id}
                current_question_name={this.state.current_question_name}
                current_question_state={this.state.current_question_state}
            />
        ];

        // console.log(staticSettings.all_black_themes, this.state.editor_theme, staticSettings.all_black_themes.indexOf(this.state.editor_theme) === -1);
        return <div style={{
            display: 'flex',
            margin: '1em',
            flexDirection: 'column',
            fontFamily: '\'Lato\', sans-serif',
            background: staticSettings.all_black_themes.indexOf(this.state.editor_theme) === -1 ? 'white' : 'black'
            }}>
            {items}
            </div>
    }
}

ReactDOM.render(<Main/>, document.getElementById('reactdom'));