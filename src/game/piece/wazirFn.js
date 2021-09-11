import {createElement as h} from 'react'
const id = 'wazirFnP'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 3 3', strokeWidth:0},
h('defs', null,
  h('rect', {id, height:1, width:1}),
  h('g', {id:'wazirFnGoal', className:'goal', transform:'translate(-1 -1)'},
    h('rect', {height:'2', width:'2'}),
    h('rect', {height:'2', width:'2', transform:'rotate(45 1 1)'}),
  ),
),
h('use', {x:'1', y:'0', xlinkHref, className:piece.move(i, getI([x, y-1]), board) ? null : 'off'}),
h('use', {x:'0', y:'1', xlinkHref, className:piece.move(i, getI([x-1, y]), board) ? null : 'off'}),
h('use', {x:'2', y:'1', xlinkHref, className:piece.move(i, getI([x+1, y]), board) ? null : 'off'}),
h('use', {x:'1', y:'2', xlinkHref, className:piece.move(i, getI([x, y+1]), board) ? null : 'off'}),
piece.goal && h('use', {xlinkHref:'#wazirFnGoal', transform:'translate(1.5 1.5) scale(.5)'}),
)
}


