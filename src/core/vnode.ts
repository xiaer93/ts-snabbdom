import { Key, VNodeData } from '../type'

// 有children就没有text，有text的为文本或注释节点
// children和text二选一？

// 对内的vnode
export default class VNode {
  key?: Key
  constructor(
    public sel?: string,
    public data?: VNodeData,
    public children?: Array<VNode>,
    public elm?: Node,
    public text?: string
  ) {
    this.key = data === undefined ? undefined : data.key
  }
}
