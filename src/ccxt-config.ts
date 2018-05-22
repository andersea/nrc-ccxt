import * as ccxt from 'ccxt';
import { Red } from 'node-red';

import { IccxtConfigNode, IccxtConfigNodeProperties } from './ccxt-common';

export = (RED: Red) => {
    RED.nodes.registerType('ccxt-config', function(
        this: IccxtConfigNode,
        props: IccxtConfigNodeProperties
    ) {
        RED.nodes.createNode(this, props);

        let nonceCounter = -1515351273241;
        function nonce() {
            return Date.now() + nonceCounter++;
        }

        this.exchange = new (ccxt as any)[props.exchange]({
            apiKey: props.apiKey,
            login: props.login,
            password: props.password,
            secret: props.secret,
            uid: props.uid,
        });
        this.exchange.nonce = nonce;
        this.exchange.enableRateLimit = true;
        this.exchange.rateLimit = 500;
        if (props.test && this.exchange.urls.test) {
            this.exchange.urls.api = this.exchange.urls.test;
        }
        const ccxtGlobal = this.context().global.get('ccxt') || {};
        ccxtGlobal[this.exchange.id] = this.exchange;
        this.context().global.set('ccxt', ccxtGlobal);
    });
};
