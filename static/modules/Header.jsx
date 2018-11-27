import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';

import "../styles/Header.scss"

export class Header extends Component {
    changeFolding() {
        this.props.updating_method(!this.props.is_fold);
    }
    render() {
        return <h2 className={'Header'}>{this.props.is_fold ? (<FontAwesomeIcon className={'header_arrow'} icon={faArrowRight} onClick={() => this.changeFolding()}/>) : (<FontAwesomeIcon className={'header_arrow'} icon={faArrowLeft} onClick={() => this.changeFolding()}/>)}</h2>
    }
}