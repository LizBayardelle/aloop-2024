const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  outdir: 'app/assets/builds',
  absWorkingDir: path.join(process.cwd(), 'app/javascript'),
  watch: process.argv.includes('--watch'),
  plugins: [],
}).catch(() => process.exit(1));
