import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: {
                    ko: 'E-H 자동 토렌트'
                },
                namespace: 'eh_autotorrent/script',
                match: ['https://e-hentai.org/gallerytorrents.php?*', 'https://exhentai.org/gallerytorrents.php?*'],
            },
        }),
    ],
});