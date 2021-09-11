import React, {Component, createElement as h} from 'react'
import './style.css'
import alfilFn from './piece/alfilFn'
import bishopFn from './piece/bishopFn'
import dabbabaFn from './piece/dabbabaFn'
import ferzFn from './piece/ferzFn'
import kingFn from './piece/kingFn'
import knightFn from './piece/knightFn'
import nightriderFn from './piece/nightriderFn'
import pawnFnNorth from './piece/pawnFnNorth'
import pawnFnSouth from './piece/pawnFnSouth'
import queenFn from './piece/queenFn'
import rookFn from './piece/rookFn'
import wazirFn from './piece/wazirFn'

const SIZE = 10

const BLANK = ' '
const MISSING = -1
const IMISSING = {i:MISSING}
const LAST = SIZE - 1
const row = () => Array(SIZE).fill(BLANK)
// const BAG = [...'BBKRR']
// const BAG = [...'BBKNNQRR']
// const BAG = [...'RNBKQBNR']
const BAG = [...'BBIIKNNRRQ']
const PAWNLIKE = [...'ADFPW']

const mapToLowerCase = (a)=> a.map(x => x.toLowerCase())

const board = () => {
  let bag = BAG.slice()
  const castling_rule = ((bag.indexOf('K') !== MISSING) && ((bag.filter(p => p === 'R').length) >= 2))
  const two_bishops_rule = (bag.filter(p => p === 'B').length) === 2
  const pawnlike = PAWNLIKE.slice()
  const row2p0 = Array(SIZE).fill().map(() => pawnlike[Math.floor(pawnlike.length * Math.random())])
  const row2p1 = mapToLowerCase(row2p0)
  let rack = []
  let rejected = []
  while(bag.length){
    let bag_i = Math.floor(bag.length * Math.random())
    let piece = bag.splice(bag_i, 1)[0]
    // const bag_king = (bag.indexOf('K') !== MISSING)
    // const bag_rook = (bag.indexOf('R') !== MISSING)
    // const bishop = (piece === 'B')
    // const rack_bishop_i = rack.indexOf('B')
    // const rack_bishop = (rack_bishop_i !== MISSING)
    // const rack_king = (rack.indexOf('K') !== MISSING)
    // const rack_rook = (rack.indexOf('R') !== MISSING)
    // const king = (piece === 'K')
    // const rook = (piece === 'R')
    // // rejected pieces
    // if(
    //   // king does not follow rook
    //   (castling_rule && king && !rack_rook)
    //   ||
    //   // last rook does not follow king
    //   (castling_rule && rook && !rack_king && !bag_rook)
    //   ||
    //   // 2 bishops and same color
    //   (two_bishops_rule && rack_bishop && bishop && ((rack_bishop_i % 2) === (rack.length % 2)))
    //   ||
    //   // 2 bishops and penultimate was not bishop but had to be due to color
    //   (two_bishops_rule && rack_bishop && !bishop && (rack.length === LAST-1) && ((rack_bishop_i % 2) === (LAST % 2)))
    // ){
    //   rejected.push(piece)
    // }
    // else {
      rack.push(piece)
      bag = bag.concat(rejected)
      rejected = []
    // }
  }
  if(rack.length < SIZE){
    throw(`
    ${rack.length} of ${SIZE}
    rack: ${rack.join('')}
    rejected: ${rejected.join('')}
    `)
  }
  // rack = bag
  const rack1 = mapToLowerCase(rack)
  return [].concat(
    rack1,
    row2p1,
    row(),
    row(),
    row(),
    row(),
    row(),
    row(),
    row2p0,
    rack,
  )
}
const BOARD = board()
const getX = i => i % SIZE
const getY = i => (i / SIZE) << 0
const getPos = i => [getX(i), getY(i)]
const getI = ([x, y]) => (y * SIZE) + x
const getP = (board, i) => (pieces_by_char[board[i]] || {}).p
const add2 = (a, b) => [ a[0] + b[0], a[1] + b[1] ]
const eq2 = (a, b) => (a[0] === b[0]) && (a[1] === b[1])
const inBounds2 = p => (p[0] >= 0) && (p[0] < SIZE) && (p[1] >= 0) && (p[1] < SIZE)
const jump = (vs, a, b, board) => {
  const posA = getPos(a)
  const posB = getPos(b)
  return vs.some(v =>
    inBounds2(posB)
    && eq2(add2(posA, v), posB)
    && (getP(board, a) !== getP(board, b))
  )
}
const isEmpty = (b, board) => {
  return !(getP(board, b) >= 0)
}
const jumpEmpty = (v, a, b, board) => {
  return eq2(add2(v, getPos(a)), getPos(b)) && isEmpty(b, board)
}
const attack = (vs, a, b, board) => vs.some(v => {
  if(!eq2(add2(getPos(a), v), getPos(b))) return false
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
      avn = add2(a, vn)
      if(!inBounds2(avn)) return false
      avnp = getP(board, getI(avn))
      if(ap === avnp) return false
      match = eq2(avn, b)
      if(match) return true
      if(!match && (avnp >= 0)) return false
      vn = add2(vn, v)
    } while(--_d)
    return false
  })
}
const cardinals = [[0,1], [1,0], [-1,0], [0,-1]]
const diagonals = [[1,1], [-1,1], [-1,-1], [1,-1]]
const directions = cardinals.concat(diagonals)
const alfilMove = jump.bind(null, diagonals.map(v=>add2(v,v)))
const bishopMove = walk.bind(null, LAST, diagonals)
const dabbabaMove = jump.bind(null, cardinals.map(v=>add2(v,v)))
const ferzMove = jump.bind(null, diagonals)
const wazirMove = jump.bind(null, cardinals)
// castling:
// [TODO] king must not have moved
// [TODO] rook must not have moved
// [TODO] king must not be threatened
// [TODO] all spaces in between must be empty
// [TODO] destination spaces must be empty or occupied by this king and rook
// [TODO] queen-side: K=2,0 R=3,0
// [TODO] king-side: K=LAST-1,0 R=LAST-2,0

// const castleRook = (destination, rooks, home, a, b, board) => {
//   const ap = getPos(a)
//   const bp = getPos(b)
//   if(!eq2(ap, home)) return IMISSING
//   const j = destination.vs.findIndex(v => {
//     let avn, avnp, {d} = destination, match, vn = v
//     do {
//       avn = add2(ap, vn)
//       if(!inBounds2(avn)) return false
//       avnp = getP(board, getI(avn))
//       if(avnp >= 0) return false
//       match = eq2(avn, bp)
//       if(match) return (d === 1)
//       vn = add2(vn, v)
//     } while(--d)
//     return false
//   })
//   if(j === MISSING) return IMISSING
//   const i = getI(add2(ap, rooks[j]))
//   const rook = pieces_by_char[board[i]]
//   if((rook.type !== 'rook') || (rook.p !== getP(board, a))) return IMISSING
//   return {i,j}
// }
const kingMove = (castle_spaces, rooks, home, a, b, board) => {
  return jump(directions, a, b, board)
    // || (castleRook(castle_spaces, rooks, home, a, b, board).i > MISSING)
}
// const castle = (castle_spaces, rooks, rookJumps, home, a, b, board) => {
//   const {i,j} = castleRook(castle_spaces, rooks, home, a, b, board)
//   if(i > MISSING){
//     board[getI(add2(getPos(a), rookJumps[j]))] = board[i]
//     board[i] = BLANK
//   }
//   return true // move
// }
// const castle_spaces_horiz = {d:2, vs:[[-1,0], [1,0]]}
// const castle_rooks_horiz = [[3,0], [LAST-2,0]]
// const castleHorizontal = castle.bind(null,
//   castle_spaces_horiz, castle_rooks_horiz, [[-1,0], [1,0]]
// )
// const king0Home = getPos(BOARD.indexOf('K'))
// const king1Home = getPos(BOARD.indexOf('k'))
const knightJumps = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [2,-1], [-2,1], [-2,-1]]
const knightMove = jump.bind(null, knightJumps)
const nightriderMove = walk.bind(null, Math.floor((LAST)/2), knightJumps)
const enPassant = (a, b, board) => {
  const ap = getPos(a)
  const y = ap[1]
  const pa = pieces_by_char[board[a]]
  if(pa && (y !== pa.fifth)) return false
  return pa && pa.attacks.some(k => {
    const cp = add2(ap, k)
    if(!eq2(cp, getPos(b))) return false
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
  || (home(getPos(a)) && isEmpty(getI(add2(getPos(a), jump)), board) && jumpEmpty(homeSlide, a, b, board))
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
  'A': {p:0, type:'alfil', move:alfilMove, imgFn:alfilFn},
  'a': {p:1, type:'alfil', move:alfilMove, imgFn:alfilFn},
  'B': {p:0, type:'bishop', move:bishopMove, imgFn:bishopFn},
  'b': {p:1, type:'bishop', move:bishopMove, imgFn:bishopFn},
  'D': {p:0, type:'dabbaba', move:dabbabaMove, imgFn:dabbabaFn},
  'd': {p:1, type:'dabbaba', move:dabbabaMove, imgFn:dabbabaFn},
  'F': {p:0, type:'ferz', move:ferzMove, imgFn:ferzFn},
  'f': {p:1, type:'ferz', move:ferzMove, imgFn:ferzFn},
  'I': {p:0, type:'nightrider', move:nightriderMove, imgFn:nightriderFn},
  'i': {p:1, type:'nightrider', move:nightriderMove, imgFn:nightriderFn},
  'N': {p:0, type:'knight', move:knightMove, imgFn:knightFn},
  'n': {p:1, type:'knight', move:knightMove, imgFn:knightFn},
  'Q': {p:0, type:'queen', move:queenMove, imgFn:queenFn},
  'q': {p:1, type:'queen', move:queenMove, imgFn:queenFn},
  'R': {p:0, type:'rook', move:rookMove, imgFn:rookFn},
  'r': {p:1, type:'rook', move:rookMove, imgFn:rookFn},
  'W': {p:0, type:'wazir', move:wazirMove, imgFn:wazirFn},
  'w': {p:1, type:'wazir', move:wazirMove, imgFn:wazirFn},
  'K': {p:0, type:'king', imgFn:kingFn,
    move: kingMove.bind(null, void 0 && castle_spaces_horiz, void 0 && castle_rooks_horiz, void 0 && king0Home),
    special: void 0 && castleHorizontal.bind(null, void 0 && king0Home),
  },
  'k': {p:1, type:'king', imgFn:kingFn,
    move: kingMove.bind(null, void 0 && castle_spaces_horiz, void 0 && castle_rooks_horiz, void 0 && king1Home),
    special: void 0 && castleHorizontal.bind(null, void 0 && king1Home),
  },
  'P': {p:0, type:'pawn', imgFn:pawnFnNorth,
    attacks: p0pawnAttacks,
    fifth: 3,
    move: pawnMove.bind(null,
      v => (v[1] + 2) === SIZE,
      [0,-1],
      [0,-2],
      p0pawnAttacks,
    ),
    special: pawnSpecial.bind(null, 0, 'Q'),
  },
  'p': {p:1, type:'pawn', imgFn:pawnFnSouth,
    attacks: p1pawnAttacks,
    fifth: (SIZE - 4),
    move: pawnMove.bind(null,
      v => v[1] === 1,
      [0,1],
      [0,2],
      p1pawnAttacks,
    ),
    special: pawnSpecial.bind(null, LAST, 'q'),
  },
}
// one type of goal piece per player
const goals = ['K','k']
// const goals = [].concat(BAG, PAWNLIKE, mapToLowerCase(BAG), mapToLowerCase(PAWNLIKE))
goals.forEach(goal => pieces_by_char[goal].goal = true)
const inactive_players = board => {
  return goals.map((k, p) => {
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
const players = [
  {
    name: 'Cyan',
    color:'#00FFFF',
  },
  {
    name: 'Red',
    color:'#FF0000',
  },
]

let newState = () => ({
  board: board(),
  active_players: players.map((_,i)=>i),
  selection: MISSING,
  turn: 0,
})

class Chess extends Component {
  constructor(){
    super()
    this.state = newState()
  }
  resetState(){
    const state = newState()
    this.setState(state)
  }
  clickSpace(i){
    const {board, selection} = this.state
    const match = (selection === i)
    const piece = pieces_by_char[board[selection]]
    if(match || (selection < 0) || !piece.move(selection, i, board)){
      return this.setState(()=>({
        selection: match ? MISSING : i
      }))
    }
    this.setState(({board, selection, turn})=>{
      if(!piece.special || piece.special(selection, i, board)){
        board[i] = board[selection]
        board[selection] = BLANK
      }
      const inactives = inactive_players(board)
      return {
        board,
        active_players: players.map((_, i)=>i).filter(i=>!inactives.includes(i)),
        selection: MISSING,
        turn: (turn + 1) % players.length,
      }
    })
  }
  render(){
    const {state} = this
    const {board, active_players, selection, turn} = state
    const spaces = Array(SIZE*SIZE)
    const player = players[turn]
    const winner = (active_players.length === 1) && active_players[0]
    const wp = (winner > MISSING) && players[winner]
    const sp = !wp && (selection > MISSING) && pieces_by_char[board[selection]]
    const {innerHeight, innerWidth} = window
    const horizontal = (innerWidth > innerHeight + 144)
    const width = horizontal ?
      innerHeight :
      Math.min(innerHeight-48, innerWidth)
    const size = width / SIZE
    const fontSize = size*.5
    // console.log(board.join(''))
    for(let i = spaces.length - 1; i >= 0; --i){
      const char = board[i]
      const piece = pieces_by_char[char]
      if(!piece){ throw(`${char} pieces_by_char`) }
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
            ((getY(i) % 2) === (getX(i) % 2)) ? 'bg0' : 'bg1',
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
            {img ? h('div', {style:{fill, stroke:fill}}, img) : char}
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
      <div className="Game" style={{flexDirection: horizontal ? 'row' : 'column'}}>
        <div className="Chess" style={{width, height:width, fontSize}}>
          {rows}
        </div>
        <div className="row grow" style={{
            flexDirection: horizontal ? 'column' : 'row',
            maxWidth: horizontal ? 'inherit' : width + 'px',
          }}>
          <div className="grow">
            {wp
              ? <p><span style={{color:wp.color}}>{wp.name}</span> is the victor.</p>
              : <p style={{color:player.color}}>{player.name} to move</p>
            }
            </div>
          <button className="reset" onClick={()=>this.resetState()}>
            <span>New Game</span>
          </button>
        </div>
      </div>
    )
  }
}
export default Chess
