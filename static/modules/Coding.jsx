import React, {Component} from 'react'
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/github';


class EditorConfigPanel extends Component {
    constructor(props) {
        super(props);
        this.settings = {
            mode: '',
            theme: '',
            fontSize: '',
            showGutter: '',
            showPrintMargin: '',
            highlightActiveLine: '',
            wrapEnabled: '',
            enableBasicAutocompletion: '',
            enableLiveAutocompletion: '',
            tabSize: ''
        }
    }
}

class QuestionDisplayPanel extends Component {

}

class QuestionFeedbackPanel extends Component {

}

class CodingInterface extends Component {
    constructor(props) {
        super(props);
    }
}
