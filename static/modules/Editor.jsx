import React, {Component} from 'react'
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/mysql';
import 'brace/mode/mysql';
import 'brace/mode/sass';
import 'brace/mode/markdown';
import 'brace/mode/json';
import 'brace/mode/html';
// import 'brace/mode/go';
import 'brace/mode/csharp';
import 'brace/mode/elixir';
import 'brace/mode/typescript';
import 'brace/mode/css';

import 'brace/theme/github';
import 'brace/theme/xcode';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/textmate';
import 'brace/theme/terminal';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';

import 'brace/snippets/html';
import 'brace/ext/language_tools';


const staticSettings = {
    get all_settings() {
        return {
            language: ['javascript', 'java', 'python', 'xml', 'ruby', 'sass', 'markdown', 'mysql', 'json', 'html', 'c#', 'elixir', 'typescript', 'css'],
            theme: ['monokai', 'github', 'tomorrow', 'kuroir', 'twilight', 'xcode', 'textmate', 'solarized_dark', 'solarized_light', 'terminal'],
            fontSize: {
                min: 1,
                max: 100,
                default_value: 12
            },
            enableBasicAutocompletion: [true, false],
            showGutter: [true, false],
            showPrintMargin: [true, false],
            highlightActiveLine: [true, false],
            wrapEnabled: [true, false],
            showLineNumbers: [true, false],
            enableLiveAutocompletion: [true, false],
            tabSize: {
                min: 0,
                max: 100,
                default_value: 4
            }
        }
    },

    configurationTypes(key) {
        const obj = this.all_settings[key];
        if (Array.isArray(obj) && obj[0] === true) {
            return 'binary';
        } else if (obj.hasOwnProperty('min')) {
            return 'range';
        } else {
            return 'list';
        }
    }
};



class EditorConfigItem extends Component {
    update(key_name, value) {
        this.props.updating_method(key_name, value);
    }
    render() {
        const props = this.props;
        const item_key = props.key_name;
        const item_value = props.value;
        switch (staticSettings.configurationTypes(item_key)) {
            case 'binary':
                return <label>
                    <input
                        type={"checkbox"}
                        checked={item_value}
                        name={item_key}
                        onChange={(e) => {this.update(item_key, e.target.value)}}
                    />
                    {item_key}
                    </label>;
            case 'list':
                const arr_options = staticSettings.all_settings[item_key].map(x => {
                    return <option key={'EditorConfigItem_option_'+x} value={x}>{x}</option>;
                });
                return <select value={item_value} onChange={(e) => {this.update(item_key, e.target.value)}}>{arr_options}</select>;
            default:
                return <input
                    type={'number'}
                    name={item_key}
                    min={staticSettings.all_settings[item_key].min}
                    max={staticSettings.all_settings[item_key].max}
                    value={item_value}
                    onChange={(e) => {this.update(item_key, e.target.value)}}
                />
        }
    }
}


class EditorConfigPanel extends Component {
    render() {
        const settings = this.props.settings;
        const elements = [];
        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                // distinguish different types of keys
                elements.push(<EditorConfigItem key={'EditorConfigItem'+'_'+key} key_name={key} value={settings[key]} updating_method={(key_name, value) => this.props.updating_method(key_name, value)}/>)
            }
        }
        return <div className={'EditorConfigPanel'}>{elements}</div>;
    }
}

export class Editor extends Component {
    constructor(props) {
        super(props);
        let settings = {};
        const all_settings = staticSettings.all_settings;

        for (const key in all_settings) {
            if (all_settings.hasOwnProperty(key)) {
                const data = all_settings[key];
                const data_type = staticSettings.configurationTypes(key);
                if (data_type === 'range') {
                    settings[key] = data.default_value;
                } else {
                    settings[key] = data[0];
                }
            }
        }

        this.state = {
            settings: settings
        };
    }

    updateSettings(key_name, value) {
        const prev_settings = this.state.settings;
        prev_settings[key_name] = value;
        this.setState({
            settings: prev_settings
        });
        if (key_name === 'language') {
            this.props.updating_content('editor_language', value);
        }
    }

    componentDidMount() {
        this.props.updating_content('editor_language', this.state.settings.language);
    }


    render() {
        const settings = this.state.settings;
        return [
            <EditorConfigPanel key={'EditorConfigPanel'} settings={settings} updating_method={(key_name, value) => this.updateSettings(key_name, value)}/>,
            <AceEditor
                key={'CoreEditor'}
                name={'CoreEditor'}
                mode={settings.language === 'c#' ? 'csharp':settings.language}
                theme={settings.theme}
                value={this.props.content}
                setOptions={{
                    enableBasicAutocompletion: settings.enableBasicAutocompletion,
                    enableLiveAutocompletion: settings.enableLiveAutocompletion,
                    showLineNumbers: settings.showLineNumbers,
                    tabSize: settings.tabSize,
                    fontSize: `${settings.fontSize}`+'px'
                }}
                showGutter={settings.showGutter}
                showPrintMargin={settings.showPrintMargin}
                highlightActiveLine={settings.highlightActiveLine}
                wrapEnabled={settings.wrapEnabled}
                onBlur={(event, editor) => this.props.updating_content('editor_content', editor.getValue())}
            />
        ];
    }
}




