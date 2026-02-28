/**
 * Module footprint library for MacGizmo GridGen.
 * 
 * Each module defines:
 *   - id: unique identifier
 *   - name: display name
 *   - category: for grouping in dropdown
 *   - widthPins / heightPins: dimensions in grid pitch units
 *   - pinRows: array of pin row definitions (dual-inline)
 *   - color: overlay tint color
 *   - outline: { width, height } in mm (physical package size)
 *
 * Pin row format: { x, y, count, dx, dy }
 *   Start at (x, y) in pitch units from module origin,
 *   place 'count' pins stepping by (dx, dy) in pitch units.
 */

export const MODULE_LIBRARY = [
  {
    id: 'esp32-devkit-30pin',
    name: 'ESP32 DevKit (30-pin)',
    category: 'Microcontroller',
    widthPins: 11,    // across (pin-to-pin)
    heightPins: 15,   // along (pins per side)
    pinRows: [
      { x: 0, y: 0, count: 15, dx: 0, dy: 1 },   // left column
      { x: 10, y: 0, count: 15, dx: 0, dy: 1 },   // right column
    ],
    outline: { width: 25.4, height: 48.3 },
    color: '#e06030',
  },
  {
    id: 'esp32-devkit-38pin',
    name: 'ESP32 DevKit (38-pin)',
    category: 'Microcontroller',
    widthPins: 11,
    heightPins: 19,
    pinRows: [
      { x: 0, y: 0, count: 19, dx: 0, dy: 1 },
      { x: 10, y: 0, count: 19, dx: 0, dy: 1 },
    ],
    outline: { width: 25.4, height: 55.3 },
    color: '#e06030',
  },
  {
    id: 'arduino-nano',
    name: 'Arduino Nano',
    category: 'Microcontroller',
    widthPins: 7,
    heightPins: 15,
    pinRows: [
      { x: 0, y: 0, count: 15, dx: 0, dy: 1 },
      { x: 6, y: 0, count: 15, dx: 0, dy: 1 },
    ],
    outline: { width: 18.0, height: 43.2 },
    color: '#3080d0',
  },
  {
    id: 'arduino-pro-mini',
    name: 'Arduino Pro Mini',
    category: 'Microcontroller',
    widthPins: 7,
    heightPins: 12,
    pinRows: [
      { x: 0, y: 0, count: 12, dx: 0, dy: 1 },
      { x: 6, y: 0, count: 12, dx: 0, dy: 1 },
    ],
    outline: { width: 18.0, height: 33.0 },
    color: '#30a050',
  },
  {
    id: 'esp8266-nodemcu',
    name: 'ESP8266 NodeMCU',
    category: 'Microcontroller',
    widthPins: 11,
    heightPins: 15,
    pinRows: [
      { x: 0, y: 0, count: 15, dx: 0, dy: 1 },
      { x: 10, y: 0, count: 15, dx: 0, dy: 1 },
    ],
    outline: { width: 25.6, height: 48.6 },
    color: '#d0a030',
  },
  {
    id: 'raspberry-pi-pico',
    name: 'Raspberry Pi Pico',
    category: 'Microcontroller',
    widthPins: 7,
    heightPins: 20,
    pinRows: [
      { x: 0, y: 0, count: 20, dx: 0, dy: 1 },
      { x: 6, y: 0, count: 20, dx: 0, dy: 1 },
    ],
    outline: { width: 21.0, height: 51.0 },
    color: '#40a070',
  },
  {
    id: 'wemos-d1-mini',
    name: 'Wemos D1 Mini',
    category: 'Microcontroller',
    widthPins: 7,
    heightPins: 8,
    pinRows: [
      { x: 0, y: 0, count: 8, dx: 0, dy: 1 },
      { x: 6, y: 0, count: 8, dx: 0, dy: 1 },
    ],
    outline: { width: 25.6, height: 34.2 },
    color: '#3070c0',
  },
  {
    id: 'oled-128x64-i2c',
    name: 'OLED 0.96" I2C (4-pin)',
    category: 'Display',
    widthPins: 1,
    heightPins: 4,
    pinRows: [
      { x: 0, y: 0, count: 4, dx: 0, dy: 1 },
    ],
    outline: { width: 27.0, height: 27.0 },
    color: '#8080d0',
  },
  {
    id: 'dip8',
    name: 'DIP-8 IC',
    category: 'IC',
    widthPins: 3,
    heightPins: 4,
    pinRows: [
      { x: 0, y: 0, count: 4, dx: 0, dy: 1 },
      { x: 2, y: 0, count: 4, dx: 0, dy: 1 },
    ],
    outline: { width: 9.4, height: 10.2 },
    color: '#606060',
  },
  {
    id: 'dip16',
    name: 'DIP-16 IC',
    category: 'IC',
    widthPins: 3,
    heightPins: 8,
    pinRows: [
      { x: 0, y: 0, count: 8, dx: 0, dy: 1 },
      { x: 2, y: 0, count: 8, dx: 0, dy: 1 },
    ],
    outline: { width: 9.4, height: 20.3 },
    color: '#606060',
  },
  {
    id: 'dip28',
    name: 'DIP-28 IC (ATmega328)',
    category: 'IC',
    widthPins: 3,
    heightPins: 14,
    pinRows: [
      { x: 0, y: 0, count: 14, dx: 0, dy: 1 },
      { x: 2, y: 0, count: 14, dx: 0, dy: 1 },
    ],
    outline: { width: 9.4, height: 35.6 },
    color: '#606060',
  },
];

/**
 * Get pin positions in pitch-unit offsets from module origin.
 * Returns array of { col, row } offsets.
 */
export function getModulePins(moduleId) {
  const mod = MODULE_LIBRARY.find(m => m.id === moduleId);
  if (!mod) return [];

  const pins = [];
  for (const pr of mod.pinRows) {
    for (let i = 0; i < pr.count; i++) {
      pins.push({
        col: pr.x + i * pr.dx,
        row: pr.y + i * pr.dy,
      });
    }
  }
  return pins;
}