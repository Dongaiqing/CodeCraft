import React, {Component} from 'react';
import axios from 'axios';
import {RoadMapDraw} from "./RoadMapDraw";

const check_id_url = '/check_valid_question_id';
const check_id_success_msg = 'Success';
const save_url = '/save_user_roadmap';
const save_success_msg = 'Success';

export class CreateNewRoadMap extends Component {
    constructor(props) {
        // assumes user does not change
        super(props);
        this.state = {
            title: '',
            description: '',
            data: {name: '-1: entry', children: []},
            current_node_id: -1,
            current_parent_id: -1,
            is_successfully_added: true,
            is_successfully_deleted: true,
            is_successfully_saved: false,
            is_click_submitted: false
        };
    }

    recursiveAdd(curr_obj, node_id, node_name, parent_id) {
        let id = curr_obj.name.split(':')[0];
        if (id === parent_id.toString()) {
            if (!('children' in curr_obj)) {
                item.children = [];
            }
            curr_obj.children.push({name: node_id.toString()+': '+node_name, children: []});

            return 'done';
        }
        for(let item of curr_obj['children']) {
            if (this.recursiveAdd(item, node_id, node_name, parent_id) === 'done') {
                return 'done';
            }
        }
        return 'undone';
    }

    recursiveFind(curr_obj, node_id) {
        let id = curr_obj.name.split(':')[0];
        if (id === node_id.toString()) {
            return 'done';
        }
        for(let item of curr_obj['children']) {
            if (this.recursiveAdd(item, node_id) === 'done') {
                return 'done';
            }
        }
        return 'undone';
    }

    addNoteToData() {
        let node_id = this.state.current_node_id;
        let parent_id = this.state.current_parent_id;
        if (this.recursiveFind(this.state.data, parent_id) !== 'done') {
            return;
        }
        axios.post(check_id_url, {
            question_id: node_id
        }).then(response => {
            if (response.data['msg'] === check_id_success_msg) {
                let node_name = response.data['name'];
                let prev_data = JSON.parse(JSON.stringify(this.state.data));
                let result = this.recursiveAdd(prev_data, node_id, node_name, parent_id);
                console.log(prev_data, node_id, node_name, parent_id);
                this.setState({data: prev_data, is_successfully_added: result === 'done'});
            } else {
                this.setState({is_successfully_added: false});
            }
        })
    }

    recursiveDelete(curr_obj, node_id) {
        let children_arr = curr_obj.children.map(item => item.name.split(':')[0]);
        let index = children_arr.indexOf(node_id.toString());
        if (index !== -1) {
            curr_obj.children.splice(index, 1);
            return 'done';
        }
        for (let item of curr_obj['children']) {
            if (this.recursiveDelete(item, node_id) === 'done') {
                return 'done';
            }
        }
        return 'undone';
    }

    deleteNodeFromData() {
        let node_id = this.state.current_node_id;
        if (this.recursiveFind(node_id) !== 'done') {
            return;
        }
        axios.post(check_id_url, {
            question_id: node_id
        }).then(response => {
            if (response.data.msg === check_id_success_msg) {
                let prev_data = JSON.parse(JSON.stringify(this.state.data));
                let result = this.recursiveDelete(prev_data, node_id);
                this.setState({data: prev_data, is_successfully_added: result === 'done'});
            } else {
                this.setState({is_successfully_added: false});
            }
        })
    }

    saveDiagram() {
        axios.post(save_url, {
            title: this.state.title,
            description: this.state.description,
            author: this.props.user,
            graphData: this.state.data
        }).then(response => {
            this.setState({is_successfully_saved: response.data === save_success_msg, is_click_submitted: true});
        })
    }

    render() {
        let failed_to_submit_display = null;
        let failed_to_add_node = null;
        let failed_to_delete_node = null;
        if (this.state.is_click_submitted !== false) {
            if (this.state.is_successfully_added) {
                failed_to_submit_display = <section>Failed to Submit</section>;
            } else {
                failed_to_submit_display = <section>Successfully Submitted</section>;
            }

            if (!this.state.is_successfully_added) {
                failed_to_add_node = <section>Node of id {this.state.current_node_id} cannot be added</section>;
            }

            if (!this.state.is_successfully_deleted) {
                failed_to_delete_node = <section>Node of id {this.state.current_node_id} cannot be deleted</section>;
            }
        }
        return (
            <div>
                <h4>Title</h4>
                <input type={'text'} value={this.state.title} onChange={e => this.setState({title: e.target.value})}/>
                <h4>Description</h4>
                <textarea value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
                <h4>Add Node</h4>
                <div>
                    <input type={'number'} value={this.state.current_node_id} onChange={e => this.setState({current_node_id: e.target.value})}/> from parent <input  type={'number'} value={this.state.current_parent_id} onChange={e => this.setState({current_parent_id: e.target.value})}/>
                    <button onClick={() => this.addNoteToData()}>Add!</button>
                    {failed_to_add_node}
                </div>
                <h4>Delete Node</h4>
                <div>
                    <input type={'number'} value={this.state.current_node_id} onChange={e => this.setState({current_node_id: e.target.value})}/>
                    <button onClick={() => this.deleteNodeFromData()}>Delete!</button>
                    {failed_to_delete_node}
                </div>
                <h4>Preview</h4>
                <div>
                    <RoadMapDraw data={this.state.data}/>
                </div>
                <button onClick={() => this.saveDiagram()}>Save</button>
                {failed_to_submit_display}
            </div>
        );
    }
}