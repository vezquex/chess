import {createElement as h} from 'react'
const id = 'pawnFnP'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [a, b] = getPos(i)
const two = piece.move(i, getI([a, b-2]), board)
const y = '1'
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5', strokeWidth:0},
h('defs', null,
  h('rect', {id, height:'1', width:'1'}),
  h('g', {id:'pawnFnGoal', className:'goal', transform:'translate(-.5 -.5)'},
    h('rect', {height:'1', width:'1'}),
    h('rect', {height:'1', width:'1', transform:'rotate(45 .5 .5)'}),
  ),
),
two && h('rect', {id, height:'.6', width:'.6', x:'2.2', y:'.2'}),
h('use', {x:'1', y, xlinkHref, className:piece.move(i, getI([a-1, b-1]), board) ? null : 'off'}),
h('use', {x:'2', y, xlinkHref, className:piece.move(i, getI([a, b-1]), board) ? null : 'off'}),
h('use', {x:'3', y, xlinkHref, className:piece.move(i, getI([a+1, b-1]), board) ? null : 'off'}),
piece.goal && h('use', {xlinkHref:'#pawnFnGoal', transform:'translate(2.5 2.5)'}),
)
}
