import React, {Component} from 'react'
import axios from 'axios'

const sendURL = '/code_test';
const receieveURL = '/code_test';


class GetContainer extends Component {
    constructor() {
        super();
        this.url = sendURL;
    }

    updateStatus(content) {
        let curr_data;
        if (Array.isArray(content) === false) {
            curr_data = content;
        } else {
            curr_data = content[0];
        }
        if (Array.isArray(content) && content.length > 1) {
            this.props.updating_method('should_send_request', false);
            this.props.updating_method('potential_search_items', content);
            return;
        }

        const curr_content = curr_data.article;
        const curr_id = curr_data.id;
        const curr_name = curr_data.title;
        this.props.updating_parent_method('current_question_name', curr_name);
        this.props.updating_parent_method('current_question_id', curr_id);
        this.props.updating_method('should_send_request', false);
        this.props.updating_method('current_content', curr_content);
    }

    componentDidMount() {
        // console.log({
        //     id: this.props.search_number
        // });
        axios.get(this.url, {
            params: {
                id: this.props.search_number,
                title: this.props.search_name
            }
        }).then((response) => {
            // console.log(response);
            this.updateStatus(JSON.stringify(response.data));
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return <div> </div>;
    }
}

class PostContainer extends Component {
    constructor() {
        super();
        this.url = receieveURL;
    }

    updateStatus(content) {
        const curr_content = content.source_code;
        const curr_state = content.result === '';
        this.props.updating_method('should_send_request', false);
        this.props.updating_method('current_content', curr_content);
        this.props.updating_parent_method('current_question_state', curr_state)
    }

    componentDidMount() {
        // console.log({
        //     source_code: this.props.content,
        //     language: this.props.language
        // });
        axios.post(this.url, {
            user_id: 0, // TODO
            question_id: this.props.current_question_id,
            source_code: this.props.content,
            language: this.props.language
        }).then((response) => {
            // console.log(response.data);
            this.updateStatus(JSON.stringify(response.data));
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return <div> </div>;
    }
}

class QuestionGenerateButton extends Component {
    sendGetRequest() {
        this.props.updating_method('should_send_request', true);
    }
    render() {
        return <button onClick={() => this.sendGetRequest()}>Next Question!</button>;
    }
}

class QuestionSubmitButton extends Component {
    sendPostRequest() {
        this.props.updating_method('should_send_request', true);
    }
    render() {
        return <button onClick={() => this.sendPostRequest()}>Submit Question!</button>;
    }
}

class QuestionIDInput extends Component {
    render() {
        const items = [
            <label key={'QuestionIDInput_label'} htmlFor={'QuestionIDInput'} style={{marginRight: '0.3em'}}>Put your question ID here!</label>,
            <input
                key={'QuestionIDInput_input'}
                type={'number'}
                name={'question_number'}
                id={'QuestionIDInput'}
                value={this.props.search_number}
                onChange={(e) => this.props.updating_method('search_question_number', e.target.value)}
            />
        ];
        return <div>{items}</div>;
    }
}

class QuestionNameInput extends Component {
    render() {
        const key = 'QuestionNameInput';
        const items = [
            <label key={key+'_label'} htmlFor={key} style={{marginRight: '0.3em'}}>Put your question name here!</label>,
            <input
                key={key+'_input'}
                type={'text'}
                name={'question_name'}
                id={key}
                value={this.props.search_name}
                onChange={(e) => this.props.updating_method('search_question_name', e.target.value)}
            />
        ];
        return <div>{items}</div>;
    }
}


class QuestionSelectItem extends Component {
    render() {
        const id = this.props.id;
        const name = this.props.name;
        const items = [
            <dt style={{float: 'left', width: '%50'}}>{id}</dt>,
            <dd style={{float: 'left', width: '%50'}}>{name}</dd>
        ];
        return <dl
            onClick={() => this.props.updating_method(id, name)}
            style={{borderBottom: '0.1em solid #7B7D7E', width: '100%'}}>
            {items}
            </dl>;
    }
}


class QuestionSelectPanel extends Component {
    updateSearchQuery(id, name) {
        this.props.updating_methods('search_question_number', id);
        this.props.updating_methods('search_question_name', name);
        this.props.updating_methods('potential_search_items', []);
        this.props.updating_method('should_send_request', true);
    }
    render() {
        const item_arr = this.props.potential_search_items;
        const arr_elems = [];
        arr_elems.push(
            <h3>We have found multiple entries that satisfy the requirement!</h3>
        );
        arr_elems.push(
            <p>Please select one of the question below!</p>
        );
        for (const item of item_arr) {
            arr_elems.push(<QuestionSelectItem id={item.id} name={item.name} updating_methods={(id, name) => this.updateSearchQuery(id, name)}/>);
        }
        return <section style={{border: '0.1em solid #EC7063'}}>{arr_elems}</section>;
    }
}

export class QuestionDisplayPanel extends Component {
    constructor() {
        super();
        this.state = {
            should_send_request: false,
            current_content: '',
            search_question_number: 0,
            search_question_name: '',
            potential_search_items: []
        };
    }
    updateParentState(key, val) {
        this.props.updating_method(key, val);
    }
    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }
    render() {
        const state = this.state;
        const arr_elem = [];
        if (state.potential_search_items.length !== 0) {
            arr_elem.push(<QuestionSelectPanel potential_search_items={state.potential_search_items} updating_methods={(key, val) => this.updateState(key, val)}/>)
        }
        if (state.current_content !== '' && state.should_send_request === false) {
            arr_elem.push(
                <section
                style={{
                    marginBottom: '1em',
                    paddingLeft: '0.5em',
                    borderLeft: '0.2em solid #229954',
                    display: 'block'
                }}
                key={'QuestionDisplayPanel_section'}>
                    <h2 style={{
                        color: 'white',
                        background: '#196F3D',
                        display: 'inline-block'
                    }}>
                        Current Question Name is: {this.props.current_question_name}, Id is: {this.props.current_question_id}
                    </h2>
                    <article style={{display: 'block'}}>
                        {state.current_content}
                    </article>
                </section>
            );
        }
        if (state.should_send_request === true) {
            arr_elem.push(
                <GetContainer
                    key={'QuestionDisplayPanel_GetContainer'}
                    updating_method={(key, val) => this.updateState(key, val)}
                    updating_parent_method={(key, val) => this.updateParentState(key, val)}
                    search_number={state.search_question_number}
                    search_name={state.search_question_name}
                />
            );
        }
        arr_elem.push(<QuestionIDInput key={'QuestionDisplayPanel_QuestionIDInput'} updating_method={(key, val) => this.updateState(key, val)} search_number={state.search_question_number}/>);
        arr_elem.push(<QuestionNameInput key={'QuestionDisplayPanel_QuestionNameInput'} updating_method={(key, val) => this.updateState(key, val)} search_name={state.search_question_name}/>);
        arr_elem.push(<QuestionGenerateButton key={'QuestionDisplayPanel_QuestionGenerateButton'} updating_method={(key, val) => this.updateState(key, val)}/>);
        return <div
            style={{
                margin: '1em',
                order : 2
            }}>
            {arr_elem}
            </div>;
    }
}

export class QuestionFeedbackPanel extends Component {
    constructor() {
        super();
        this.state = {
            should_send_request: false,
            current_content: ''
        };
    }
    updateState(key, val) {
        this.setState({
            [key]: val
        });
    }
    render() {
        const state = this.state;
        const arr_elem = [];
        if (state.current_content !== '' && state.should_send_request === false) {
            arr_elem.push(
                <section
                    style={{
                        marginBottom: '1em',
                        paddingLeft: '0.5em',
                        borderLeft: '0.2em solid #2C8DC7',
                        display: 'block'
                    }}
                    key={'QuestionFeedbackPanel_section'}>
                        <h2 style={{
                            color: 'white',
                            background: '#B2BABB',
                            display: 'inline-block'
                        }}>
                            Current State is: {this.props.current_question_state}
                        </h2>
                        <article style={{display: 'block'}}>
                            {state.current_content}
                        </article>
                    </section>
            );
        }
        if (state.should_send_request === true) {
            arr_elem.push(
                <PostContainer
                    key={'QuestionFeedbackPanel_PostContainer'}
                    updating_method={(key, val) => this.updateState(key, val)}
                    updating_parent_method={(key, val) => this.props.updating_method(key, val)}
                    content={this.props.content}
                    language={this.props.language}
                    current_question_id={this.props.current_question_id}
                    current_question_name={this.props.current_question_name}
                />
            );
        }
        arr_elem.push(<QuestionSubmitButton key={'QuestionFeedbackPanel_QuestionSubmitButton'} updating_method={(key, val) => this.updateState(key, val)}/>);
        return <div
            style={{
                margin: '1em',
                order: 4
            }}>
            {arr_elem}
            </div>;
    }
}
