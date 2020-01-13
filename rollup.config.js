import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve"

export default {
    input: 'src/index.js',
    output: {
        name: 'Sortable',
        file: 'dist/livewire-sortable.js',
        format: 'umd',
        sourcemap: true,
    },
    plugins: [
        resolve(),
        filesize(),
        terser({
            compress: {
                drop_debugger: false,
            },
        }),
        babel({
            exclude: 'node_modules/**'
        })
    ]
}
