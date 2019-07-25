import sdom, {h} from '../../src/index'

let createdNum = 0
let patch = sdom([{
  create () {
    createdNum += 1
  }
}])

// 文本节点不会执行create
let vnode1 = h('div', [h('em', 'hello world, '), h('p', 'asdfasdf')])
let vnode2 = h('div', [h('em', 'hello world, '), h('span', 'cjw')])
patch(document.querySelector('.container'), vnode1)

console.log( createdNum)

setTimeout(() => {
  // patch(vnode1, vnode2)
  console.log( createdNum)
}, 3000);