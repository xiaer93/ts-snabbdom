import VNode from '../core/vnode'

export type PreHook = () => any
export type InitHook = (vNode: VNode) => any
export type CreateHook = (emptyVnode: VNode, vNode: VNode) => any
export type InsertHook = (vNode: VNode) => any
export type PrePatchHook = (oldVnode: VNode, vNode: VNode) => any
export type UpdateHook = (oldVnode: VNode, vNode: VNode) => any
export type PostPatchHook = (oldVnode: VNode, vNode: VNode) => any
export type DestroyHook = (vNode: VNode) => any
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any
export type PostHook = () => any

export interface Hooks {
  pre?: PreHook
  init?: InitHook
  create?: CreateHook
  insert?: InsertHook
  prepatch?: PrePatchHook
  update?: UpdateHook
  postpatch?: PostPatchHook
  destroy?: DestroyHook
  remove?: RemoveHook
  post?: PostHook
}
