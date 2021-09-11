import {createElement as h} from 'react'
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5', strokeWidth:0},
h('defs', null,
  h('g', {id:'rookFnGoal', className:'goal', transform:'translate(-.5 -.5)'},
    h('rect', {height:'1', width:'1'}),
    h('rect', {height:'1', width:'1', transform:'rotate(45 .5 .5)'}),
  ),
),
h('g', {className:'off'},
  h('rect', {x:'2', y:'0', height:'5', width:'1'}),
  h('rect', {x:'0', y:'2', height:'1', width:'5'}),
),
piece.move(i, getI([x, y-1]), board) && h('rect', {x:'2', height:'3', width:'1'}),
piece.move(i, getI([x-1, y]), board) && h('rect', {x:'0', y:'2', height:'1', width:'3'}),
piece.move(i, getI([x+1, y]), board) && h('rect', {x:'2', y:'2', height:'1', width:'3'}),
piece.move(i, getI([x, y+1]), board) && h('rect', {x:'2', y:'2', height:'3', width:'1'}),
piece.goal && h('use', {xlinkHref:'#rookFnGoal', transform:'translate(2.5 2.5)'}),
)
}
