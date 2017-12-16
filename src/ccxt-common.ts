import { Node, NodeId, NodeProperties } from 'node-red';

// export type unifiedApiPublic = 'loadMarkets' |
//  'fetchMarkets' |
// 'fetchTicker' |
// 'fetchTickers' |
// 'fetchOrderBook' |
// 'fetchOHLCV' |
// 'fetchTrades'
// 'createOrder' |
// 'cancelOrder' |
// 'fetchOrder' |
// 'fetchOrders' |
// 'fetchOpenOrders' |
// 'fetchClosedOrders' |
// 'fetchMyTrades' |
// 'deposit' |
// 'withdraw';

// export interface IExchangeUrls {
//     api: string;
//     www: string;
//     doc: string;
//     test?: string;
//     logo?: string;
// }

export interface IccxtConfigNode extends Node {
    exchange: any;
}

export interface IccxtConfigNodeProperties extends NodeProperties {
    exchange: string;
    uid: string;
    login: string;
    apiKey: string;
    secret: string;
    password: string;
    test: boolean;
}

export interface IccxtNodeProperties extends NodeProperties {
    config: NodeId;
}
