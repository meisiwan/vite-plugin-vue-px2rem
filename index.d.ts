import {  Plugin } from 'vite';


interface Options {
    size?: number;
    expand?: string[];
    pcMobile?: boolean;
}

declare function vuePlugin(rawOptions?: Options): Plugin;
declare function _px2rem(size: Options['size']): void;

export { vuePlugin as default, _px2rem };
