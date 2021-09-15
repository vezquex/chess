import {createElement as h} from 'react'
const id = 'ferzFnP'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5', strokeWidth:0},
h('defs', null,
  h('rect', {id, height:1, width:1}),
  h('g', {id:'ferzFnGoal', className:'goal', transform:'translate(-1 -1)'},
    h('rect', {height:'2', width:'2'}),
    h('rect', {height:'2', width:'2', transform:'rotate(45 1 1)'}),
  ),
),
h('use', {x:'1', y:'1', xlinkHref, className:piece.move(i, getI([x-1, y-1]), board) ? null : 'off'}),
h('use', {x:'3', y:'1', xlinkHref, className:piece.move(i, getI([x+1, y-1]), board) ? null : 'off'}),
h('use', {x:'1', y:'3', xlinkHref, className:piece.move(i, getI([x-1, y+1]), board) ? null : 'off'}),
h('use', {x:'3', y:'3', xlinkHref, className:piece.move(i, getI([x+1, y+1]), board) ? null : 'off'}),
piece.goal && h('use', {xlinkHref:'#ferzFnGoal', transform:'translate(2.5 2.5) scale(.5)'}),
)
}
