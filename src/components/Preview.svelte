<script>
  import { generatePadPositions, generatePowerRailTraces, RAIL_TRACE_WIDTH } from '../lib/gerber.js';

  let { config } = $props();

  let fullConfig = $derived({
    ...config,
  });

  let pads = $derived(generatePadPositions(fullConfig));
  let traces = $derived(generatePowerRailTraces(fullConfig));

  let viewBox = $derived(`-1 -1 ${config.width + 2} ${config.height + 2}`);

  const colors = {
    board: '#1a5c1a',
    boardStroke: '#0d3d0d',
    pad: '#c8a84e',
    padHole: '#1a1a1a',
    vcc: '#cc3333',
    gnd: '#3333cc',
  };

  let copperDia = $derived(fullConfig.padDiameter + fullConfig.annularRing * 2);
</script>

<svg
  viewBox={viewBox}
  xmlns="http://www.w3.org/2000/svg"
  class="pcb-preview"
>
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
</svg>

<style>
  .pcb-preview {
    width: 100%;
    height: auto;
    max-height: 500px;
    border-radius: 8px;
    background: #111;
    padding: 8px;
  }
</style>
