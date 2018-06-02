import { Exchange } from 'ccxt';
import * as NodeRED from 'node-red';

import { IccxtConfigNode, IccxtNodeProperties } from './ccxt-common';

export = (RED: NodeRED.Red) => {
    function findDynamicExchange(exchangeId: string) {
        let exchange: any;
        RED.nodes.eachNode(node => {
            if (!exchange && node.type === 'ccxt-config') {
                const configNode = RED.nodes.getNode(
                    node.id
                ) as IccxtConfigNode;
                if (
                    configNode.exchange &&
                    configNode.exchange.id === exchangeId
                ) {
                    exchange = configNode.exchange;
                }
            }
        });
        return exchange;
    }

    function getConfigNode(configNodeId: NodeRED.NodeId) {
        return RED.nodes.getNode(configNodeId) as IccxtConfigNode;
    }

    function getExchange(props: IccxtNodeProperties, exchangeId: string) {
        return props.dynamic
            ? findDynamicExchange(exchangeId)
            : getConfigNode(props.config).exchange;
    }

    function CCXTNode(this: NodeRED.Node, props: IccxtNodeProperties) {
        RED.nodes.createNode(this, props);

        this.on('input', msg => {
            const exchange = getExchange(props, msg.exchange);

            if (exchange) {
                dispatch(exchange, msg)
                    .then(res => {
                        msg.payload = res;
                        if (!msg.exchange) {
                            msg.exchange = exchange.id;
                        }
                        this.send(msg);
                    })
                    .catch((reason: any) => {
                        this.error(reason);
                    });
            } else {
                this.error('Exchange not configured', msg);
            }
        });
    }

    RED.nodes.registerType('ccxt', CCXTNode);
};

function dispatch(exchange: any, msg: any): Promise<any> {
    try {
        switch (msg.topic) {
            case 'market':
            case 'markets':
                return exchange.loadMarkets().then(() => {
                    if (msg.payload === 'all') {
                        return exchange.markets;
                    } else {
                        return exchange.markets[msg.payload];
                    }
                });
            case 'markets_by_id':
                return exchange.loadMarkets().then(() => {
                    if (msg.payload === 'all') {
                        return exchange.markets_by_id;
                    } else {
                        return exchange.markets_by_id[msg.payload];
                    }
                });
            case 'marketId':
                return exchange
                    .loadMarkets()
                    .then(() => exchange.marketId(msg.payload));
            case 'marketIds':
                return exchange
                    .loadMarkets()
                    .then(() => exchange.marketIds(msg.payload));
            case 'createMarketBuyOrder':
            case 'createMarketSellOrder':
                return exchange[msg.topic](
                    msg.payload.symbol,
                    msg.payload.amount,
                    msg.params                    
                )
            case 'createOrder':
                return exchange.createOrder(
                    msg.payload.symbol,
                    msg.payload.type,
                    msg.payload.side,
                    msg.payload.amount,
                    msg.payload.price,
                    msg.params
                );
            case 'withdraw':
                return exchange.withdraw(
                    msg.payload.currency,
                    msg.payload.amount,
                    msg.payload.address,
                    msg.params
                );
            default:
                return exchange[msg.topic](msg.payload, msg.params);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
