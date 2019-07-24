export default {
  tagName(elm: Element) {
    return elm.tagName
  },
  createComment(text: string): Comment {
    return document.createComment(text)
  },
  createElement(tag: string): Element {
    return document.createElement(tag)
  },
  appendChild(parent: Node, child: Node) {
    parent.appendChild(child)
  },
  createTextNode(text: string): Node {
    return document.createTextNode(text)
  },
  parentNode(elm: Node): Node | null {
    return elm.parentNode
  },
  insertBefore(parent: Node, elm: Node, before: Node | null): Node {
    return parent.insertBefore(elm, before)
  },
  nextSibling(elm: Node): Node | null {
    return elm.nextSibling
  }
}
