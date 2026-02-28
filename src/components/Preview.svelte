<script>
  import { generatePadPositions, generatePowerRailTraces, computeMountingHoles, generateLabelStrokes, RAIL_TRACE_WIDTH, MOUNT_KEEPOUT_MARGIN } from '../lib/gerber.js';
  import { MODULE_LIBRARY, getModulePins } from '../lib/modules.js';

  let { config, modules = $bindable() } = $props();

  let fullConfig = $derived({
    ...config,
  });

  let pads = $derived(generatePadPositions(fullConfig));
  let traces = $derived(generatePowerRailTraces(fullConfig));
  let mountHoles = $derived(computeMountingHoles(fullConfig));
  let labelStrokes = $derived(generateLabelStrokes(fullConfig));

  // Extra padding for labels outside the board
  let labelPad = 2;//$derived((config.labels?.rows || config.labels?.cols) ? 4 : 1);
  let viewBox = $derived(`${-labelPad} ${-labelPad} ${config.width + labelPad * 2} ${config.height + labelPad * 2}`);

  const colors = {
    board: '#1a5c1a',
    boardStroke: '#0d3d0d',
    pad: '#c8a84e',
    padHole: '#1a1a1a',
    vcc: '#cc3333',
    gnd: '#3333cc',
    mountRing: '#888888',
    mountHole: '#1a1a1a',
    keepout: '#0d3d0d',
    silkscreen: '#e8e8e8',
  };

  let copperDia = $derived(fullConfig.padDiameter + fullConfig.annularRing * 2);

  // Convert polyline to SVG path "d" string
  function polyToPath(polyline) {
    if (polyline.length < 2) return '';
    let d = `M${polyline[0].x},${polyline[0].y}`;
    for (let i = 1; i < polyline.length; i++) {
      d += `L${polyline[i].x},${polyline[i].y}`;
    }
    return d;
  }

  
  // ── Module rendering helpers ──

  /** Convert module grid position to board mm coordinates */
  function moduleToMm(inst) {
    const def = MODULE_LIBRARY.find(m => m.id === inst.moduleId);
    if (!def) return null;
    const pitch = config.pitch;
    // Module origin is the first pin position
    const x = grid.gridLeft + inst.col * pitch;
    const y = grid.gridBottom + inst.row * pitch;
    return { x, y, def, pitch };
  }

  // ── Drag handling ──
  let svgEl = $state(null);
  let dragging = $state(null); // { instanceId, startCol, startRow, startMouseX, startMouseY }

  function getSvgPoint(e) {
    if (!svgEl) return { x: 0, y: 0 };
    const pt = svgEl.createSVGPoint();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgEl.getScreenCTM().inverse();
    const svgPt = pt.matrixTransform(ctm);
    // Undo the Y-flip: SVG has scale(1,-1) translate(0,-height)
    return { x: svgPt.x, y: config.height - svgPt.y };
  }

  function onModulePointerDown(e, inst) {
    e.preventDefault();
    e.stopPropagation();
    const pt = getSvgPoint(e);
    dragging = {
      instanceId: inst.id,
      startCol: inst.col,
      startRow: inst.row,
      startX: pt.x,
      startY: pt.y,
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const pt = getSvgPoint(e);
    const pitch = config.pitch;
    const dCols = Math.round((pt.x - dragging.startX) / pitch);
    const dRows = Math.round((pt.y - dragging.startY) / pitch);

    const newCol = dragging.startCol + dCols;
    const newRow = dragging.startRow + dRows;

    modules = modules.map(m =>
      m.id === dragging.instanceId
        ? { ...m, col: newCol, row: newRow }
        : m
    );
  }

  function onPointerUp() {
    dragging = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }
</script>

<svg
  bind:this={svgEl}
  viewBox={viewBox}
  xmlns="http://www.w3.org/2000/svg"
  class="pcb-preview"
>
  <!-- Flip Y axis: Gerber Y=0 is bottom, SVG Y=0 is top -->
  <g transform="scale(1,-1) translate(0,{-config.height})">
  <!-- PCB Board -->
  <rect
    x="0" y="0"
    width={config.width}
    height={config.height}
    fill={colors.board}
    stroke={colors.boardStroke}
    stroke-width="0.2"
    rx="0.3"
  />

  <!-- Mounting hole keepout zones (darker area, no copper) -->
  {#each mountHoles as hole}
    <circle
      cx={hole.x}
      cy={hole.y}
      r={hole.keepout / 2}
      fill={colors.keepout}
      opacity="0.7"
    />
  {/each}

  <!-- Power rail traces -->
  {#each traces as t}
    <line
      x1={t.x1} y1={t.y1}
      x2={t.x2} y2={t.y2}
      stroke={t.type === 'vcc' ? colors.vcc : colors.gnd}
      stroke-width={RAIL_TRACE_WIDTH}
      stroke-linecap="round"
      opacity="0.6"
    />
  {/each}

  <!-- Pads -->
  {#each pads as pad}
    <circle
      cx={pad.x}
      cy={pad.y}
      r={copperDia / 2}
      fill={pad.type === 'vcc' ? colors.vcc : pad.type === 'gnd' ? colors.gnd : colors.pad}
    />
    <circle
      cx={pad.x}
      cy={pad.y}
      r={fullConfig.padDiameter / 2}
      fill={colors.padHole}
    />
  {/each}

  <!-- Mounting holes (on top of everything) -->
  {#each mountHoles as hole}
    <!-- Silver ring -->
    <circle
      cx={hole.x}
      cy={hole.y}
      r={hole.keepout / 2 - MOUNT_KEEPOUT_MARGIN / 2}
      fill="none"
      stroke={colors.mountRing}
      stroke-width="0.3"
      opacity="0.5"
    />
    <!-- Drill hole -->
    <circle
      cx={hole.x}
      cy={hole.y}
      r={hole.diameter / 2}
      fill={colors.mountHole}
    />
  {/each}

  <!-- Silkscreen labels -->
  {#each labelStrokes as polyline}
    <path
      d={polyToPath(polyline)}
      stroke={colors.silkscreen}
      stroke-width="0.15"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  {/each}
  
  <!-- Module overlays -->
  {#each modules as inst (inst.id)}
    {@const m = moduleToMm(inst)}
    {#if m}
      {@const pins = getModulePins(inst.moduleId)}
      {@const outW = m.def.outline.width}
      {@const outH = m.def.outline.height}
      {@const pinW = (m.def.widthPins - 1) * m.pitch}
      {@const pinH = (m.def.heightPins - 1) * m.pitch}
      {@const ofsX = (outW - pinW) / 2}
      {@const ofsY = (outH - pinH) / 2}

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <g
        class="module-overlay"
        class:dragging={dragging?.instanceId === inst.id}
        onpointerdown={(e) => onModulePointerDown(e, inst)}
        style="cursor: grab;"
      >
        <!-- Module body outline -->
        <rect
          x={m.x - ofsX}
          y={m.y - ofsY}
          width={outW}
          height={outH}
          fill={inst.color}
          fill-opacity="0.2"
          stroke={inst.color}
          stroke-width="0.3"
          stroke-dasharray="1 0.5"
          rx="0.5"
        />

        <!-- Pin markers -->
        {#each pins as pin}
          <circle
            cx={m.x + pin.col * m.pitch}
            cy={m.y + pin.row * m.pitch}
            r={m.pitch * 0.25}
            fill={inst.color}
            fill-opacity="0.5"
            stroke={inst.color}
            stroke-width="0.15"
          />
        {/each}

        <!-- Module label (flipped back so text reads correctly) -->
        <g transform="translate({m.x + pinW / 2},{m.y + pinH / 2}) scale(1,-1)">
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="central"
            fill={inst.color}
            fill-opacity="0.8"
            font-size="{Math.min(2.5, pinW * 0.15)}"
            font-family="'Segoe UI', system-ui, sans-serif"
            font-weight="600"
          >{m.def.name}</text>
        </g>
      </g>
    {/if}
  {/each}
  </g>
</svg>

<style>
  .pcb-preview {
    width: 100%;
    height: auto;
    max-height: 800px;
    border-radius: 8px;
    background: #111;
    padding: 8px;
  }
  
  .module-overlay {
    touch-action: none;
  }

  .module-overlay:hover rect {
    fill-opacity: 0.3;
    stroke-width: 0.5;
  }

  .module-overlay.dragging rect {
    fill-opacity: 0.35;
    stroke-dasharray: none;
  }
</style>
