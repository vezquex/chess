import React, {createElement as h} from 'react'
const id = 'bishopFn1'
const xlinkHref = '#'+id
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5'},
h('defs', null,
  h('rect', {id, x:'2', y:'0', height:'3', width:'1'}),
),
<g transform="rotate(45, 2.5, 2.5)" className="off">
  <rect x="2" y="0" height="5" width="1"/>
  <rect x="0" y="2" height="1" width="5"/>
</g>,
piece.move(i, getI([x-1, y-1]), board) && h('use', {xlinkHref, transform:'rotate(-45, 2.5, 2.5)'}),
piece.move(i, getI([x+1, y-1]), board) && h('use', {xlinkHref, transform:'rotate(45, 2.5, 2.5)'}),
piece.move(i, getI([x-1, y+1]), board) && h('use', {xlinkHref, transform:'rotate(-135, 2.5, 2.5)'}),
piece.move(i, getI([x+1, y+1]), board) && h('use', {xlinkHref, transform:'rotate(135, 2.5, 2.5)'}),
)
}
