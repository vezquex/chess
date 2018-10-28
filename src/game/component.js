import React, {Component, createElement as h} from 'react'
import './style.css'
import bishopFn from './piece/bishopFn'
import kingFn from './piece/kingFn'
import knightFn from './piece/knightFn'
import pawnFnNorth from './piece/pawnFnNorth'
import pawnFnSouth from './piece/pawnFnSouth'
import queenFn from './piece/queenFn'
import rookFn from './piece/rookFn'

const BLANK = ''
const MISSING = -1
const IMISSING = {i:MISSING}
const SIZE = 8
const LAST = SIZE - 1
const row = () => Array(SIZE).fill(BLANK)

// The king must be placed on a square between the two rooks.
// The bishops must be placed on opposite-colored squares.
// Mirror both sides.
const board = () => {
  return [].concat(
    [...'♜♞♝♛♚♝♞♜'],//.sort(()=>Math.round(Math.random())*2-1),
    [...'♟♟♟♟♟♟♟♟'],
    row(),row(),row(),row(),
    [...'♙♙♙♙♙♙♙♙'],
    [...'♖♘♗♕♔♗♘♖'],
  )
}
const getX = i => i % SIZE
const getY = i => Math.floor(i / SIZE)
const getPos = i => [getX(i), getY(i)]
const getI = ([x,y]) => (y * SIZE) + x
const getP = (board, i) => (pieces_by_char[board[i]] || {}).p
const add = (a,b) => a.map((ai, i) => ai + b[i])
// const subtract = (a,b) => a.map((ai, i) => ai - b[i])
const eq = (a, b) => a.every((ai, i) => ai === b[i])
const inBounds = p => p.every(i => (i >= 0) && (i < SIZE))
const jump = (vs, a, b, board) => {
  const posA = getPos(a)
  const posB = getPos(b)
  return vs.some(v =>
    inBounds(posB)
    && eq(add(posA, v), posB)
    && (getP(board, a) !== getP(board, b))
  )
}
const isEmpty = (b, board) => {
  return !(getP(board, b) >= 0)
}
const jumpEmpty = (v, a, b, board) => {
  return eq(add(v, getPos(a)), getPos(b)) && isEmpty(b, board)
}
const attack = (vs, a, b, board) => vs.some(v => {
  if(!eq(add(getPos(a), v), getPos(b))) return false
  const bp = getP(board, b)
  return (bp >= 0) && (getP(board, a) !== bp)
})
const walk = (d, vs, a, b, board)=>{
  const ap = getP(board, a)
  a = getPos(a)
  b = getPos(b)
  return vs.some(v => {
    let avn, avnp, _d = d, match, vn = v
    do {
      avn = add(a, vn)
      if(!inBounds(avn)) return false
      avnp = getP(board, getI(avn))
      if(ap === avnp) return false
      match = eq(avn, b)
      if(match) return true
      if(!match && (avnp >= 0)) return false
      vn = add(vn, v)
    } while(--_d)
    return false
  })
}
const diagonals = [[1,1], [-1,1], [-1,-1], [1,-1]]
const cardinals = [[0,1], [1,0], [-1,0], [0,-1]]
const directions = cardinals.concat(diagonals)
const bishopMove = walk.bind(null, LAST, diagonals)
const castleRook = (walks, rooks, home, a, b, board) => {
  const ap = getPos(a)
  const bp = getPos(b)
  if(!eq(ap, home)) return IMISSING
  const j = walks.vs.findIndex(v => {
    let avn, avnp, {d} = walks, match, vn = v
    do {
      avn = add(ap, vn)
      if(!inBounds(avn)) return false
      avnp = getP(board, getI(avn))
      if(avnp >= 0) return false
      match = eq(avn, bp)
      if(match) return (d === 1)
      vn = add(vn, v)
    } while(--d)
    return false
  })
  if(j === MISSING) return IMISSING
  const i = getI(add(ap, rooks[j]))
  const rook = pieces_by_char[board[i]]
  if((rook.type !== 'rook') || (rook.p !== getP(board, a))) return IMISSING
  return {i,j}
}
const kingMove = (castleWalks, rooks, home, a, b, board) => {
  return jump(directions, a, b, board)
    || (castleRook(castleWalks, rooks, home, a, b, board).i > MISSING)
}
const castle = (castleWalks, rooks, rookJumps, home, a, b, board) => {
  const {i,j} = castleRook(castleWalks, rooks, home, a, b, board)
  if(i > MISSING){
    board[getI(add(getPos(a), rookJumps[j]))] = board[i]
    board[i] = BLANK
  }
  return true // move
}
const castleWalksHorizontal = {d:2, vs:[[-1,0], [1,0]]}
const castleRooksHorizontal = [[-4,0], [3,0]]
const castleHorizontal = castle.bind(null,
  castleWalksHorizontal, castleRooksHorizontal, [[-1,0], [1,0]]
)
const king0Home = [4,LAST]
const king1Home = [4,0]
const knightMove = jump.bind(null,
  [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [2,-1], [-2,1], [-2,-1]]
)
const enPassant = (a, b, board) => {
  const ap = getPos(a)
  const y = ap[1]
  const pa = pieces_by_char[board[a]]
  if(pa && (y !== pa.fifth)) return false
  return pa && pa.attacks.some(k => {
    const cp = add(ap, k)
    if(!eq(cp, getPos(b))) return false
    const op = pieces_by_char[board[getI([cp[0], y])]]
    return (
      op
      && (op.type === 'pawn')
      && (op.p !== getP(board, a))
    )
  })
}
const pawnMove = (home, jump, homeSlide, attacks, a, b, board) => (
  jumpEmpty(jump, a, b, board)
  || attack(attacks, a, b, board)
  || (home(getPos(a)) && isEmpty(getI(add(getPos(a), jump)), board) && jumpEmpty(homeSlide, a, b, board))
  || (enPassant(a, b, board))
)
const pawnSpecial = (last, promo, a, b, board) => {
  if(enPassant(a, b, board)){
    board[getI([getX(b), getY(a)])] = BLANK
    return true
  }
  if(getY(b) === last){
    board[a] = BLANK
    board[b] = promo
    return false
  }
  return true
}
const queenMove = walk.bind(null, LAST, directions)
const rookMove = walk.bind(null, LAST, cardinals)
const p0pawnAttacks = [[1,-1], [-1,-1]]
const p1pawnAttacks = [[1,1], [-1,1]]
const pieces_by_char = {
  [BLANK]: {},
  '♗': {p:0, type:'bishop', move:bishopMove, imgFn:bishopFn},
  '♔': {p:0, type:'king', imgFn:kingFn,
    move: kingMove.bind(null, castleWalksHorizontal, castleRooksHorizontal, king0Home),
    special: castleHorizontal.bind(null, king0Home),
  },
  '♘': {p:0, type:'knight', move:knightMove, imgFn:knightFn},
  '♙': {p:0, type:'pawn', imgFn:pawnFnNorth,
    attacks: p0pawnAttacks,
    fifth: 3,
    move: pawnMove.bind(null,
      v => (v[1] + 2) === SIZE,
      [0,-1],
      [0,-2],
      p0pawnAttacks,
    ),
    special: pawnSpecial.bind(null, 0, '♕'),
  },
  '♕': {p:0, type:'queen', move:queenMove, imgFn:queenFn},
  '♖': {p:0, type:'rook', move:rookMove, imgFn:rookFn},
  '♝': {p:1, type:'bishop', move:bishopMove, imgFn:bishopFn},
  '♚': {p:1, type:'king', imgFn:kingFn,
    move: kingMove.bind(null, castleWalksHorizontal, castleRooksHorizontal, king1Home),
    special: castleHorizontal.bind(null, king1Home),
  },
  '♞': {p:1, type:'knight', move:knightMove, imgFn:knightFn},
  '♟': {p:1, type:'pawn', imgFn:pawnFnSouth,
    attacks: p1pawnAttacks,
    fifth: 4,
    move: pawnMove.bind(null,
      v => v[1] === 1,
      [0,1],
      [0,2],
      p1pawnAttacks,
    ),
    special: pawnSpecial.bind(null, LAST, '♛'),
  },
  '♛': {p:1, type:'queen', move:queenMove, imgFn:queenFn},
  '♜': {p:1, type:'rook', move:rookMove, imgFn:rookFn},
}

const players = [
  {
    name: 'Cyan',
    color:'#0FF',
    // symbols: '♔♕♖♗♘♙',
  },
  {
    name: 'Red',
    color:'#F00',
    // symbols: '♚♛♜♝♞♟',
  },
]

const kings = ['♔','♚']
const losers = board => {
  return kings.map((k, p) => {
    const i = board.indexOf(k)
    if(i === MISSING) return p
    return void 0
    // const c = getPos(k)
    // const threat = board.some((s, j) => (
    //   pieces_by_char[s].move(j, i, board)
    // ))
    // return
  }).filter(r => r !== void 0)
}

class Chess extends Component {
  constructor(){
    super()
    this.state = {
      board: board(),
      nonlosers: players.map((_,i)=>i),
      selection: MISSING,
      turn: 0,
    }
  }
  clickSpace(i){
    const {board, selection} = this.state
    const match = (selection === i)
    const piece = pieces_by_char[board[selection]]
    if(match || (selection < 0) || !piece.move(selection, i, board)){
      return this.setState(({selection})=>({
        selection: match ? MISSING : i
      }))
    }
    this.setState(({board, selection, turn})=>{
      if(!piece.special || piece.special(selection, i, board)){
        board[i] = board[selection]
        board[selection] = BLANK
      }
      const ls = losers(board)
      return {
        board,
        nonlosers: players.map((_, i)=>i).filter(i=>!ls.includes(i)),
        selection: MISSING,
        turn: (turn + 1) % players.length,
      }
    })
  }
  render(){
    const {state} = this
    const {board, nonlosers, selection, turn} = state
    const spaces = Array(SIZE*SIZE)
    const player = players[turn]
    const winner = (nonlosers.length === 1) && nonlosers[0]
    const wp = (winner > MISSING) && players[winner]
    const sp = !wp && (selection > MISSING) && pieces_by_char[board[selection]]
    const width = Math.min(window.innerHeight, window.innerWidth)
    const size = width * .125
    const fontSize = size*.5
    for(let i = spaces.length - 1; i >= 0; --i){
      const char = board[i]
      const piece = pieces_by_char[char]
      const {p} = piece
      const selected = !wp && (i === selection)
      const available = sp && sp.move(selection, i, board)
      const selectable = !wp && !selected && (p === turn)
      const fill = (p > MISSING) ? players[p].color : '0'
      const clickable = !wp && (selectable || selected || available)
      const img = piece.img || (piece.imgFn && piece.imgFn({board, getI, getPos, i, piece}))
      spaces[i] = (
        <button
          className={[
            'space',
            'p'+p,
            wp ? '' : ('t'+turn),
            ((getY(i) % 2) === (i % 2)) ? 'bg0' : 'bg1',
            (available || selected) ? 'available' : '',
            selectable ? 'selectable' : '',
          ].join(' ')}
          disabled={!clickable}
          key={i}
          onClick={()=>this.clickSpace(i)}
          style={{height:size, width:size, padding:0, borderWidth:Math.max(1, size/16)}}
        >
          <div className="space-content"
            style={{padding:size/16}}
          >
            {img ? h('div', {style:{fill}}, img) : char}
          </div>
        </button>
      )
    }
    const rows = Array(SIZE).fill(null).map(
      (n, i) => <div className="row" key={i}>
        {spaces.slice(i*SIZE, (i+1)*SIZE)}
      </div>
    )
    return (
      <div className="Game">
        <div className="Chess" style={{width, height:width, fontSize}}>
          {rows}
        </div>
        {wp
          ? <p><span style={{color:wp.color}}>{wp.name}</span> is the victor</p>
          : <p style={{color:player.color}}>{player.name} to move</p>
        }
      </div>
    )
  }
}

export default Chess
