import React, {Component} from 'react'
import axios from 'axios'

const sendURL = '/get_code_test';
const receieveURL = '/post_code_test';


class GetContainer extends Component {
    constructor() {
        super();
        this.url = sendURL;
    }

    updateStatus(content) {
        // let curr_data;
        // if (Array.isArray(content) === false) {
        //     curr_data = content;
        // } else {
        //     curr_data = content[0];
        // }
        console.log(this.props.already_searched)
        if (Array.isArray(content) && content.length > 1) {
            this.props.updating_method('should_send_request', false);
            this.props.updating_method('potential_search_items', content);
            return;
        }
        console.log('content is what', content);
        if (Array.isArray(content) && content.length === 0) {
            // alert('Enabling TestFllight ✈️ 🛫 🛬 🛩!');
            // throw new Error('Data should not be empty array');
            // this.props.updating_parent_method('current_question_name', 'TestFlight');
            // this.props.updating_parent_method('current_question_id', 0);
            // this.props.updating_method('should_send_request', false);
            // this.props.updating_method('current_content', 'TF!');
            this.props.updating_method('should_send_request', false);
            this.props.updating_method('potential_search_items', [{error: '404: while(!false){}'}]);
            return;
        }
        let curr_data = content[0];
        const curr_content = curr_data.article;
        const curr_id = curr_data.id;
        const curr_name = curr_data.title;
        this.props.updating_parent_method('current_question_name', curr_name);
        this.props.updating_parent_method('current_question_id', curr_id);
        this.props.updating_method('should_send_request', false);
        this.props.updating_method('current_content', curr_content);

        this.props.updating_method('already_searched', 1-this.props.already_searched);
    }

    componentDidMount() {
        // console.log({
        //     id: this.props.search_number
        // });
        axios.get(this.url, {
            params: {
                id: this.props.search_number,
                title: this.props.search_name,
                already_searched: this.props.already_searched
            }
        }).then((response) => {
            console.log('Get', response);
            this.updateStatus(response.data);
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
        this.props.updating_method('should_send_request', false);
        // this.props.updating_method('current_content', content);
        this.props.updating_parent_method('current_question_state', content)
    }

    componentDidMount() {
        // console.log({
        //     source_code: this.props.content,
        //     language: this.props.language
        // });
        axios.post(this.url, {
            username: this.props.user, // TODO
            question_id: this.props.current_question_id,
            source_code: this.props.content,
            language: this.props.language
        }).then((response) => {
            console.log('Post', response.data);
            this.updateStatus(response.data);
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
            <label key={key+'_label'} htmlFor={key} style={{marginRight: '0.3em'}}>Search your question here!</label>,
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
        const title = this.props.title;
        const items = [
            <dt style={{width: '10%'}}>{id}</dt>,
            <dd style={{width: '90%', marginLeft: 'auto', textAlign: 'right'}}>{title}</dd>
        ];
        return <dl
            onClick={() => {
                this.props.updating_methods(id, title);
            }}
            style={{width: '100%', display: 'flex', flexWrap: 'wrap', cursor: 'pointer'}}>
            {items}
            </dl>;
    }
}


class QuestionSelectPanel extends Component {
    updateSearchQuery(id, title) {
        this.props.updating_methods('search_question_number', id);
        this.props.updating_methods('search_question_name', title);
        this.props.updating_methods('potential_search_items', []);
        this.props.updating_methods('should_send_request', true);
        this.props.updating_methods('already_searched', 1);
    }
    render() {
        const item_arr = this.props.potential_search_items;
        const arr_elems = [];
        if (item_arr.length === 1 && item_arr[0].hasOwnProperty('error')) {
            arr_elems.push(
                <h3>{item_arr[0].error}</h3>
            );
            arr_elems.push(
                <p>Click on the text below to dismiss the box</p>
            );
            arr_elems.push(
                <p style={{cursor: 'pointer', fontWeight: 'bold', margin: '0 auto'}} onClick={() => this.updateSearchQuery(0, 'Count Of Smaller Numbers After Self')}>return 'This is the best website EVER!';</p>
            );
        } else {
            arr_elems.push(
                <h3>We have found multiple entries that satisfy the requirement!</h3>
            );
            arr_elems.push(
                <p>Please select one of the question below!</p>
            );
            arr_elems.push(
                <dl style={{width: '100%', borderBottom: '0.05em solid grey', marginBottom: '0.5em', display: 'flex', flexWrap: 'wrap'}}>
                    <dt style={{width: '50%', fontWeight: 'bold'}}>Question ID</dt>
                    <dd style={{width: '50%', marginLeft: 'auto', fontWeight: 'bold', textAlign: 'right'}}>Question Name</dd>
                </dl>
            );
            console.log('new statement', item_arr);
            for (const item of item_arr) {
                arr_elems.push(<QuestionSelectItem id={item.id} title={item.title} updating_methods={(id, title) => this.updateSearchQuery(id, title)}/>);
            }
        }
        return <section style={{border: '0.2em solid #EC7063', margin: '1em', padding: '1em'}}><article style={{width: '50%', margin: '0 auto'}}>{arr_elems}</article></section>;
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
            potential_search_items: [],
            already_searched: 0
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
                    borderLeft: '0.3em solid #95A5A6',
                    display: 'block'
                }}
                key={'QuestionDisplayPanel_section'}>
                    <h2 style={{
                        color: 'white',
                        background: '#A6ACAF',
                        display: 'inline-block'
                    }}>
                        {this.props.current_question_id} - {this.props.current_question_name}
                    </h2>
                    <article style={{display: 'block'}}>
                        {state.current_content.split('\n').map(item => <div>{item}</div>)}
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
                    already_searched={this.state.already_searched}
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
            should_send_request: false
            // current_content: ''
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
        if (Object.keys(this.props.current_question_state).length > 0) {
            arr_elem.push(
                <section
                    style={{
                        marginBottom: '1em',
                        paddingLeft: '0.5em',
                        borderLeft: '0.3em solid #1F618D',
                        display: 'block'
                    }}
                    key={'QuestionFeedbackPanel_section'}>
                        <h2 style={{
                            color: 'white',
                            background: '#1F618D',
                            display: 'inline-block'
                        }}>
                            {this.props.current_question_state.header}
                        </h2>
                        <article style={{display: 'block'}}>
                            {this.props.current_question_state.content.split('\n').map(item => <div>{item}</div>)}
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
                    user={this.props.user}
                />
            );
        }
        arr_elem.push(<QuestionSubmitButton key={'QuestionFeedbackPanel_QuestionSubmitButton'} updating_method={(key, val) => this.updateState(key, val)}/>);
        return (<div
            style={{
                margin: '1em',
                order: 4
            }}>
            {arr_elem}
            </div>);
    }
}
