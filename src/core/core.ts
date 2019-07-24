// import { VNode } from "../type";
import VNode from './vnode'
import api from './domApi'
import { isVNode, isUndef, isDef, isArray, isPrimitive, isSameVNode } from '../helper/is'
import { Key } from '../type'

type VNodeQueue = Array<VNode>

export default function() {
  let insertedVnodeQueue: VNodeQueue = []

  return function patch(oldVnode: VNode | Element, vnode: VNode) {
    if (oldVnode === null) {
      return
    }

    if (!isVNode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode as Element)
    }

    if (isSameVNode(oldVnode, vnode)) {
      patchNode(oldVnode, vnode, insertedVnodeQueue)
    } else {
      createElm(vnode, insertedVnodeQueue)

      const elm = oldVnode.elm as Node
      const parent = api.parentNode(elm)

      if (parent !== null) {
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
      }
    }

    return vnode
  }
}

// node->vnode
function emptyNodeAt(elm: Element): VNode {
  const id = elm.id ? `#${elm.id}` : ''
  const cls = elm.className ? elm.className.split(' ').join('.') : ''
  // 类型不符合？
  return new VNode(api.tagName(elm) + id + cls, {}, [], elm)
}

// 创建真实dom并挂载
function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue) {
  let children = vnode.children,
    sel = vnode.sel

  if (sel === '!') {
    // 注释节点
    if (isUndef(vnode.text)) {
      vnode.text = ''
    }
    vnode.elm = api.createComment(vnode.text)
  } else if (sel !== undefined) {
    // 元素节点
    const hashIdx = sel.indexOf('#')
    const dotIdx = sel.indexOf('.', hashIdx)
    const hash = hashIdx > 0 ? hashIdx : sel.length
    const dot = dotIdx > 0 ? dotIdx : sel.length
    const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
    const elm = (vnode.elm = api.createElement(tag))

    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
    if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./gi, ' '))

    if (isArray(vnode.children)) {
      for (let ch of vnode.children!) {
        if (ch !== null) {
          // fixme: vh可能是字符串呀
          api.appendChild(elm, createElm(ch, insertedVnodeQueue))
        }
      }
    } else if (isPrimitive(vnode.text)) {
      api.appendChild(elm, api.createTextNode(vnode.text))
    }
  } else {
    // 文本节点
    vnode.elm = api.createTextNode(vnode.text!)
  }

  return vnode.elm
}

// 对比相同节点策略
// 1、sameVnode，key和sel相同即为相同节点
// 2、vnode节点：children和text属相相斥，二选一。text属性为文本和注释节点。
// 3、
function patchNode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
  const elm: Node = (vnode.elm = oldVnode.elm!)
  let oldCh = oldVnode.children
  let ch = vnode.children
  if (oldVnode === vnode) return

  if (isUndef(vnode.text)) {
    // 新节点有children
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh!, ch!, insertedVnodeQueue)
    } else if (isDef(ch)) {
      // 清空文本
      if (isDef(oldVnode.text)) api.setTextContent(elm, '')
      // 添加节点
      addVnodes(elm, null, ch!, 0, ch!.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh!, 0, oldCh!.length - 1)
    } else if (isDef(oldVnode.text)) {
      api.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 新节点有text
    if (isDef(oldCh)) {
      removeVnodes(elm, oldCh!, 0, oldCh!.length - 1)
    }
    api.setTextContent(elm, vnode.text)
  }
}

// 对比子节点策略
function updateChildren(
  parent: Node,
  oldCh: Array<VNode>,
  newCh: Array<VNode>,
  insertedVnodeQueue: VNodeQueue
) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode: VNode = oldCh[oldStartIdx]
  let oldEndVnode: VNode = oldCh[oldEndIdx]

  let newStartIdx = 0
  let newEndIdx = newCh.length - 1
  let newStartVnode: VNode = newCh[newStartIdx]
  let newEndVnode: VNode = newCh[newEndIdx]

  let oldKeyToIdx: any
  let idxInOld: number
  let elmToMove: VNode
  let before: any

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode === null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode === null) {
      oldEndVnode = oldCh[++oldEndIdx]
    } else if (newStartVnode === null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode === null) {
      newEndVnode = newCh[++newEndIdx]
    }
    // 判断
    else if (isSameVNode(oldStartVnode, newStartVnode)) {
      patchNode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (isSameVNode(oldEndVnode, newEndVnode)) {
      patchNode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (isSameVNode(oldStartVnode, newEndVnode)) {
      patchNode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      // 移动节点位置，将首节点移至尾节点
      api.insertBefore(parent, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (isSameVNode(oldEndVnode, newStartVnode)) {
      patchNode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      // 移动节点位置，将尾节点移至首节点
      api.insertBefore(parent, oldEndVnode.elm!, oldStartVnode.elm!)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 没有节点相同
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }

      idxInOld = oldKeyToIdx[newStartVnode.key!]
      if (isUndef(idxInOld)) {
        // key值不相同, 则直接插入新节点
        api.insertBefore(parent, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
        newStartVnode = newCh[++newStartIdx]
      } else {
        // key值相同
        const elmToMove = oldCh[idxInOld]
        // 不是同一个节点
        if (elmToMove.sel !== newStartVnode.sel) {
          api.insertBefore(parent, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
        } else {
          // 同一个节点则patch，同时移动节点至头部
          patchNode(elmToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined as any
          api.insertBefore(parent, elmToMove.elm!, oldStartVnode.elm!)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }

  // 处理尚未判断的节点， 如待删除的节点/待添加节点
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
      addVnodes(parent, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else {
      removeVnodes(parent, oldCh, oldStartIdx, oldEndIdx)
    }
  }
}

// 添加子节点策略
// 1、将子节点[startIndex, endIndex]加入parent-dom之内
// 2、调用createElm创建真实dom
function addVnodes(
  parent: Node,
  before: Node | null,
  vnodes: Array<VNode>,
  startIndex: number,
  endIndex: number,
  insertedVnodeQueue: VNodeQueue
) {
  for (; startIndex <= endIndex; ++startIndex) {
    let ch = vnodes[startIndex]
    if (ch !== null) {
      api.insertBefore(parent, createElm(ch, insertedVnodeQueue), before)
    }
  }
}

// 移除子节点策略
function removeVnodes(parent: Node, vnvnodes: Array<VNode>, startIndex: number, endIndex: number) {
  for (; startIndex <= endIndex; ++startIndex) {
    let listeners: number
    let rm: () => void
    let ch: VNode = vnodes[startIndex]

    // 等待所有remove-hook执行完成后再删除节点
    if (ch !== null) {
      if (isDef(ch.sel)) {
        listeners = 1
        rm = createRmCb(ch.elm!, listeners)
        rm()
      } else {
        // text node
        api.removeChild(parent, ch.elm!)
      }
    }
  }
}

// 创建移除函数回调
function createRmCb(elm: Node, listeners: number) {
  return function() {
    if (--listeners === 0) {
      const parent: Node = api.parentNode(elm)!
      api.removeChild(parent, elm)
    }
  }
}

// 老节点的key和index绑定
function createKeyToOldIdx(children: Array<VNode>, beginIdx: number, endIdx: number) {
  let i: number,
    map: keyToIndexMap = {},
    key: Key | undefined,
    ch: any
  for (i = beginIdx; i <= endIdx; ++i) {
    ch = children[i]
    if (ch !== null) {
      key = ch.key
      if (key !== undefined) map[key] = i
    }
  }
  return map
}

interface keyToIndexMap {
  [key: string]: number
}
