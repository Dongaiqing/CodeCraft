import React, {Component} from 'react'
import AceEditor from 'react-ace'

import 'brace/mode/java'
import 'brace/mode/html'
import 'brace/mode/javascript'
import 'brace/mode/python'
import 'brace/mode/ruby'
import 'brace/mode/markdown'
// import 'brace/mode/go';
import 'brace/mode/csharp'

import 'brace/theme/github'
import 'brace/theme/xcode'
import 'brace/theme/monokai'
import 'brace/theme/tomorrow'
import 'brace/theme/kuroir'
import 'brace/theme/twilight'
import 'brace/theme/textmate'
import 'brace/theme/terminal'
import 'brace/theme/solarized_dark'
import 'brace/theme/solarized_light'

import 'brace/snippets/html';
import 'brace/ext/language_tools';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowRight} from '@fortawesome/free-solid-svg-icons';


export const staticSettings = {
    get all_settings() {
        return {
            language: ['javascript', 'java', 'python', 'ruby', 'markdown', 'html', 'c#'],
            theme: ['github', 'monokai', 'tomorrow', 'kuroir', 'twilight', 'xcode', 'textmate', 'solarized_dark', 'solarized_light', 'terminal'],
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

    get all_black_themes() {
        return ['monokai', 'twilight', 'solarized_dark', 'terminal'];
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
    get common_item_style() {
        return {
            display: 'block',
            marginBottom: '0.5em'
        }
    }
    render() {
        const props = this.props;
        const item_key = props.key_name;
        const item_value = props.value;
        let items = null;
        let common_key = null;

        const label_style = {
            marginRight: '0.3em'
        };
        switch (staticSettings.configurationTypes(item_key)) {
            case 'binary':
                items = [
                    <label htmlFor={'EditorConfigItem_checkbox_'+item_key} key={'EditorConfigItem_checkbox_label_'+item_key} style={label_style}>{item_key}</label>,
                    <input
                        id={'EditorConfigItem_checkbox_'+item_key}
                        key={'EditorConfigItem_checkbox_'+item_key}
                        type={"checkbox"}
                        checked={item_value}
                        name={item_key}
                        onChange={(e) => {this.update(item_key, e.target.checked)}}
                    />
                ];
                return <div style={this.common_item_style}>{items}</div>;
            case 'list':
                const arr_options = staticSettings.all_settings[item_key].map(x => {
                    return <option key={'EditorConfigItem_option_'+x} value={x}>{x}</option>;
                });
                common_key = 'EditorConfigItem_select_'+item_key;
                items = [
                    <label key={common_key+'_label'} htmlFor={common_key} style={label_style}>Select {item_key}</label>,
                    <select id={common_key} key={common_key} value={item_value} onChange={(e) => {this.update(item_key, e.target.value)}}>{arr_options}</select>
                ];
                return <div style={this.common_item_style}>{items}</div>;
            default:
                common_key = 'EditorConfigItem_range_'+item_key;
                items = [
                    <label key={common_key+'_label'} htmlFor={common_key} style={label_style}>Set {item_key}</label>,
                    <input
                        id={common_key}
                        key={common_key}
                        type={'number'}
                        name={item_key}
                        min={staticSettings.all_settings[item_key].min}
                        max={staticSettings.all_settings[item_key].max}
                        value={item_value}
                        onChange={(e) => {this.update(item_key, e.target.value)}}
                    />
                ];
                return <div style={this.common_item_style}>{items}</div>
        }
    }
}


class EditorConfigPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_fold: true
        };
    }
    render() {
        const settings = this.props.settings;
        const elements = [];
        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                // distinguish different types of keys
                elements.push(<EditorConfigItem key={'EditorConfigItem'+'_'+key} key_name={key} value={settings[key]} updating_method={(key_name, value) => this.props.updating_method(key_name, value)}/>)
            }
        }
        return (<div
            className={'EditorConfigPanel'}>
            <h3 key={'EditorConfigPanel_header'}>Editor Settings {this.state.is_fold ? (<FontAwesomeIcon icon={faArrowRight} onClick={() => this.setState({is_fold: false})}/>) : (<FontAwesomeIcon icon={faArrowDown} onClick={() => this.setState({is_fold: true})}/>)}</h3>
            {this.state.is_fold ? (null) : (<div>{elements}</div>)}
            </div>);
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
        const prev_value = prev_settings[key_name];
        if (Number.isInteger(prev_value)) {
            prev_settings[key_name] = parseInt(value, 10);
        } else if (typeof(prev_value) === 'boolean') {
            prev_settings[key_name] = value;
        } else {
            prev_settings[key_name] = value;
        }
        this.setState({
            settings: prev_settings
        });

        // this.props.updating_content('editor_theme', prev_settings['theme']);
        if (key_name === 'language') {
            this.props.updating_content('editor_language', value);
        }
    }

    componentDidMount() {
        this.props.updating_content('editor_language', this.state.settings.language);
    }


    render() {
        const settings = this.state.settings;
        const items = [
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
        return <div
            className={'questionEditor_content'}>
            {items}
            </div>
    }
}




