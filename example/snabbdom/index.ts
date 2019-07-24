const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default
])

const h = require('snabbdom/h').default


console.log('movie:::')
// 0. 能够显示
// 1. 能够排序
// 2. 能够添加
// 3. 能够删除

let nextKey = 3
const margin = 8
const originData = [{ rank: 1, title: 'bbbbb', offset: 0, elmHeight: 0 }, { rank: 2, title: 'aaaaa', offset: 0, elmHeight: 0 }]
let vnode = null
let data = [...originData]

function itemView(item) {
  console.log(item.rank)
  return h('div.item', {
    key: item.rank,
    style: { 
      opacity: '0', 
      transform: 'translate(-200px)',
      // 初始动画，有助于实现
      delayed: {
        transform: `translateY(${item.offset}px)`,
        opacity: '1'
      },
      remove: {
        opacity: '0',
        transform: `translateY(${item.offset}px) translateX(200px)`,
      }
    },
    hook: {
      insert(vnode) {
        item.elmHeight = vnode.elm.offsetHeight
      }
    }
  }, [
    `${item.rank}---${item.title}`,
    h('button', {on: {click: () => remove(item)}}, 'X')
  ])
}

function view(data) {
  console.log(data)

  return h('div', 'Top 10 movies', [
    h('div', [
      h('button', {on: {
        click: () => toggleSort('rank')
      }}, 'rank'),
      h('button', {on: {
        click: () => toggleSort('title')
      }}, 'title'),
      h('button', {on: {
        click: () => add()
      }}, 'add'),
      h('button', {on: {
        click: () => empty()
      }}, 'empty')
    ]),
    h('div',  data.map(itemView))
  ])
}

function render() {
  data = data.reduce(function (acc, m) {
    // 计算item的偏移量
    let last = acc[acc.length - 1]
    m.offset = last ? last.offset + last.elmHeight + margin : margin
    return acc.concat(m)
  }, [])

  vnode = patch(vnode, view(data))
  console.log(vnode)
}

// 切换排序
function toggleSort (prop) {
  data.sort(function (a, b) {
    if (a[prop] > b[prop]) {
      return 1
    }
    if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  })
  render()
}

function remove (item) {
  data = data.filter(v => {
    return item !== v
  })
  render()
}
function add () {
  let item = {
    rank: nextKey++, 
    title: Math.random().toString(16).substr(2, 6), 
    offset: 0, 
    elmHeight: 0
  }
  data = [item].concat(data)
  // 执行2次，第一次添加  》》》 加入后计算高度 》》》 第二次render
  render()
  render()
}

function empty () {
  data = []
  render()
  render()
}

window.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');
  // 将虚拟节点插入进去
  vnode = patch(container, view(data))
  // 计算位置，动画进入
  render()
})