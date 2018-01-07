import { Node, NodeId, NodeProperties } from 'node-red';

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
    dynamic: boolean;
}
