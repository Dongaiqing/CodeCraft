import React, {Component} from 'react'

export class Header extends Component {
    get style() {
        return {
            margin: '2em auto',
            order: 1,
            color: 'white',
            background: '#5DADE2'
            // borderBottom: '0.1em solid #2471A3'
        };
    }
    render() {
        return <h1 style={this.style} className={'Header'}>CodeCraft Site! In Development Though</h1>
    }
}