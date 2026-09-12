// A lush botanical vine rendered as inline SVG and pressed into cream paper via
// an emboss filter (soft top-left highlight, warm bottom-right shadow). All
// shapes are painted the same cream as the background so only the relief shows —
// the look of engraved floral art richly climbing the side of a luxury wedding
// envelope: a main stem with secondary offshoots, blossoms of many sizes,
// dense leaf pairs, buds, and small filler sprigs.
//
// `side="right"` mirrors the art horizontally so a left/right pair frames an
// envelope symmetrically. The mirror is baked into the geometry (every x becomes
// W - x) rather than a CSS/SVG scale(-1) transform, because a negative-scale
// ancestor breaks SVG filter rendering in Chromium — the relief vanishes.
//
// No fixed pixel size and no external deps — let CSS scale the root <svg>.

const CREAM = '#eae0cb' // must match the envelope paper so only relief shows
const W = 220 // viewBox width; used to mirror x-coordinates for the right side.
const H = 760
const MOTIF = 1.15 // scale up every motif ~15% so the relief reads as substantial

// A five-petal blossom centered at (cx, cy), scaled by s and rotated. Petals are
// rounded lobes set close to the center so they overlap into one continuous
// rosette. Larger focal blooms (layered) also carry an inner ring of small
// petals so they read as full open roses rather than flat discs.
function Blossom({ cx, cy, s = 1, rot = 0, layered = false }) {
  s *= MOTIF
  const ring = (count, dist, rx, ry, phase) =>
    Array.from({ length: count }, (_, i) => {
      const a = phase + (i / count) * Math.PI * 2
      const px = cx + Math.cos(a) * dist
      const py = cy + Math.sin(a) * dist
      return (
        <ellipse
          key={`${count}-${i}`}
          cx={px}
          cy={py}
          rx={rx}
          ry={ry}
          transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`}
        />
      )
    })
  return (
    <g>
      {/* outer petal ring */}
      {ring(5, 3.1 * s, 3.9 * s, 3.2 * s, rot)}
      {/* inner petal ring for focal blooms, offset so it nestles between */}
      {layered && ring(5, 1.7 * s, 2.4 * s, 2.0 * s, rot + Math.PI / 5)}
      {/* a cream pistil dot punched into the middle so it reads as a bloom */}
      <circle cx={cx} cy={cy} r={(layered ? 1.1 : 1.5) * s} fill={CREAM} />
    </g>
  )
}

// A pointed almond leaf sprouting from (x, y) at the given angle.
function Leaf({ x, y, len = 16, wid = 6, angle = 0 }) {
  len *= MOTIF
  wid *= MOTIF
  const tipX = x + len
  const c = wid
  const d = `M ${x} ${y}
    C ${x + len * 0.35} ${y - c}, ${x + len * 0.75} ${y - c * 0.7}, ${tipX} ${y}
    C ${x + len * 0.75} ${y + c * 0.7}, ${x + len * 0.35} ${y + c}, ${x} ${y} Z`
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path d={d} />
      {/* central vein — a thin cream cut for engraved detail */}
      <path d={`M ${x + 1.5} ${y} L ${tipX - 1.5} ${y}`} fill="none" stroke={CREAM} strokeWidth="0.7" />
    </g>
  )
}

// A closed teardrop bud on a short stalk from (x, y).
function Bud({ x, y, s = 1, angle = 0 }) {
  s *= MOTIF
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path d={`M ${x} ${y} q ${3 * s} ${-1.5 * s} ${5 * s} 0`} fill="none" stroke={CREAM} strokeWidth={1.2 * s} />
      <ellipse
        cx={x + 6 * s}
        cy={y - 1 * s}
        rx={2.6 * s}
        ry={3.6 * s}
        transform={`rotate(-28 ${x + 6 * s} ${y - 1 * s})`}
      />
    </g>
  )
}

// A tiny three-dot sprig of filler blossoms fanning from (x, y) — the little
// baby's-breath clusters that fill the gaps in an engraved border.
function Sprig({ x, y, s = 1, angle = 0 }) {
  s *= MOTIF
  const dots = [
    [0, 0, 1.6],
    [4.2, -2.4, 1.3],
    [4.6, 2.6, 1.3],
    [8.2, -0.4, 1.1],
  ]
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path d={`M ${x} ${y} q ${4 * s} 0 ${8 * s} 0`} fill="none" stroke={CREAM} strokeWidth={0.8 * s} />
      {dots.map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx * s} cy={y + dy * s} r={r * s} />
      ))}
    </g>
  )
}

// Build a smooth cubic path string from an array of point tuples, folding x
// through `fx` so the whole path mirrors for the right side. The first tuple is
// the move-to [x, y]; each following tuple is a cubic [x1, y1, x2, y2, x, y].
function buildPath(pts, fx) {
  return (
    `M ${fx(pts[0][0])} ${pts[0][1]} ` +
    pts
      .slice(1)
      .map((c) => `C ${fx(c[0])} ${c[1]}, ${fx(c[2])} ${c[3]}, ${fx(c[4])} ${c[5]}`)
      .join(' ')
  )
}

export default function EmbossFlora({ className, side = 'left' }) {
  const mirror = side === 'right'
  // Fold an x-coordinate across the viewBox when mirroring; flip angles too.
  const fx = (x) => (mirror ? W - x : x)
  const fa = (a) => (mirror ? 180 - a : a)

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        {/* Emboss: a soft bevel built from the artwork's alpha. The blurred alpha
            is lit from the upper-left; a pale highlight lobe shifted toward the
            light and a warm-taupe shadow lobe shifted into the trough are drawn
            over the cream fill, so the shapes look pressed into the paper —
            low-contrast relief, no color of their own. */}
        <filter id="ef-emboss" x="-25%" y="-8%" width="150%" height="116%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.7" result="blur" />

          {/* Highlight lobe — a deeper press: higher surfaceScale carves a taller
              rim and a brighter constant makes the top-left edge plainly catch
              the light, shifted up-left. Still broad (low exponent) so it reads
              as raised paper, not a hard specular dot. */}
          <feSpecularLighting
            in="blur"
            surfaceScale="5"
            specularConstant="1.15"
            specularExponent="4.5"
            lightingColor="#fffdf6"
            result="hi"
          >
            <feDistantLight azimuth="235" elevation="48" />
          </feSpecularLighting>
          <feComposite in="hi" in2="SourceAlpha" operator="in" result="hiClip" />
          <feOffset in="hiClip" dx="-1.2" dy="-1.4" result="hiEdge" />

          {/* Shadow lobe (surface lit from the reverse face → negative scale),
              deepened to a darker warm brown and shifted further down-right so
              the trough clearly reads as pressed into the paper. Kept a touch
              stronger than the highlight so the vine looks stamped, not glowing. */}
          <feSpecularLighting
            in="blur"
            surfaceScale="-5"
            specularConstant="1.35"
            specularExponent="4.5"
            lightingColor="#463a24"
            result="lo"
          >
            <feDistantLight azimuth="235" elevation="48" />
          </feSpecularLighting>
          <feComposite in="lo" in2="SourceAlpha" operator="in" result="loClip" />
          <feOffset in="loClip" dx="1.4" dy="1.6" result="loEdge" />

          {/* Cream body, shadow beneath, highlight on top. */}
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="loEdge" />
            <feMergeNode in="hiEdge" />
          </feMerge>
        </filter>
      </defs>

      <g fill={CREAM} stroke="none" filter="url(#ef-emboss)">
        <Flora fx={fx} fa={fa} />
      </g>
    </svg>
  )
}

// The botanical content, shared by both sides. A main serpentine stem plus three
// secondary offshoots that arc outward toward the panel edges and back, then a
// dense population of leaves, blossoms, buds, and filler sprigs distributed
// along all of them so the panel reads as a richly engraved border top to
// bottom. `fx`/`fa` fold coordinates/angles for the mirrored (right) side.
function Flora({ fx, fa }) {
  // Main stem: a slow S-curve from bottom to the crown, biased to the outer
  // (left) side so blooms lean into the panel.
  const mainStem = [
    [86, 752],
    [52, 694, 128, 648, 92, 588],
    [58, 532, 132, 486, 96, 424],
    [60, 368, 130, 320, 94, 258],
    [58, 206, 120, 156, 92, 96],
    [80, 60, 96, 34, 104, 8],
  ]

  // Secondary offshoots: each leaves the main stem and sweeps toward the panel
  // width, carrying its own blooms and leaves. They widen the composition so it
  // fills the viewBox rather than reading as a single central thread.
  const offshoots = [
    // low offshoot sweeping out to the right toward the inner edge
    [[100, 636], [140, 632, 168, 600, 176, 556], [180, 528, 176, 508, 170, 492]],
    // mid offshoot sweeping out to the left / outer edge
    [[96, 460], [58, 452, 34, 424, 30, 384], [27, 356, 33, 336, 40, 320]],
    // upper offshoot sweeping right again, higher and shorter
    [[94, 300], [128, 296, 150, 268, 156, 232], [159, 210, 156, 194, 150, 180]],
    // a short curling tendril near the base for fullness
    [[90, 700], [66, 704, 50, 690, 46, 668]],
    // a short curling tendril up top
    [[100, 150], [126, 146, 138, 128, 138, 106]],
  ]

  const stems = [mainStem, ...offshoots]

  // Leaves distributed along every stem, alternating sides. [x, y, len, wid, ang]
  const leaves = [
    // along main stem
    [88, 726, 24, 9, -150], [110, 700, 20, 7, -20], [70, 660, 26, 10, 172],
    [124, 632, 20, 8, -38], [80, 596, 22, 9, 158], [120, 560, 24, 9, -16],
    [70, 520, 26, 10, 168], [126, 484, 21, 8, -34], [76, 448, 24, 9, 162],
    [124, 410, 22, 8, -22], [70, 372, 25, 10, 166], [122, 336, 20, 7, -28],
    [78, 296, 23, 9, 160], [118, 258, 21, 8, -24], [74, 220, 23, 9, 164],
    [112, 182, 19, 7, -30], [82, 146, 21, 8, 154], [106, 110, 18, 7, -40],
    [86, 74, 18, 7, 150], [104, 44, 15, 6, -48],
    // extra main-stem leaves to fill the vertical gaps
    [98, 674, 18, 7, -60], [92, 540, 18, 7, 130], [100, 396, 18, 7, -58],
    [90, 240, 18, 7, 128], [96, 128, 15, 6, -62],
    // along low right offshoot
    [128, 628, 18, 7, -8], [150, 606, 19, 7, 20], [168, 566, 18, 7, 42],
    [150, 512, 17, 7, 130], [176, 540, 14, 5, 70],
    // along mid left offshoot
    [70, 448, 19, 7, 190], [46, 420, 20, 8, 210], [33, 384, 18, 7, 232],
    [40, 348, 17, 6, 150], [30, 360, 13, 5, 270],
    // along upper right offshoot
    [118, 292, 18, 7, -6], [140, 268, 18, 7, 22], [152, 232, 16, 6, 46],
  ]

  // Buds — closed teardrops at stem tips and tucked in. [x, y, s, ang]
  const buds = [
    [46, 668, 1.1, 205], [170, 492, 1.05, 250], [40, 320, 1.1, 245],
    [150, 180, 1.0, 250], [138, 106, 0.95, 255], [104, 8, 0.95, -70],
    [128, 620, 0.9, -30], [66, 200, 0.95, 200],
  ]

  // Small filler sprigs (baby's-breath). [x, y, s, ang]
  const sprigs = [
    [116, 688, 1.0, -35], [74, 548, 1.0, 200], [128, 470, 0.95, -20],
    [70, 340, 1.0, 205], [120, 224, 0.95, -30], [96, 128, 0.9, 200],
    [158, 560, 0.85, 30], [34, 400, 0.85, 210],
    [72, 616, 0.95, 195], [126, 356, 0.9, -25], [64, 460, 0.85, 215],
    [110, 158, 0.85, -30],
  ]

  // Blossoms: focal (large, layered) and accent (small). [x, y, s, rot, layered]
  const blossoms = [
    // large focal blooms anchoring the composition
    [104, 660, 2.1, 0.3, true],
    [96, 496, 2.4, 0.9, true],
    [102, 340, 2.2, 0.2, true],
    [92, 176, 1.9, 1.2, true],
    // medium blooms
    [172, 520, 1.5, 0.5, true],
    [32, 372, 1.6, 1.4, true],
    [156, 214, 1.4, 0.8, true],
    [98, 60, 1.4, 0.6, true],
    // small accent blossoms sprinkled for density
    [128, 600, 1.05, 1.1, false],
    [66, 584, 1.0, 0.4, false],
    [78, 428, 1.1, 1.7, false],
    [124, 388, 1.0, 0.6, false],
    [70, 272, 1.05, 1.3, false],
    [118, 300, 0.95, 0.2, false],
    [80, 108, 1.0, 0.9, false],
    [50, 648, 0.9, 1.5, false],
    [110, 540, 0.95, 0.7, false],
    [88, 622, 0.9, 1.2, false],
    [176, 548, 0.9, 0.5, false],
    [30, 350, 0.85, 1.0, false],
  ]

  return (
    <g>
      {/* Stems first so flowers and leaves sit on top of them. */}
      {stems.map((pts, i) => (
        <path
          key={`stem-${i}`}
          d={buildPath(pts, fx)}
          fill="none"
          stroke={CREAM}
          strokeWidth={(i === 0 ? 3.8 : 2.6) * MOTIF}
          strokeLinecap="round"
        />
      ))}

      {leaves.map(([x, y, len, wid, ang], i) => (
        <Leaf key={`leaf-${i}`} x={fx(x)} y={y} len={len} wid={wid} angle={fa(ang)} />
      ))}

      {sprigs.map(([x, y, s, ang], i) => (
        <Sprig key={`sprig-${i}`} x={fx(x)} y={y} s={s} angle={fa(ang)} />
      ))}

      {buds.map(([x, y, s, ang], i) => (
        <Bud key={`bud-${i}`} x={fx(x)} y={y} s={s} angle={fa(ang)} />
      ))}

      {blossoms.map(([x, y, s, rot, layered], i) => (
        <Blossom key={`bloom-${i}`} cx={fx(x)} cy={y} s={s} rot={rot} layered={layered} />
      ))}
    </g>
  )
}
