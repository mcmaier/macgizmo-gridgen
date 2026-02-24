<script>
  import { computeSignalGrid, computeMinSize, BOARD_MIN_WIDTH, BOARD_MAX_WIDTH, BOARD_MIN_HEIGHT, BOARD_MAX_HEIGHT } from '../lib/gerber.js';

  let { config = $bindable(), onExport } = $props();

  let minSize = $derived(computeMinSize(config.pitch, config.powerRails));
  let effMinW = $derived(Math.max(BOARD_MIN_WIDTH, minSize.minWidth));
  let effMinH = $derived(Math.max(BOARD_MIN_HEIGHT, minSize.minHeight));

  let sigGrid = $derived(computeSignalGrid(config));

  // Text input buffers – decoupled from config so typing isn't interrupted
  let widthText = $state(String(config.width));
  let heightText = $state(String(config.height));

  // Sync text buffers when config changes externally (e.g. rail toggle clamp)
  let lastWidth = $state(config.width);
  let lastHeight = $state(config.height);

  $effect(() => {
    if (config.width !== lastWidth) {
      widthText = String(config.width);
      lastWidth = config.width;
    }
    if (config.height !== lastHeight) {
      heightText = String(config.height);
      lastHeight = config.height;
    }
  });

  // Clamp when rails change
  $effect(() => {
    const cw = clamp(config.width, effMinW, BOARD_MAX_WIDTH);
    const ch = clamp(config.height, effMinH, BOARD_MAX_HEIGHT);
    if (cw !== config.width) config.width = cw;
    if (ch !== config.height) config.height = ch;
  });

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  // Slider drives config directly
  function onSliderWidth(e) {
    config.width = +e.target.value;
    widthText = String(config.width);
    lastWidth = config.width;
  }

  function onSliderHeight(e) {
    config.height = +e.target.value;
    heightText = String(config.height);
    lastHeight = config.height;
  }

  // Text input: free typing, commit on blur or Enter
  function commitWidth() {
    const v = parseInt(widthText, 10);
    config.width = isNaN(v) ? effMinW : clamp(v, effMinW, BOARD_MAX_WIDTH);
    widthText = String(config.width);
    lastWidth = config.width;
  }

  function commitHeight() {
    const v = parseInt(heightText, 10);
    config.height = isNaN(v) ? effMinH : clamp(v, effMinH, BOARD_MAX_HEIGHT);
    heightText = String(config.height);
    lastHeight = config.height;
  }

  function onKeydown(e, commitFn) {
    if (e.key === 'Enter') {
      commitFn();
      e.target.blur();
    }
  }

  function toggleRail(side) {
    config.powerRails = {
      ...config.powerRails,
      [side]: !config.powerRails[side],
    };
  }
</script>

<div class="controls">
  <h2>Board Parameters</h2>

  <div class="control-group">
    <div class="slider-field">
      <span class="slider-label">Width (mm)</span>
      <div class="slider-row">
        <input type="range" class="slider"
          min={effMinW} max={BOARD_MAX_WIDTH} step="1"
          value={config.width}
          oninput={onSliderWidth} />
        <input type="text" class="slider-text"
          bind:value={widthText}
          onblur={commitWidth}
          onkeydown={(e) => onKeydown(e, commitWidth)} />
      </div>
    </div>

    <div class="slider-field">
      <span class="slider-label">Height (mm)</span>
      <div class="slider-row">
        <input type="range" class="slider"
          min={effMinH} max={BOARD_MAX_HEIGHT} step="1"
          value={config.height}
          oninput={onSliderHeight} />
        <input type="text" class="slider-text"
          bind:value={heightText}
          onblur={commitHeight}
          onkeydown={(e) => onKeydown(e, commitHeight)} />
      </div>
    </div>
  </div>

  <div class="control-group">
    <label>
      Pitch
      <select bind:value={config.pitch}>
        <option value={2.54}>2.54 mm (Standard)</option>
        <option value={2.0}>2.0 mm</option>
      </select>
    </label>
  </div>

  <div class="control-group">
    <h3>Power Rails</h3>
    <div class="rail-toggles">
      <button class="rail-btn" class:active={config.powerRails.top}
        onclick={() => toggleRail('top')}>Top</button>
      <button class="rail-btn" class:active={config.powerRails.bottom}
        onclick={() => toggleRail('bottom')}>Bottom</button>
      <button class="rail-btn" class:active={config.powerRails.left}
        onclick={() => toggleRail('left')}>Left</button>
      <button class="rail-btn" class:active={config.powerRails.right}
        onclick={() => toggleRail('right')}>Right</button>
    </div>
  </div>

  <div class="info">
    <span>Signal: {sigGrid.cols} × {sigGrid.rows}</span>
    <span>Pads: {sigGrid.total}</span>
  </div>

  {#if sigGrid.total === 0}
    <div class="warning">Board too small for signal pads with current rails.</div>
  {/if}

  <button class="export-btn" onclick={onExport} disabled={sigGrid.total === 0}>
    ⬇ Download Gerber ZIP
  </button>
</div>

<style>
  .controls {
    display: flex; flex-direction: column; gap: 16px; padding: 20px;
    background: #1f1f1f; border-radius: 12px;
    color: #fcfaf9; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px;
  }

  h2 { margin: 0; font-size: 18px; color: #89b4fa; font-weight: 600; }

  h3 {
    margin: 0 0 8px 0; font-size: 13px; color: #a6adc8;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  .control-group { display: flex; flex-direction: column; gap: 10px; }

  label {
    display: flex; justify-content: space-between;
    align-items: center; gap: 12px;
  }

  select {
    width: 120px; padding: 6px 10px; background: #313244;
    border: 1px solid #45475a; border-radius: 6px;
    color: #cdd6f4; font-size: 14px; text-align: right;
  }
  select:focus { outline: none; border-color: #89b4fa; }

  /* Slider + text combo */
  .slider-field { display: flex; flex-direction: column; gap: 4px; }
  .slider-label { font-size: 13px; color: #a6adc8; }

  .slider-row {
    display: flex; align-items: center; gap: 10px;
  }

  .slider {
    flex: 1; height: 6px; -webkit-appearance: none; appearance: none;
    background: #313244; border-radius: 3px; outline: none;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 16px; height: 16px; border-radius: 50%;
    background: #89b4fa; cursor: pointer;
    border: 2px solid #1e1e2e;
  }
  .slider::-moz-range-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: #89b4fa; cursor: pointer;
    border: 2px solid #1e1e2e;
  }
  .slider::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; }
  .slider::-moz-range-track { height: 6px; border-radius: 3px; background: #313244; }

  .slider-text {
    width: 56px; padding: 4px 6px; background: #313244;
    border: 1px solid #45475a; border-radius: 6px;
    color: #cdd6f4; font-size: 14px; text-align: center;
  }
  .slider-text:focus { outline: none; border-color: #89b4fa; }

  .rail-toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }

  .rail-btn {
    padding: 8px; background: #313244; border: 1px solid #45475a;
    border-radius: 6px; color: #a6adc8; cursor: pointer;
    font-size: 13px; transition: all 0.15s ease;
  }
  .rail-btn:hover { background: #45475a; }
  .rail-btn.active { background: #89b4fa22; border-color: #89b4fa; color: #89b4fa; }

  .info {
    display: flex; justify-content: space-between;
    padding: 10px 12px; background: #313244;
    border-radius: 6px; font-size: 13px; color: #a6adc8;
  }

  .warning {
    padding: 8px 12px; background: #f38ba822; border: 1px solid #f38ba8;
    border-radius: 6px; font-size: 12px; color: #f38ba8;
  }

  .export-btn {
    padding: 12px; background: #f8c000; color: #1e1e2e;
    border: none; border-radius: 8px;
    font-size: 15px; font-weight: 600; cursor: pointer;
    transition: background 0.15s ease;
  }
  .export-btn:hover { background: #c49800; }
  .export-btn:disabled { background: #585b70; cursor: not-allowed; }
</style>
