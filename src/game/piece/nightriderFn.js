import {createElement as h} from 'react'
export default ({board, getI, getPos, i, piece}) => {
const [x, y] = getPos(i)
return h('svg', {version:'1.1', xmlns:'http://www.w3.org/2000/svg',
viewBox:'0 0 5 5', strokeWidth:'.5'},
h('path', {d:'M2,2 l-1,-2', className:piece.move(i, getI([x-1, y-2]), board) ? null : 'off'}),
h('path', {d:'M3,2 l1,-2', className:piece.move(i, getI([x+1, y-2]), board) ? null : 'off'}),
h('path', {d:'M2,2 l-2,-1', className:piece.move(i, getI([x-2, y-1]), board) ? null : 'off'}),
h('path', {d:'M3,2 l2,-1', className:piece.move(i, getI([x+2, y-1]), board) ? null : 'off'}),
h('path', {d:'M2,3 l-2,1', className:piece.move(i, getI([x-2, y+1]), board) ? null : 'off'}),
h('path', {d:'M3,3 l2,1', className:piece.move(i, getI([x+2, y+1]), board) ? null : 'off'}),
h('path', {d:'M2,3 l-1,2', className:piece.move(i, getI([x-1, y+2]), board) ? null : 'off'}),
h('path', {d:'M3,3 l1,2', className:piece.move(i, getI([x+1, y+2]), board) ? null : 'off'}),
)
}
