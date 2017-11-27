import {createElement as h} from 'react'
const id = 'kingFnP'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5'},
h('defs', null,
  h('rect', {id:'kingFnGoal', height:'1', width:'1'}),
  // h('circle', {id, r:.5, transform:'translate(.5 .5)'}),
  h('rect', {id, height:1, width:1}),
),
h('g', {className:'goal', transform:'translate(2 2)'},
  h('use', {xlinkHref:'#kingFnGoal'}),
  h('use', {xlinkHref:'#kingFnGoal', transform:'rotate(45 .5 .5)'}),
),
h('use', {x:'0', y:'0', xlinkHref, className:piece.move(i, getI([x-1, y-1]), board) ? null : 'off'}),
h('use', {x:'2', y:'0', xlinkHref, className:piece.move(i, getI([x, y-1]), board) ? null : 'off'}),
h('use', {x:'4', y:'0', xlinkHref, className:piece.move(i, getI([x+1, y-1]), board) ? null : 'off'}),
h('use', {x:'0', y:'2', xlinkHref, className:piece.move(i, getI([x-1, y]), board) ? null : 'off'}),
h('use', {x:'4', y:'2', xlinkHref, className:piece.move(i, getI([x+1, y]), board) ? null : 'off'}),
h('use', {x:'0', y:'4', xlinkHref, className:piece.move(i, getI([x-1, y+1]), board) ? null : 'off'}),
h('use', {x:'2', y:'4', xlinkHref, className:piece.move(i, getI([x, y+1]), board) ? null : 'off'}),
h('use', {x:'4', y:'4', xlinkHref, className:piece.move(i, getI([x+1, y+1]), board) ? null : 'off'}),
)
}
