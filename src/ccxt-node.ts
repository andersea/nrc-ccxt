import * as NodeRED from 'node-red';
import { IccxtConfigNode, IccxtNodeProperties } from './ccxt-common';

export = (RED: NodeRED.Red) => {
    function CCXTNode(this: NodeRED.Node, props: IccxtNodeProperties) {
        RED.nodes.createNode(this, props);

        const configNode = RED.nodes.getNode(props.config) as IccxtConfigNode;

        this.on('input', msg => {
            configNode.exchange
                [msg.topic](msg.payload, msg.params)
                .then((result: any) => {
                    msg.payload = result;
                    this.send(msg);
                })
                .catch((reason: any) => {
                    this.error(reason);
                });
        });
    }

    RED.nodes.registerType('ccxt', CCXTNode);
};
