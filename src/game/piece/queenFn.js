import React, {createElement as h} from 'react'
const {cos, PI, sin} = Math
const tau = 2 * PI
const id = 'queenFnX'
const xlinkHref = '#'+id
const r = .2
const rr = 1 + 1/32
const s = tau/32
const ss = tau*.25
const l = i => {
  const a = tau * i / 8
  return `L${r*cos(a-ss)} ${r*sin(a-ss)} ${rr*cos(a-s)} ${rr*sin(a-s)} ${rr*cos(a+s)} ${rr*sin(a+s)} ${r*cos(a+ss)} ${r*sin(a+ss)}`
}
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
const ds = [
  piece.move(i, getI([x+1, y]), board),
  piece.move(i, getI([x+1, y+1]), board),
  piece.move(i, getI([x, y+1]), board),
  piece.move(i, getI([x-1, y+1]), board),
  piece.move(i, getI([x-1, y]), board),
  piece.move(i, getI([x-1, y-1]), board),
  piece.move(i, getI([x, y-1]), board),
  piece.move(i, getI([x+1, y-1]), board),
]
const d = 'M' + ds.map((on, i)  =>on ? l(i) : '').join('').slice(1)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'-1 -1 2 2', strokeWidth:0},
h('defs', null,
  <g id={id}>
    <rect x="-.2" y="-1" height="2" width=".4"/>
    <rect x="-1" y="-.2" height=".4" width="2"/>
  </g>,
  h('rect', {id:'queenFnGoal', height:'1', width:'1'}),
),
h('g', {className:'off'},
  h('use', {xlinkHref}),
  h('use', {xlinkHref, transform:'rotate(45)'}),
),
h('path', {d}),
piece.goal && h('g', {className:'goal', transform:'scale(.4) translate(-.5 -.5)'},
  h('use', {xlinkHref:'#queenFnGoal'}),
  h('use', {xlinkHref:'#queenFnGoal', transform:'rotate(45 .5 .5)'}),
),
)
}
