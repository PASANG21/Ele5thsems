import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function inlineSingleFileHtml(): Plugin {
  return {
    name: 'inline-single-file-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const htmlKey = Object.keys(bundle).find((fileName) => fileName.endsWith('.html'));
      if (!htmlKey) return;

      const htmlAsset = bundle[htmlKey];
      if (htmlAsset.type !== 'asset' || typeof htmlAsset.source !== 'string') return;

      let html = htmlAsset.source;

      const cssChunks: string[] = [];
      const jsChunks: string[] = [];

      for (const [fileName, output] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && output.type === 'asset') {
          const cssText =
            typeof output.source === 'string'
              ? output.source
              : Buffer.from(output.source).toString('utf8');
          cssChunks.push(cssText);
          delete bundle[fileName];
        } else if (fileName.endsWith('.js') && output.type === 'chunk') {
          jsChunks.push(output.code);
          delete bundle[fileName];
        }
      }

      // Remove external stylesheet, modulepreload, and module script tags emitted by Vite
      html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, '');
      html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>\s*/gi, '');
      html = html.replace(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>\s*<\/script>\s*/gi, '');

      if (cssChunks.length > 0) {
        const safeCss = cssChunks.join('\n').replace(/<\/style/gi, '<\\/style');
        html = html.replace('</head>', () => `    <style>${safeCss}</style>\n  </head>`);
      }

      if (jsChunks.length > 0) {
        const safeJs = jsChunks.join('\n').replace(/<\/script/gi, '<\\/script');
        html = html.replace('</body>', () => `    <script>${safeJs}</script>\n  </body>`);
      }

      htmlAsset.source = html;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), inlineSingleFileHtml()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      copyPublicDir: false,
      cssCodeSplit: false,
      assetsInlineLimit: 100_000_000,
      rollupOptions: {
        output: {
          format: 'iife' as const,
          inlineDynamicImports: true,
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
