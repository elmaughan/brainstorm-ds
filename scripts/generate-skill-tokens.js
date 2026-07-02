const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../tokens/dist/tokens.css');
const outPath = path.join(__dirname, '../skill/tokens.md');

const css = fs.readFileSync(cssPath, 'utf8');

const varRegex = /--([a-z0-9-]+):\s*([^;]+);/g;
const tokens = [];
let match;
while ((match = varRegex.exec(css)) !== null) {
  tokens.push({ name: '--' + match[1], value: match[2].trim() });
}

const groups = {};
tokens.forEach(function(t) {
  var group = t.name.replace('--bsn-', '').split('-')[0];
  if (!groups[group]) groups[group] = [];
  groups[group].push(t);
});

var lines = [
  '# BrainStorm DS — Token Reference',
  '',
  '> Auto-generated from tokens/dist/tokens.css — do not edit directly.',
  '> Last updated: ' + new Date().toUTCString(),
  '',
  '## Usage rule',
  '',
  'Never hardcode hex values, px values, or font names in any component or prototype.',
  'Always reference a CSS variable from this file.',
  '',
];

var groupOrder = ['color', 'bg', 'text', 'border', 'interactive', 'chart', 'space', 'radius'];
var sortedGroups = groupOrder.filter(function(g) { return groups[g]; });
Object.keys(groups).forEach(function(g) {
  if (groupOrder.indexOf(g) === -1) sortedGroups.push(g);
});

sortedGroups.forEach(function(group) {
  lines.push('## ' + group.charAt(0).toUpperCase() + group.slice(1) + ' tokens');
  lines.push('');
  lines.push('| Variable | Value |');
  lines.push('|---|---|');
  groups[group].forEach(function(t) {
    lines.push('| `' + t.name + '` | `' + t.value + '` |');
  });
  lines.push('');
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join('\n'));
console.log('✓ skill/tokens.md written (' + tokens.length + ' tokens)');
