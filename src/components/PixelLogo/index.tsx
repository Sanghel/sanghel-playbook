// Each letter is a 5×5 pixel bitmap (1 = filled block, 0 = empty)
const P = 8   // block size (SVG units)
const G = 2   // gap between blocks
const LS = 8  // gap between letters
const LL = 16 // gap between lines

const LW = 5 * P + 4 * G  // letter width  = 48
const LH = 5 * P + 4 * G  // letter height = 48
const STRIDE = LW + LS     // = 56

const FONT: Record<string, readonly (readonly number[])[]> = {
  S: [[1,1,1,1,0],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[0,1,1,1,1]],
  A: [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
  G: [[0,1,1,1,0],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[0,1,1,1,0]],
  H: [[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  E: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]],
  L: [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  C: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,1]],
  F: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]],
  O: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  D: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
  I: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
}

const SVG_W = 11 * STRIDE - LS  // widest word (SCAFFOLDING = 11 letters) = 608
const SVG_H = LH + LL + LH      // two rows + gap = 112

function renderWord(word: string, fill: string, yBase: number) {
  const rects: React.ReactElement[] = []
  for (let ci = 0; ci < word.length; ci++) {
    const bitmap = FONT[word[ci]]
    if (!bitmap) continue
    for (let ri = 0; ri < bitmap.length; ri++) {
      for (let pi = 0; pi < bitmap[ri].length; pi++) {
        if (!bitmap[ri][pi]) continue
        rects.push(
          <rect
            key={`${ci}-${ri}-${pi}`}
            x={ci * STRIDE + pi * (P + G)}
            y={yBase + ri * (P + G)}
            width={P}
            height={P}
            fill={fill}
            rx={1.5}
          />
        )
      }
    }
  }
  return rects
}

export function PixelLogo() {
  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      role="img"
      aria-label="Sanghel Scaffolding"
      className="select-none"
    >
      {renderWord('SANGHEL', '#22d3ee', 0)}
      {renderWord('SCAFFOLDING', '#818cf8', LH + LL)}
    </svg>
  )
}
