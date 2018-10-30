import React, {Component} from 'react'

export class Header extends Component {
    get style() {
        return {
            margin: '2em auto',
            order: 1
        };
    }
    render() {
        return <h1 style={this.style} className={'Header'}>CodeCraft Site! In Development Though</h1>
    }
}