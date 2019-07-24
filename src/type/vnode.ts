export type Key = string | number

export interface VNode {
  sel?: string
  data?: VNodeData
  children?: Array<VNode | string>
  elm?: Node
  text?: string
  key?: Key
}

export interface VNodeData {
  [key: string]: any
}
