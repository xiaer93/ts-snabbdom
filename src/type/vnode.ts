export type Key = string | number

// 导出类型
export interface VNode {
  sel?: string
  data?: VNodeData
  children?: Array<VNode | string>
  elm?: Node
  text?: string
}

export interface VNodeData {
  [key: string]: any
}
