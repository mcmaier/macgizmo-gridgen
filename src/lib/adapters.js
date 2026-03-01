/**
 * SMD Adapter Library for MacGizmo GridGen.
 *
 * Unlike module overlays (visual only), adapters generate real Gerber features:
 * SMD pads, traces, mask openings, and silkscreen outlines.
 *
 * Each adapter defines:
 *   - id, name, category, pitch, color: same as modules
 *   - throughPins: array of { col, row } – grid positions that replace normal pads
 *   - features: Gerber primitives relative to origin (first through-hole pin)
 *     - copper[]: pads and traces on copper layer
 *     - mask[]: solder mask openings
 *     - silk[]: silkscreen outlines
 *   - outline: { width, height } in mm for preview rendering
 *   - outlineOffset: optional { x, y } mm offset
 *
 * Coordinate system:
 *   Origin (0,0) = first through-hole pin position.
 *   All coordinates in mm, relative to origin.
 *   Y increases upward (Gerber convention).
 *
 * Feature types:
 *   { type: 'pad', x, y, w, h }          – rectangular SMD pad (copper + mask)
 *   { type: 'circle', x, y, d }          – circular pad
 *   { type: 'trace', x1, y1, x2, y2, w } – copper trace
 *   { type: 'poly', points: [{x,y}...] } – silkscreen polyline
 */

export const ADAPTER_LIBRARY = [
  {
    id: 'sot23-3',
    name: 'SOT-23-3 Adapter',
    category: 'SOT',
    pitch: 2.54,
    color: '#e0a030',

    // Through-hole pins that interface with the perfboard grid
    // These replace normal grid pads at these positions
    // Pin 1 (base/gate) = col 0, row 0  (origin)
    // Pin 2 (emitter/source) = col 0, row 1
    // Pin 3 (collector/drain) = col 2, row 0
    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 2, row: 0, label: '3' },
    ],

    // Physical SOT-23 dimensions:
    // Body: 2.9 x 1.3 mm
    // Pin pitch: 0.95 mm (pins 1-2), 1.9 mm between rows
    // We place the SOT-23 centered between through-hole pins
    // and route traces from SMD pads to TH pads

    features: {
      copper: [
        // SMD pads for SOT-23 (1.0 x 0.6 mm pads)
        // Centered at x=1.27 (between col 0 and col 2)
        // Pin 1 (left-bottom): pad at left side, bottom
        { type: 'pad', x: 1.84, y: 0.795, w: 1.0, h: 0.6 },
        // Pin 2 (left-top): pad at left side, top
        { type: 'pad', x: 1.84, y: 1.745, w: 1.0, h: 0.6 },
        // Pin 3 (right): pad at right side, center
        { type: 'pad', x: 3.24, y: 1.27, w: 1.0, h: 0.6 },

        // Traces from SMD pads to through-hole pads (0.3mm width)
        // Pin 1 SMD → TH pin 1 (col 0, row 0)
        { type: 'trace', x1: 1.84, y1: 0.795, x2: 1.5, y2: 0.795, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 0.795, x2: 0, y2: 0, w: 0.3 },
        // Pin 2 SMD → TH pin 2 (col 0, row 1 = y+2.54)
        { type: 'trace', x1: 1.84, y1: 1.745, x2: 1.5, y2: 1.745, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.745, x2: 0, y2: 2.54, w: 0.3 },
        // Pin 3 SMD → TH pin 3 (col 2, row 0 = x+5.08)
        { type: 'trace', x1: 3.24, y1: 1.27, x2: 3.54, y2: 1.27, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 1.27, x2: 5.08, y2: 0.0, w: 0.3 },
      ],

      // Mask openings match SMD pads with 0.05mm expansion
      mask: [
        { type: 'pad', x: 1.84, y: 0.795, w: 1.1, h: 0.7 },
        { type: 'pad', x: 1.84, y: 1.745, w: 1.1, h: 0.7 },
        { type: 'pad', x: 3.24, y: 1.27, w: 1.1, h: 0.7 },
      ],

      // Silkscreen: component body outline
      silk: [
        {
          type: 'poly',
          points: [
            { x: 1.09, y: 0.32 },
            { x: 3.99, y: 0.32 },
            { x: 3.99, y: 2.22 },
            { x: 1.09, y: 2.22 },
            { x: 1.09, y: 0.32 },
          ],
        },
        // Pin 1 marker dot
        { type: 'circle', x: 1.34, y: 2.42, d: 0.2 },
      ],
    },

    // Visual outline for preview rendering
    outline: { width: 6.5, height: 4.0 },
    outlineOffset: { x: 0, y: 0 },

    // Dimensions for rendering (widthPins/heightPins in grid units)
    widthPins: 3,
    heightPins: 2,
  },

  {
    id: 'sot23-5',
    name: 'SOT-23-5 Adapter',
    category: 'SOT',
    pitch: 2.54,
    color: '#e0a030',

    // 5 through-hole pins:
    // Left side:  pin 1 (row 0), pin 2 (row 1), pin 3 (row 2)
    // Right side: pin 4 (row 2), pin 5 (row 0)
    // Note: pin numbering follows SOT-23-5 convention (CCW from pin 1)
    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 2, row: 2, label: '4' },
      { col: 2, row: 0, label: '5' },
    ],

    features: {
      copper: [
        // SOT-23-5 SMD pads (0.95mm pitch between pins on each side)
        // Left side: pins 1, 2, 3
        { type: 'pad', x: 1.84, y: 1.59, w: 1.0, h: 0.55 },
        { type: 'pad', x: 1.84, y: 2.54, w: 1.0, h: 0.55 },
        { type: 'pad', x: 1.84, y: 3.49, w: 1.0, h: 0.55 },
        // Right side: pins 5, 4 (top to bottom on right)
        { type: 'pad', x: 3.24, y: 1.59, w: 1.0, h: 0.55 },
        { type: 'pad', x: 3.24, y: 3.49, w: 1.0, h: 0.55 },

        // Traces: SMD → through-hole
        // Pin 1 → col 0, row 0
        { type: 'trace', x1: 1.84, y1: 1.59, x2: 1.5, y2: 1.59, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.59, x2: 0, y2: 0, w: 0.3 },
        // Pin 2 → col 0, row 1 (y = 2.54)
        { type: 'trace', x1: 0, y1: 2.54, x2: 1.84, y2: 2.54, w: 0.3 },
        // Pin 3 → col 0, row 2 (y = 5.08)
        { type: 'trace', x1: 1.84, y1: 3.49, x2: 1.5, y2: 3.49, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.49, x2: 0, y2: 5.08, w: 0.3 },
        // Pin 4 → col 2, row 2 (x = 5.08, y = 5.08)
        { type: 'trace', x1: 3.24, y1: 3.49, x2: 3.54, y2: 3.49, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 3.49, x2: 5.08, y2: 5.08, w: 0.3 },
        // Pin 5 → col 2, row 0 (x = 5.08, y = 0)
        { type: 'trace', x1: 3.24, y1: 1.59, x2: 3.54, y2: 1.59, w: 0.3 },
        { type: 'trace', x1: 3.54, y1: 1.59, x2: 5.08, y2: 0, w: 0.3 },
      ],

      mask: [
        { type: 'pad', x: 1.84, y: 1.59, w: 1.1, h: 0.65 },
        { type: 'pad', x: 1.84, y: 2.54, w: 1.1, h: 0.65 },
        { type: 'pad', x: 1.84, y: 3.49, w: 1.1, h: 0.65 },
        { type: 'pad', x: 3.24, y: 1.59, w: 1.1, h: 0.65 },
        { type: 'pad', x: 3.24, y: 3.49, w: 1.1, h: 0.65 },
      ],

      silk: [
        {
          type: 'poly',
          points: [
            { x: 1.09, y: 1.04 },
            { x: 3.99, y: 1.04 },
            { x: 3.99, y: 4.04 },
            { x: 1.09, y: 4.04 },
            { x: 1.09, y: 1.04 },
          ],
        },
        { type: 'circle', x: 1.34, y: 4.6, d: 0.2 },
      ],
    },

    outline: { width: 6.5, height: 6.5 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 3,
    heightPins: 3,
  },

  {
    id: 'soic8',
    name: 'SOIC-8 Adapter',
    category: 'SOIC',
    pitch: 2.54,
    color: '#a060c0',

    // 8 through-hole pins in DIP-8 layout (2 rows of 4)
    throughPins: [
      { col: 0, row: 0, label: '1' },
      { col: 0, row: 1, label: '2' },
      { col: 0, row: 2, label: '3' },
      { col: 0, row: 3, label: '4' },
      { col: 3, row: 3, label: '5' },
      { col: 3, row: 2, label: '6' },
      { col: 3, row: 1, label: '7' },
      { col: 3, row: 0, label: '8' },
    ],

    features: {
      copper: [
        // SOIC-8 SMD pads (1.27mm pitch, 0.65mm wide, 1.5mm long)
        // Left side: pins 1-4
        { type: 'pad', x: 2.31, y: 1.905, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 3.175, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 4.445, w: 1.5, h: 0.6 },
        { type: 'pad', x: 2.31, y: 5.715, w: 1.5, h: 0.6 },
        // Right side: pins 5-8 (mirrored, 5 at bottom)
        { type: 'pad', x: 5.31, y: 5.715, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 4.445, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 3.175, w: 1.5, h: 0.6 },
        { type: 'pad', x: 5.31, y: 1.905, w: 1.5, h: 0.6 },

        // Traces: SMD → through-hole (direct horizontal routes)
        // Left side: pins 1-4  col 0
        { type: 'trace', x1: 2.31, y1: 1.905, x2: 1.5, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 1.905, x2: 0, y2: 0, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 3.175, x2: 1.5, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 3.175, x2: 0, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 4.445, x2: 1.5, y2: 4.445, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 4.445, x2: 0, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 2.31, y1: 5.715, x2: 1.5, y2: 5.715, w: 0.3 },
        { type: 'trace', x1: 1.5, y1: 5.715, x2: 0, y2: 7.62, w: 0.3 },
        // Right side: pins 5-8 → col 2 (x = 5.08)
        { type: 'trace', x1: 5.31, y1: 5.715, x2: 6.21, y2: 5.715, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 5.715, x2: 7.62, y2: 7.62, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 4.445, x2: 6.21, y2: 4.445, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 4.445, x2: 7.62, y2: 5.08, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 3.175, x2: 6.21, y2: 3.175, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 3.175, x2: 7.62, y2: 2.54, w: 0.3 },
        { type: 'trace', x1: 5.31, y1: 1.905, x2: 6.21, y2: 1.905, w: 0.3 },
        { type: 'trace', x1: 6.21, y1: 1.905, x2: 7.62, y2: 0, w: 0.3 },
      ],

      mask: [
        { type: 'pad', x: 2.31, y: 1.905, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 3.175, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 4.445, w: 1.6, h: 0.7 },
        { type: 'pad', x: 2.31, y: 5.715, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 5.715, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 4.445, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 3.175, w: 1.6, h: 0.7 },
        { type: 'pad', x: 5.31, y: 1.905, w: 1.6, h: 0.7 },
      ],

      silk: [
        {
          type: 'poly',
          points: [
            { x: 1.6, y: 1.15 },
            { x: 6.02, y: 1.15 },
            { x: 6.02, y: 6.47 },
            { x: 1.6, y: 6.47 },
            { x: 1.6, y: 1.15 },
          ],
        },
        // Pin 1 marker
        { type: 'circle', x: 1.95, y: 6.2, d: 0.25 },
      ],
    },

    outline: { width: 7.0, height: 10.0 },
    outlineOffset: { x: 0, y: 0 },
    widthPins: 4,
    heightPins: 4,
  },
];

/**
 * Get adapter definition by ID.
 */
export function getAdapter(adapterId) {
  return ADAPTER_LIBRARY.find(a => a.id === adapterId) || null;
}

/**
 * Get a rotated copy of an adapter definition.
 * Rotation: 0=0°, 1=90° CW, 2=180°, 3=270° CW.
 *
 * Rotates throughPins (grid indices), all feature coordinates (mm),
 * pad dimensions (w/h swap), and outline.
 * Rotation center = middle of the widthPins × heightPins grid rectangle.
 */
export function getRotatedAdapter(adapterId, rotation = 0) {
  const adapter = ADAPTER_LIBRARY.find(a => a.id === adapterId);
  if (!adapter) return null;

  const r = ((rotation % 4) + 4) % 4;
  if (r === 0) return adapter; // no-op

  const maxCol = adapter.widthPins - 1;
  const maxRow = adapter.heightPins - 1;
  const pitch = adapter.pitch;

  // Center of the grid rectangle in mm (relative to origin pin)
  const cx = maxCol * pitch / 2;
  const cy = maxRow * pitch / 2;

  // Rotate a grid index (col, row) around the rectangle center
  function rotPin(col, row) {
    switch (r) {
      case 1: return { col: row, row: maxCol - col };
      case 2: return { col: maxCol - col, row: maxRow - row };
      case 3: return { col: maxRow - row, row: col };
    }
  }

  // Rotate a point (x, y) in mm around (cx, cy)
  function rotPt(x, y) {
    const dx = x - cx, dy = y - cy;
    switch (r) {
      case 1: return { x: cy + dy, y: cx - dx };   // (dx,dy) → (dy,-dx) + new center
      case 2: return { x: cx - dx, y: cy - dy };
      case 3: return { x: cy - dy, y: cx + dx };    // (dx,dy) → (-dy,dx) + new center
    }
  }

  // Rotated throughPins
  const throughPins = adapter.throughPins.map(p => ({
    ...rotPin(p.col, p.row),
    label: p.label,
  }));

  // Swap dimensions for 90°/270°
  const swap = r === 1 || r === 3;
  const widthPins = swap ? adapter.heightPins : adapter.widthPins;
  const heightPins = swap ? adapter.widthPins : adapter.heightPins;
  const outline = swap
    ? { width: adapter.outline.height, height: adapter.outline.width }
    : { ...adapter.outline };

  // Rotate feature coordinates
  function rotFeature(f) {
    if (f.type === 'pad') {
      const p = rotPt(f.x, f.y);
      return {
        type: 'pad', x: p.x, y: p.y,
        w: swap ? f.h : f.w,
        h: swap ? f.w : f.h,
      };
    } else if (f.type === 'trace') {
      const p1 = rotPt(f.x1, f.y1);
      const p2 = rotPt(f.x2, f.y2);
      return { type: 'trace', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, w: f.w };
    } else if (f.type === 'circle') {
      const p = rotPt(f.x, f.y);
      return { type: 'circle', x: p.x, y: p.y, d: f.d };
    } else if (f.type === 'poly') {
      return { type: 'poly', points: f.points.map(pt => rotPt(pt.x, pt.y)) };
    }
    return f;
  }

  return {
    ...adapter,
    throughPins,
    widthPins,
    heightPins,
    outline,
    features: {
      copper: adapter.features.copper.map(rotFeature),
      mask: adapter.features.mask.map(rotFeature),
      silk: adapter.features.silk.map(rotFeature),
    },
  };
}

/**
 * Compute absolute through-hole positions for a placed adapter.
 * Returns array of { x, y, col, row } in board mm coordinates.
 */
export function getAdapterThroughHoles(adapter, inst, gridLeft, gridBottom, pitch) {
  return adapter.throughPins.map(pin => {
    const col = inst.col + pin.col;
    const row = inst.row + pin.row;
    return {
      x: gridLeft + col * pitch,
      y: gridBottom + row * pitch,
      col,
      row,
    };
  });
}

/**
 * Compute absolute positions of all adapter Gerber features.
 * Applies offset from grid position to all feature coordinates.
 * Returns { copper, mask, silk } with absolute mm coordinates.
 */
export function getAdapterFeatures(adapter, inst, gridLeft, gridBottom, pitch) {
  const originX = gridLeft + inst.col * pitch;
  const originY = gridBottom + inst.row * pitch;

  function offsetPad(p) {
    return { type: 'pad', x: originX + p.x, y: originY + p.y, w: p.w, h: p.h };
  }

  function offsetTrace(t) {
    return {
      type: 'trace',
      x1: originX + t.x1, y1: originY + t.y1,
      x2: originX + t.x2, y2: originY + t.y2,
      w: t.w,
    };
  }

  function offsetCircle(c) {
    return { type: 'circle', x: originX + c.x, y: originY + c.y, d: c.d };
  }

  function offsetPoly(p) {
    return {
      type: 'poly',
      points: p.points.map(pt => ({ x: originX + pt.x, y: originY + pt.y })),
    };
  }

  function offsetFeature(f) {
    switch (f.type) {
      case 'pad': return offsetPad(f);
      case 'trace': return offsetTrace(f);
      case 'circle': return offsetCircle(f);
      case 'poly': return offsetPoly(f);
      default: return f;
    }
  }

  return {
    copper: adapter.features.copper.map(offsetFeature),
    mask: adapter.features.mask.map(offsetFeature),
    silk: adapter.features.silk.map(offsetFeature),
  };
}