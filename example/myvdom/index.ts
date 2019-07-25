import sdom, { h } from '../../src/index'
import styleModule from '../../src/module/style';

let patch = sdom([styleModule])

// 文本节点不会执行create
let vnode1 = h('div', { style: { position:'absolute',color: 'red', transform: 'translate(0, 60px)', transition: 'transform 1s', delayed: { transform: 'translate(0, 0)' } , remove: {transform: 'translate(0, 60px)'}, destroy: {transform: 'translate(0, -60px)', color: '#000'}} }, [h('em', 'hello world, '), h('p', 'asdfasdf')])
let vnode2 = h('p', [h('em', 'hello world, '), h('span', 'cjw')])
patch(document.querySelector('.container'), vnode1)


setTimeout(() => {
  patch(vnode1, vnode2)
}, 3000);