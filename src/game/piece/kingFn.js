import {createElement as h} from 'react'
const id = 'kingFnP'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5', strokeWidth:0},
h('defs', null,
 h('rect', {id:'kingFnGoal', height:1, width:1}),
 h('rect', {id, height:1, width:1}),
),

h('rect', {id, height:3, width:3, x:1, y:1, className:'off'}),
h('g', {transform:'translate(0 0)'},
 piece.move(i, getI([x-1, y-1]), board) ? h('use', {x:'1', y:'1', xlinkHref}) : null,
 piece.move(i, getI([x, y-1]), board) ? h('use', {x:'2', y:'1', xlinkHref}) : null,
 piece.move(i, getI([x+1, y-1]), board) ? h('use', {x:'3', y:'1', xlinkHref}) : null,
 piece.move(i, getI([x-1, y]), board) ? h('use', {x:'1', y:'2', xlinkHref}) : null,
 piece.move(i, getI([x+1, y]), board) ? h('use', {x:'3', y:'2', xlinkHref}) : null,
 piece.move(i, getI([x-1, y+1]), board) ? h('use', {x:'1', y:'3', xlinkHref}) : null,
 piece.move(i, getI([x, y+1]), board) ? h('use', {x:'2', y:'3', xlinkHref}) : null,
 piece.move(i, getI([x+1, y+1]), board) ? h('use', {x:'3', y:'3', xlinkHref}) : null,
),
piece.goal && h('g', {className:'goal', transform:'translate(2 2) scale(1 1)'},
 h('use', {xlinkHref:'#kingFnGoal'}),
 h('use', {xlinkHref:'#kingFnGoal', transform:'rotate(45 .5 .5)'}),
),
)
}
