<script>
  import { MODULE_LIBRARY } from '../lib/modules.js';

  let { modules = $bindable(), config } = $props();
  let selectedModuleId = $state('');

  // Group modules by category
const categories = Object.groupBy
  ? Object.groupBy(MODULE_LIBRARY, m => m.category)
  : MODULE_LIBRARY.reduce((cats, m) => {
      (cats[m.category] ??= []).push(m);
      return cats;
    }, {});
function addModule() {
  if (!selectedModuleId) return;
  const def = MODULE_LIBRARY.find(m => m.id === selectedModuleId);
  if (!def) return;

  // Grid size calculation (inline, avoids $state proxy issues with computeGrid)
  const pitch = config.pitch;
  const margin = pitch + 0.5;
  const cols = Math.max(0, Math.floor((config.width - 2 * margin) / pitch + 1));
  const rows = Math.max(0, Math.floor((config.height - 2 * margin) / pitch + 1));

  // Center module on the grid
  const col = Math.max(0, Math.floor((cols - def.widthPins) / 2));
  const row = Math.max(0, Math.floor((rows - def.heightPins) / 2));

  modules = [...modules, {
    id: crypto.randomUUID(),
    moduleId: selectedModuleId,
    name: def.name,
    col,
    row,
    color: def.color,
  }];
}

  function removeModule(instanceId) {
    modules = modules.filter(m => m.id !== instanceId);
  }
</script>

<div class="module-toolbar">
  <div class="toolbar-row">
    <select class="module-select" bind:value={selectedModuleId}>
      <option value="">Module Preview...</option>
      {#each Object.entries(categories) as [cat, mods]}
        <optgroup label={cat}>
          {#each mods as mod}
            <option value={mod.id}>{mod.name}</option>
          {/each}
        </optgroup>
      {/each}
    </select>

    <button class="place-btn" onclick={addModule} disabled={!selectedModuleId}>
      Place ↓
    </button>

    {#if modules.length > 0}
      <span class="module-count">{modules.length} placed</span>
    {/if}
  </div>

  {#if modules.length > 0}
    <div class="placed-list">
      {#each modules as inst (inst.id)}
        <span class="placed-tag" style="border-color: {inst.color}">
          {inst.name}
          <button class="remove-btn" onclick={() => removeModule(inst.id)}>×</button>
        </span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .module-toolbar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    background: #1a1a1a;
    border-radius: 8px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 13px;
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .module-select {
    flex: 1;
    min-width: 180px;
    padding: 7px 10px;
    background: #313244;
    border: 1px solid #45475a;
    border-radius: 6px;
    color: #cdd6f4;
    font-size: 13px;
  }
  .module-select:focus { outline: none; border-color: #89b4fa; }

  .place-btn {
    padding: 7px 14px;
    background: #89b4fa;
    color: #1e1e2e;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
    white-space: nowrap;
  }
  .place-btn:hover { background: #74a8f7; }
  .place-btn:disabled {
    background: #585b70;
    color: #45475a;
    cursor: not-allowed;
  }

  .module-count {
    color: #6c9fb2;
    font-size: 12px;
    white-space: nowrap;
  }

  .placed-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .placed-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #313244;
    border: 1px solid #45475a;
    border-left-width: 3px;
    border-radius: 4px;
    color: #cdd6f4;
    font-size: 12px;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #f38ba8;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    padding: 0 2px;
    line-height: 1;
  }
  .remove-btn:hover { color: #ff6b8a; }
</style>