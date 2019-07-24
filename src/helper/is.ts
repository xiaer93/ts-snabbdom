import { VNode } from '../type'

export function isVNode(v: any): v is VNode {
  return v.sel !== undefined
}

export function isUndef(v: any): v is undefined {
  return typeof v === 'undefined'
}

export function isDef(v: any): boolean {
  return !isUndef(v)
}

export function isArray<T>(v: any): v is Array<T> {
  return Array.isArray(v)
}

export function isPrimitive(v: any): v is string | number {
  return typeof v === 'string' || typeof v === 'number'
}

// fixme: 为什么需要key相等？
export function isSameVNode(leftNode: VNode, rightNode: VNode): boolean {
  return leftNode.key === rightNode.key && leftNode.sel === rightNode.sel
}
