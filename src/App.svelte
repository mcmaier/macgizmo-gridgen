<script>
  import Controls from './components/Controls.svelte';
  import Preview from './components/Preview.svelte';
  import { generateAllFiles } from './lib/gerber.js';
  import { downloadAsZip } from './lib/zip.js';
  import logo from './assets/protogrid.png';

  let config = $state({
    width: 50,
    height: 40,
    pitch: 2.54,
    padDiameter: 1.0,
    annularRing: 0.3,
    powerRails: {
      top: true,
      bottom: false,
      left: false,
      right: false,
    },
    mountingHoles: {
      mode: 'none',       // 'none' | 'diagonal' | '4corners'
      diameter: 3.2,       // mm
      edgeDistance: 4.0,    // mm from board edge
    },
    labels: {
      rows: false,          // row numbers on left
      cols: false,          // column letters on top
    },
  });

  async function handleExport() {
    const files = generateAllFiles(config);
    const name = `ProtoGrid-${config.width}x${config.height}-${config.pitch}mm.zip`;
    await downloadAsZip(files, name);
  }
</script>

<div class="ppp-app">
  <div class="ppp-header">
    <img src={logo} alt="MacGizmo ProtoGrid" class="logo" />    
    <span class="subtitle">Parametric Prototype PCB Generator</span>
  </div>

  <div class="ppp-layout">
    <aside class="ppp-sidebar">
      <Controls bind:config onExport={handleExport} />
    </aside>
    <main class="ppp-main">
      <Preview {config} />
    </main>
  </div>

  <div class="ppp-footer">
    <span>Gerber RS-274X + Excellon Drill · Ready for JLCPCB, PCBWay, Aisler,...</span>
  </div>
</div>

<style>
  .ppp-app {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #fcfaf9;
  }

  .ppp-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    margin-bottom: 16px;
  }

  .subtitle {
    font-size: 16px;
    color: #fcfaf9;
  }
  
  .logo {
    height: 72px;
    width: auto;
  }

  .ppp-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }

  .ppp-sidebar {
    position: sticky;
    top: 20px;
  }

  .ppp-main {
    min-height: 300px;
  }

  .ppp-footer {
    margin-top: 16px;
    padding: 10px;
    text-align: center;
    font-size: 12px;
    color: #6c9fb2;
  }

  @media (max-width: 640px) {
    .ppp-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
