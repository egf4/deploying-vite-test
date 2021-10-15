import { defineConfig } from "vite";
import { resolve } from "path";
import { viteSingleFile } from "./vite-single-file";
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue(), viteSingleFile()],
    build: {
        target: "esnext",
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        rollupOptions: {
            input: {
                VITE_TEST: resolve(__dirname, "./index.html"),
                // VITE_TEST2: resolve(__dirname, "VITE_TEST2/index.html"),
            },
            inlineDynamicImports: true,
            output: {
                manualChunks: () => "everything.js",
                // entryFileNames: () => '[name].js'
            },
        },
    },
    resolve: {
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname
        }
    }
});
