import { Key, VNodeData } from '../type'

// 有children就没有text，有text的为文本或注释节点
// children和text二选一？

// 对内的vnode
export default class VNode {
  sel?: string
  data?: VNodeData
  children?: Array<VNode>
  elm?: Node
  text?: string
  key?: Key
  constructor(sel?: string, data?: VNodeData, children?: Array<VNode>, elm?: Node, text?: string) {
    this.sel = sel
    this.data = data
    this.children = children
    this.elm = elm
    this.text = text
    this.key = data === undefined ? undefined : data.key
  }
}
