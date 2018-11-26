import React, {Component} from 'react';

import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinkHorizontal } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';
import { LinearGradient } from '@vx/gradient';


/*
*   https://vx-demo.now.sh/trees
* */

function Node({ node, events }) {
    const width = 40;
    const height = 20;
    return (
        <Group top={node.x} left={node.y}>
            {node.depth === 0 &&
            <circle
                r={20}
                fill="url('#lg')"
            />
            }
            {node.depth !== 0 &&
            <rect
                height={height}
                width={width}
                y={-height / 2}
                x={-width / 2}
                fill={"#ffffff"}
                stroke={node.children ? "#6FB5E3" : "#4CDACB"}
                strokeWidth={1}
                strokeDasharray={!node.children ? "2,2" : "0"}
                strokeOpacity={!node.children ? .6 : 1}
                rx={!node.children ? 10 : 0}
                onClick={() => {
                    alert(`clicked: ${JSON.stringify(node.data.name)}`)
                }}
            />
            }
            <text
                dy={".33em"}
                fontSize={9}
                fontFamily="Arial"
                textAnchor={"middle"}
                style={{ pointerEvents: "none" }}
                fill={node.depth === 0 ? "#71248e" : node.children ? "white" : "#26deb0"}
            >
                {node.data.name}
            </text>
        </Group>
    );
}

function Link({ link }) {
    return (
        <LinkHorizontal
            data={link}
            stroke="#374469"
            strokeWidth="1"
            fill="none"
        />
    );
}

export class RoadMapDraw extends Component {
    render() {
        const raw_data = this.props.data;
        // expected data structure: a json object with {name: 'id: Name', children: []}
        const data = hierarchy(raw_data);
        const config = {
            width: '10em',
            height: '5em',
            margin: {
                top: '1em',
                left: '1em',
                bottom: '1em',
                right: '1em'
            }
        };

        return (
            <div>
                <svg width={config.width} height={config.width}>
                    <LinearGradient id="lg" from="#fd9b93" to="#fe6e9e" />
                    <rect
                        width={config.width}
                        height={config.height}
                        rx={14}
                        fill="#272b4d"
                    />
                    <Tree
                        top={config.margin.top}
                        left={config.margin.left}
                        root={data}
                        size={[
                            config.height - config.margin.top - config.margin.bottom,
                            config.width - config.margin.left - config.margin.right
                        ]}
                        nodeComponent={Node}
                        linkComponent={Link}
                    />
                </svg>
            </div>
        );
    }
}