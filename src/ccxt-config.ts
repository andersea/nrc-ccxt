import * as ccxt from 'ccxt';
import { Red } from 'node-red';

import { IccxtConfigNode, IccxtConfigNodeProperties } from './ccxt-common';

export = (RED: Red) => {
    RED.nodes.registerType('ccxt-config', function(
        this: IccxtConfigNode,
        props: IccxtConfigNodeProperties
    ) {
        RED.nodes.createNode(this, props);
        this.exchange = new (ccxt as any)[props.exchange]({
            apiKey: props.apiKey,
            login: props.login,
            password: props.password,
            secret: props.secret,
            uid: props.uid,
        });
        if (props.test && this.exchange.urls.test) {
            this.exchange.urls.api = this.exchange.urls.test;
        }
    });
};
