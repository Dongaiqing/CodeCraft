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
    const width = 80;
    const height = 40;
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
                strokeWidth={2}
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
                fill={node.depth === 0 ? "#d4d7d8" : node.children ? "white" : "#20acdb"}
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
            strokeWidth="2"
            fill="none"
            distance={30}
        />
    );
}

export class RoadMapDraw extends Component {
    render() {
        const raw_data = this.props.data;
        // expected data structure: a json object with {name: 'id: Name', children: []}
        const data = hierarchy(raw_data);
        const config = {
            width: 500,
            height: 500,
            margin: {
                top: 50,
                left: 50,
                bottom: 50,
                right: 50
            }
        };

        return (
            <div>
                <svg width={config.width} height={config.width}>
                    <LinearGradient id="lg" from="#45B1D9" to="#1B93C1" />
                    <rect
                        width={config.width}
                        height={config.height}
                        rx={25}
                        fill="#DAE3E6"
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