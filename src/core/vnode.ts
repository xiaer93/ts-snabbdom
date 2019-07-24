import { Key, VNodeData } from '../type'

// 对内的vnode
export default class VNode {
  constructor(
    public sel?: string,
    public data?: VNodeData,
    public children?: Array<VNode>,
    public elm?: Node,
    public text?: string,
    public key?: Key
  ) {}
}
