import React, {Component} from 'react';
import axios from 'axios';
import {RoadMapDraw} from "./RoadMapDraw";


const save_url = '/save_user_roadmap';
const save_success_msg = 'Success';

export class CreateNewRoadMap extends Component {
    constructor(props) {
        // assumes user does not change
        super(props);
        this.state = {
            title: '',
            description: '',
            data: {name: '-1: entry'},
            current_node_id: -1,
            current_parent_id: -1,
            is_successfully_added: true,
            is_successfully_deleted: true,
            is_successfully_saved: false
        };
    }

    recursiveAdd(curr_obj, node_id, node_name, parent_id) {
        for(let item of curr_obj) {
            let id = item.name.replace(/(^\d+)(.+$)/i,'$1');
            if (id === parent_id) {
                if (!('children' in item)) {
                    item.children = [];
                }
                item.children.push({name: node_id.toString()+' '+node_name});
                return 'done';
            }
            if ('children' in item) {
                return this.recursiveAdd(item.children, node_id, node_name, parent_id);
            }
        }
        return 'undone';
    }

    recuriveFindName(curr_obj, node_id) {
        for(let item of curr_obj) {
            let id = item.name.replace(/(^\d+)(.+$)/i,'$1');
            if (id === node_id) {
                return item.name;
            }
            if ('children' in item) {
                return this.recursiveAdd(item.children, node_id, node_name, parent_id);
            }
        }
        return 'undone';
    }

    addNoteToData() {
        let node_id = this.state.current_node_id;
        let parent_id = this.state.current_parent_id;
        let sent_data = [];
        if (parent_id === -1) {
            sent_data.push(node_id);
        } else {
            sent_data.push(node_id, parent_id);
        }
        let node_name = this.recuriveFindName(this.state.data, node_id);
        if (node_name !== 'undone') {
            let prev_data = JSON.parse(JSON.stringify(this.state.data));
            let result = this.recursiveAdd(prev_data, node_id, node_name, parent_id);
            this.setState({data: prev_data, is_successfully_added: result === 'done'});
        } else {
            this.setState({is_successfully_added: false});
        }
    }

    recursiveDelete(curr_obj, node_id) {
        for (let item of curr_obj) {
            if ('children' in item) {
                let children_arr = item.children.map(item => item.name.replace(/(^\d+)(.+$)/i,'$1'));
                let index = children_arr.indexOf(node_id);
                if (index !== -1) {
                    item.children.splice(index, 1);
                    return 'done';
                }
                return this.recursiveDelete(item.children, node_id);
            }
        }
        return 'undone';
    }

    deleteNodeFromData() {
        let node_id = this.state.current_node_id;
        let node_name = this.recuriveFindName(this.state.data, node_id);
        if (node_name !== 'undone') {
            let prev_data = JSON.parse(JSON.stringify(this.state.data));
            let result = this.recursiveDelete(prev_data, node_id);
            this.setState({data: prev_data, is_successfully_added: result === 'done'});
        } else {
            this.setState({is_successfully_added: false});
        }
    }

    saveDiagram() {
        axios.post(save_url, {
            title: this.state.title,
            description: this.state.description,
            author: this.props.user,
            graphData: this.state.data
        }).then(response => {
            this.setState({is_successfully_saved: response.data === save_success_msg});
        })
    }

    render() {
        let failed_to_submit_display = null;
        let failed_to_add_node = null;
        let failed_to_delete_node = null;
        if (this.state.title !== '') {
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