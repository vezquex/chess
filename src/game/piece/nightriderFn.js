import {createElement as h} from 'react'
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'-.3 -.3 10.6 10.6' , strokeWidth:1.5},
h('defs', null,
  h('g', {id:'nightriderFnGoal', className:'goal', transform:'translate(-.5 -.5)', strokeWidth:0},
    h('rect', {height:'1', width:'1'}),
    h('rect', {height:'1', width:'1', transform:'rotate(45 .5 .5)'}),
  ),
),
h('path', {d:'M3,2 l-1,-2', className:piece.move(i, getI([x-1, y-2]), board) ? null : 'off'}),
h('path', {d:'M7,2 l1,-2' , className:piece.move(i, getI([x+1, y-2]), board) ? null : 'off'}),
h('path', {d:'M2,3 l-2,-1', className:piece.move(i, getI([x-2, y-1]), board) ? null : 'off'}),
h('path', {d:'M8,3 l2,-1' , className:piece.move(i, getI([x+2, y-1]), board) ? null : 'off'}),
h('path', {d:'M2,7 l-2,1' , className:piece.move(i, getI([x-2, y+1]), board) ? null : 'off'}),
h('path', {d:'M8,7 l2,1'  , className:piece.move(i, getI([x+2, y+1]), board) ? null : 'off'}),
h('path', {d:'M3,8 l-1,2' , className:piece.move(i, getI([x-1, y+2]), board) ? null : 'off'}),
h('path', {d:'M7,8 l1,2'  , className:piece.move(i, getI([x+1, y+2]), board) ? null : 'off'}),
piece.goal && h('use', {xlinkHref:'#nightriderFnGoal', transform:'translate(5 5) scale(2)'}),
)
}
