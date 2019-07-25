import VNode from './vnode'
import { VNodeData } from '../type'
import { isArray } from 'util'
import { isPrimitive } from '../helper/is'

export type VNodeChildElement = VNode | string | number | undefined | null
export type ArrayOrElement<T> = T | T[]
export type VNodeChildren = ArrayOrElement<VNodeChildElement>

export function h(sel: string): VNode
export function h(sel: string, data: VNodeData): VNode
export function h(sel: string, children: VNodeChildren): VNode
export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode
export function h(sel: any, b?: any, c?: any): VNode {
  let data: VNodeData = {} as VNodeData,
    children: any,
    text: any

  if (c !== undefined) {
    data = b
    if (isArray(c)) children = c
    else if (isPrimitive(c)) text = c
    else if (c && c.sel) children = [c]
  } else if (b !== undefined) {
    if (isArray(b)) children = b
    else if (isPrimitive(b)) text = b
    else if (b && b.sel) children = [b]
    else {
      data = b
    }
  }

  // 将children全部为字符串的转为vnode节点
  if (children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      if (isPrimitive(children[i])) {
        children[i] = new VNode(undefined, undefined, undefined, undefined, children[i])
      }
    }
  }

  return new VNode(sel, data, children, undefined, text)
}
