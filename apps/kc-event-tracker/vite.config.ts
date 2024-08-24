import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    preact(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'KuCoin Event Tracker',
        icon: 'https://www.google.com/s2/favicons?sz=64&domain=kucoin.com',
        namespace: 'kucoin',
        match: [
          'https://www.kucoin.com/*',
          'https://*.dev.kucoin.net/*',
          'https://*.sit.kucoin.net/*',
          'http://localhost*',
        ],
        // 在正式环境 www.kucoin.com 中执行时，document.body 为 null，会导致报错，Event Tracker 无法正常渲染
        // 'run-at': 'document-start',
        grant: 'none',
        updateURL: 'https://bitbucket.kucoin.net/users/herin.yao_kupotech.com/repos/tools/raw/tampermonkey/kc-event-tracker.user.js',
        downloadURL: 'https://bitbucket.kucoin.net/users/herin.yao_kupotech.com/repos/tools/raw/tampermonkey/kc-event-tracker.user.js',
      },
      build: {
        // fileName: 'kc-event-tracker.user.js',
        externalGlobals: {
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
          'preact/hooks': cdn.jsdelivr('preact', 'hooks/dist/hooks.umd.js'),
        },
        // autoGrant: true,
      },
    }),
  ],
});
