import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import './App.css'

type Cell = [number, number]

type Piece = {
  id: string
  color: string
  blocks: Cell[]
  x: number
  y: number
  z: number
}

type PieceTemplate = {
  id: string
  color: string
  blocks: Cell[]
  anchorX: number
  anchorY: number
}

type DragState = {
  id: string
  pointerId: number
  offsetX: number
  offsetY: number
}

type PuzzleConfig = {
  code: string
  title: string
  subtitle: string
  templates: PieceTemplate[]
}

const BOARD_SIZE = 8
const DESKTOP_CELL_SIZE = 48

const PUZZLE_ONE_TEMPLATES: PieceTemplate[] = [
  {
    id: 'red-l',
    color: '#ef2020',
    blocks: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    anchorX: 0.04,
    anchorY: 0.04,
  },
  {
    id: 'yellow-frame',
    color: '#f4dc00',
    blocks: [
      [0,0],
      [1,0],
      [2,0],
      [3,0],
      [0,1],
      [1,1],
      [2,1]
    ],
    anchorX: 0.30,
    anchorY: 0.03,
  },
  {
    id: 'green-c',
    color: '#0c8f62',
    blocks: [
      [0, 3],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [1, 3],
    ],
    anchorX: 0.78,
    anchorY: 0.04,
  },
  {
    id: 'orange-t',
    color: '#ff6a00',
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [2, 2],
    ],
    anchorX: 0.04,
    anchorY: 0.16,
  },
  {
    id: 'purple-square',
    color: '#4818b7',
    blocks: [
      [0,0],
      [0,1],
      [1,0],
      [1,1]
    ],
    anchorX: 0.67,
    anchorY: 0.18,
  },
  {
    id: 'sky-bridge',
    color: '#81c8ed',
    blocks: [
      [0,2],
      [1,2],
      [2,2],
      [2,1],
      [2,0],
      [3,0],
      [3,1],
      [3,2],
      [4,2],
      [5,2]
    ],
    anchorX: 0.19,
    anchorY: 0.36,
  },
  {
    id: 'teal-line',
    color: '#0da4c9',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    anchorX: 0.30,
    anchorY: 0.67,
  },
  {
    id: 'peach-l',
    color: '#f0be79',
    blocks: [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 2],
    ],
    anchorX: 0.05,
    anchorY: 0.68,
  },
  {
    id: 'blue-l',
    color: '#1658d7',
    blocks: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    anchorX: 0.18,
    anchorY: 0.82,
  },
  {
    id: 'violet-long',
    color: '#6a0d91',
    blocks: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3,0]
    ],
    anchorX: 0.28,
    anchorY: 0.75,
  },
  {
    id: 'pink-arch',
    color: '#e57fe8',
    blocks: [
      [0,3],
      [1,3],
      [1,2],
      [1,1],
      [2,0],
      [2,1],
      [2,2],
      [2,3]
    ],
    anchorX: 0.74,
    anchorY: 0.67,
  },
]

const PUZZLE_TWO_TEMPLATES: PieceTemplate[] = [
  {
    id: 'purple-top',
    color: '#4b14bf',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [2, 1],
    ],
    anchorX: 0.06,
    anchorY: 0.04,
  },
  {
    id: 'green-complex',
    color: '#2be400',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    anchorX: 0.54,
    anchorY: 0.02,
  },
  {
    id: 'peach-short',
    color: '#f2bf7a',
    blocks: [
      [0, 0],
      [0, 1],
    ],
    anchorX: 0.92,
    anchorY: 0.2,
  },
  {
    id: 'blue-left',
    color: '#1b57de',
    blocks: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 1],
      [2, 1],
      [1, 0],
    ],
    anchorX: 0.06,
    anchorY: 0.2,
  },
  {
    id: 'orange-hook',
    color: '#ff6500',
    blocks: [
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 2],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
    anchorX: 0.18,
    anchorY: 0.28,
  },
  {
    id: 'deep-green-box',
    color: '#07895f',
    blocks: [
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 0],
    ],
    anchorX: 0.66,
    anchorY: 0.32,
  },
  {
    id: 'pink-z',
    color: '#e67cec',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [5, 2],
    ],
    anchorX: 0.30,
    anchorY: 0.52,
  },
  {
    id: 'yellow-u',
    color: '#f7e100',
    blocks: [
      [0,0],
      [0,1],
      [0,2],
      [1,2],
      [2,2],
      [2,1]
    ],
    anchorX: 0.05,
    anchorY: 0.68,
  },
  {
    id: 'cyan-t',
    color: '#13a7c9',
    blocks: [
      [0, 0],
      [1, 0],
      [1,1],
      [1,2],
      [2,1]
    ],
    anchorX: 0.29,
    anchorY: 0.67,
  },
  {
    id: 'red-base',
    color: '#f01414',
    blocks: [
      [0,1],
      [1,1],
      [1,0],
      [2,0],
      [2,1],
      [3,1]
    ],
    anchorX: 0.58,
    anchorY: 0.8,
  },
]

const PUZZLE_THREE_TEMPLATES: PieceTemplate[] = [
  {
    id: 'lime-cap',
    color: '#2be400',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
    anchorX: 0.06,
    anchorY: 0.04,
  },
  {
    id: 'sky-step',
    color: '#7ccff1',
    blocks: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],

    ],
    anchorX: 0.35,
    anchorY: 0.04,
  },
  {
    id: 'pink-top-l',
    color: '#e67cec',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [3, 1],
    ],
    anchorX: 0.66,
    anchorY: 0.04,
  },
  {
    id: 'yellow-side-t',
    color: '#f4dc00',
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    anchorX: 0.04,
    anchorY: 0.26,
  },
  {
    id: 'lavender-column',
    color: '#b9afff',
    blocks: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
      [2, 3],
    ],
    anchorX: 0.74,
    anchorY: 0.26,
  },
  {
    id: 'magenta-bar',
    color: '#b11374',
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1,1]
    ],
    anchorX: 0.22,
    anchorY: 0.47,
  },
  {
    id: 'orange-platform',
    color: '#ff6a00',
    blocks: [
      [1,0],
      [0,1],
      [1,1],
      [2,1],
      [0,2],
      [1,2],
      [2,2],
      [1,3]
    ],
    anchorX: 0.45,
    anchorY: 0.51,
  },
  {
    id: 'violet-arch',
    color: '#4b14bf',
    blocks: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [0, 3],
      [2, 2],
    ],
    anchorX: 0.05,
    anchorY: 0.68,
  },
  {
    id: 'forest-base',
    color: '#0c8f62',
    blocks: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [2, 0],
    ],
    anchorX: 0.27,
    anchorY: 0.78,
  },
  {
    id: 'red-square',
    color: '#ef2020',
    blocks: [
      [1, 0],
      [2,0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1,2],
      [2,2]
    ],
    anchorX: 0.78,
    anchorY: 0.78,
  },
]

const PUZZLE_FOUR_TEMPLATES: PieceTemplate[] = [
  {
    id: 'red-tower',
    color: '#4b0ddb',
    blocks: [
      [0,0],
      [0,1],
      [0,2],
      [0,3],
      [0,4],
      [1,0],
      [1,1],
      [1,2],
      [1,3],
      [1,4],
      [2,1],
      [2,2],
      [2,3],
      [2,4]
    ],
    anchorX: 0.03,
    anchorY: 0.04,
  },
  {
    id: 'orange-runner',
    color: '#ff6a00',
    blocks: [
      [0,5],
      [0,6],
      [1,0],
      [1,5],
      [1,6],
      [2,0],
      [2,1],
      [2,2],
      [2,3],
      [2,4],
      [2,5],
      [2,6],
      [3,3],
      [3,4],
      [3,5],
      [3,6],
      [4,3],
      [4,4],
      [5,3],
      [5,4]
    ],
    anchorX: 0.24,
    anchorY: 0.04,
  },
  {
    id: 'mint-frame',
    color: '#91f8b9',
    blocks: [
      [0,0],
      [0,1],
      [0,2],
      [1,0],
      [1,1],
      [1,2],
      [2,0],
      [2,1],
      [2,2],
      [3,0]
    ],
    anchorX: 0.58,
    anchorY: 0.04,
  },
  {
    id: 'green-line',
    color: '#b9b356',
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ],
    anchorX: 0.94,
    anchorY: 0.2,
  },
  {
    id: 'blue-corner',
    color: '#1658d7',
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1,2]
    ],
    anchorX: 0.04,
    anchorY: 0.74,
  },
  {
    id: 'magenta-box',
    color: '#b11374',
    blocks: [
      [0,2],
      [1,2],
      [2,2],
      [3,0],
      [3,1],
      [3,2],
      [4,0],
      [4,1],
      [4,2]
    ],
    anchorX: 0.72,
    anchorY: 0.73,
  },
]

const PUZZLES: PuzzleConfig[] = [
  {
    code: '1234',
    title: 'Block Puzzle A',
    subtitle:
      'Drag every piece with mouse or finger and arrange it into an 8x8 cube! SS a photo of the completed puzzle and ping production to stop your time!',
    templates: PUZZLE_ONE_TEMPLATES,
  },
  {
    code: '8765',
    title: 'Block Puzzle B',
    subtitle:
      'You unlocked the second puzzle copy. Drag and unscramble all pieces into the 8x8 cube.',
    templates: PUZZLE_TWO_TEMPLATES,
  },
  {
    code: '102394548372313',
    title: 'Block Puzzle C',
    subtitle:
      'Puzzle C is live. Use the provided solution pattern to rebuild the full 8x8 cube.',
    templates: PUZZLE_THREE_TEMPLATES,
  },
  {
    code: '4356',
    title: 'Block Puzzle D',
    subtitle:
      'Puzzle D is loaded with the latest piece set. Arrange every piece to rebuild the full 8x8 cube.',
    templates: PUZZLE_FOUR_TEMPLATES,
  },
]

const createPiecesFromTemplates = (templates: PieceTemplate[]): Piece[] =>
  templates.map((template, index) => ({
    id: template.id,
    color: template.color,
    blocks: template.blocks,
    x: 0,
    y: 0,
    z: index + 1,
  }))

const getPieceSize = (blocks: Cell[], cellSize: number) => {
  const maxX = Math.max(...blocks.map((cell) => cell[0]))
  const maxY = Math.max(...blocks.map((cell) => cell[1]))
  return {
    width: (maxX + 1) * cellSize,
    height: (maxY + 1) * cellSize,
  }
}

const getResponsiveCellSize = (stageWidth: number) => {
  if (stageWidth <= 420) {
    return 30
  }

  if (stageWidth <= 560) {
    return 34
  }

  if (stageWidth <= 760) {
    return 40
  }

  return DESKTOP_CELL_SIZE
}

const getDistributedStartPosition = (
  index: number,
  total: number,
  stageWidth: number,
  stageHeight: number,
  pieceWidth: number,
  pieceHeight: number,
) => {
  const columns = Math.max(1, Math.ceil(Math.sqrt(total)))
  const rows = Math.max(1, Math.ceil(total / columns))
  const column = index % columns
  const row = Math.floor(index / columns)
  const slotWidth = stageWidth / columns
  const slotHeight = stageHeight / rows

  const x = column * slotWidth + (slotWidth - pieceWidth) / 2
  const y = row * slotHeight + (slotHeight - pieceHeight) / 2
  const maxX = Math.max(0, stageWidth - pieceWidth)
  const maxY = Math.max(0, stageHeight - pieceHeight)

  return {
    x: Math.min(maxX, Math.max(0, x)),
    y: Math.min(maxY, Math.max(0, y)),
  }
}

function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const zRef = useRef(1)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState('')
  const [activePuzzle, setActivePuzzle] = useState<PuzzleConfig | null>(null)
  const [cellSize, setCellSize] = useState(DESKTOP_CELL_SIZE)
  const [pieces, setPieces] = useState<Piece[]>([])
  const [dragState, setDragState] = useState<DragState | null>(null)

  const handleCodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const submittedCode = codeInput.trim()
    const selectedPuzzle = PUZZLES.find((puzzle) => puzzle.code === submittedCode)

    if (!selectedPuzzle) {
      setCodeError('That code is not valid. Try again.')
      return
    }

    setCodeError('')
    setActivePuzzle(selectedPuzzle)
    setCodeInput('')
  }

  const handleResetAccess = () => {
    setActivePuzzle(null)
    setDragState(null)
    setPieces([])
    initializedRef.current = false
    setCodeError('')
  }

  useEffect(() => {
    if (!activePuzzle) {
      return
    }

    initializedRef.current = false
    zRef.current = activePuzzle.templates.length + 1
    setPieces(createPiecesFromTemplates(activePuzzle.templates))
  }, [activePuzzle])

  useEffect(() => {
    if (!activePuzzle) {
      return
    }

    const stage = stageRef.current
    if (!stage) {
      return
    }

    const updateLayout = () => {
      const stageRect = stage.getBoundingClientRect()
      const nextCellSize = getResponsiveCellSize(stageRect.width)
      setCellSize((current) =>
        current === nextCellSize ? current : nextCellSize,
      )

      setPieces((current) => {
        if (!initializedRef.current) {
          initializedRef.current = true
          const totalPieces = activePuzzle.templates.length

          return activePuzzle.templates.map((template, index) => {
            const size = getPieceSize(template.blocks, nextCellSize)
            const start = getDistributedStartPosition(
              index,
              totalPieces,
              stageRect.width,
              stageRect.height,
              size.width,
              size.height,
            )

            return {
              id: template.id,
              color: template.color,
              blocks: template.blocks,
              x: start.x,
              y: start.y,
              z: index + 1,
            }
          })
        }

        return current.map((piece) => {
          const size = getPieceSize(piece.blocks, nextCellSize)
          const maxX = Math.max(0, stageRect.width - size.width)
          const maxY = Math.max(0, stageRect.height - size.height)

          return {
            ...piece,
            x: Math.min(maxX, Math.max(0, piece.x)),
            y: Math.min(maxY, Math.max(0, piece.y)),
          }
        })
      })
    }

    updateLayout()

    const observer = new ResizeObserver(() => {
      updateLayout()
    })

    observer.observe(stage)
    return () => {
      observer.disconnect()
    }
  }, [activePuzzle])

  const bringToFront = (pieceId: string) => {
    const nextZ = zRef.current
    zRef.current += 1
    setPieces((current) =>
      current.map((piece) =>
        piece.id === pieceId ? { ...piece, z: nextZ } : piece,
      ),
    )
  }

  const updatePiecePosition = (
    pieceId: string,
    clientX: number,
    clientY: number,
    offsetX: number,
    offsetY: number,
  ) => {
    if (!activePuzzle) {
      return
    }

    const stage = stageRef.current
    if (!stage) {
      return
    }

    const stageRect = stage.getBoundingClientRect()

    setPieces((current) =>
      current.map((piece) => {
        if (piece.id !== pieceId) {
          return piece
        }

        const size = getPieceSize(piece.blocks, cellSize)
        const unclampedX = clientX - stageRect.left - offsetX
        const unclampedY = clientY - stageRect.top - offsetY
        const maxX = stageRect.width - size.width
        const maxY = stageRect.height - size.height

        return {
          ...piece,
          x: Math.max(0, Math.min(unclampedX, maxX)),
          y: Math.max(0, Math.min(unclampedY, maxY)),
        }
      }),
    )
  }

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    pieceId: string,
  ) => {
    const stage = stageRef.current
    if (!stage) {
      return
    }

    const piece = pieces.find((entry) => entry.id === pieceId)
    if (!piece) {
      return
    }

    const stageRect = stage.getBoundingClientRect()
    const offsetX = event.clientX - stageRect.left - piece.x
    const offsetY = event.clientY - stageRect.top - piece.y

    event.currentTarget.setPointerCapture(event.pointerId)
    bringToFront(pieceId)
    setDragState({
      id: pieceId,
      pointerId: event.pointerId,
      offsetX,
      offsetY,
    })
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState) {
      return
    }

    if (dragState.pointerId !== event.pointerId) {
      return
    }

    updatePiecePosition(
      dragState.id,
      event.clientX,
      event.clientY,
      dragState.offsetX,
      dragState.offsetY,
    )
  }

  const clearDragState = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState) {
      return
    }

    if (dragState.pointerId !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setDragState(null)
  }

  const stageStyle = {
    '--cell-size': `${cellSize}px`,
  } as CSSProperties

  return (
    <main className="puzzle-page">
      {!activePuzzle ? (
        <section className="gate-card">
          <h1>Enter Access Code</h1>
          <p>Enter the code given to open the correct one.</p>
          <form className="gate-form" onSubmit={handleCodeSubmit}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={codeInput}
              onChange={(event) => {
                setCodeInput(event.target.value)
                if (codeError) {
                  setCodeError('')
                }
              }}
              placeholder="Enter code"
              aria-label="Puzzle access code"
            />
            <button type="submit">Open Puzzle</button>
          </form>
          {codeError && <p className="gate-error">{codeError}</p>}
        </section>
      ) : (
        <>
          <header className="puzzle-header">
            <h1>{activePuzzle.title}</h1>
            <p>{activePuzzle.subtitle}</p>
            <button
              type="button"
              className="switch-code-button"
              onClick={handleResetAccess}
            >
              Use Different Code
            </button>
          </header>

          <section className="puzzle-stage" ref={stageRef} style={stageStyle}>
            <div className="board" aria-label="Target board">
              {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => (
                <div key={`board-cell-${index}`} className="board-cell" />
              ))}
            </div>

            {pieces.map((piece) => {
              const size = getPieceSize(piece.blocks, cellSize)

              return (
                <div
                  key={piece.id}
                  className="piece"
                  style={{
                    left: `${piece.x}px`,
                    top: `${piece.y}px`,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    zIndex: piece.z,
                  }}
                  onPointerDown={(event) => handlePointerDown(event, piece.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={clearDragState}
                  onPointerCancel={clearDragState}
                >
                  {piece.blocks.map((block, index) => (
                    <div
                      key={`${piece.id}-block-${index}`}
                      className="piece-cell"
                      style={{
                        left: `${block[0] * cellSize}px`,
                        top: `${block[1] * cellSize}px`,
                        background: piece.color,
                      }}
                    />
                  ))}
                </div>
              )
            })}
          </section>
        </>
      )}
    </main>
  )
}

export default App
