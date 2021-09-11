import {createElement as h} from 'react'
const id = 'alfilFnP'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5', strokeWidth:0},
h('defs', null,
  h('rect', {id, height:1, width:1}),
  h('g', {id:'alfilFnGoal', className:'goal', transform:'translate(-.5 -.5)'},
    h('rect', {height:'1', width:'1'}),
    h('rect', {height:'1', width:'1', transform:'rotate(45 .5 .5)'}),
  ),
),
h('use', {x:'0', y:'0', xlinkHref, className:piece.move(i, getI([x-2, y-2]), board) ? null : 'off'}),
h('use', {x:'4', y:'0', xlinkHref, className:piece.move(i, getI([x+2, y-2]), board) ? null : 'off'}),
h('use', {x:'0', y:'4', xlinkHref, className:piece.move(i, getI([x-2, y+2]), board) ? null : 'off'}),
h('use', {x:'4', y:'4', xlinkHref, className:piece.move(i, getI([x+2, y+2]), board) ? null : 'off'}),
piece.goal && h('use', {xlinkHref:'#alfilFnGoal', transform:'translate(2.5 2.5)'}),
)
}
