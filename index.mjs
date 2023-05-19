const _px2rem = function (size) {
  var dpr, rem, scale;
  var docEl = document.documentElement;
  var fontEl = document.createElement('style');
  var metaEl = document.querySelector("meta[name='viewport']");
  if (!metaEl) {
    metaEl = document.createElement('meta');
    metaEl.name = 'viewport';
    docEl.firstElementChild.appendChild(metaEl);
  }

  dpr = window.devicePixelRatio || 1;
  rem = (docEl.clientWidth / size) * dpr;
  scale = 1 / dpr;

  //设置viewport,进行缩放，达到高清效果
  metaEl.setAttribute('content', `width=${dpr * docEl.clientWidth},initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},user-scalable=no,viewport-fit=cover`);

  fontEl.innerHTML = `:root{--dpr:${dpr}}html{font-size:${rem}px !important;}`;
  docEl.firstElementChild.appendChild(fontEl);

}



const plugin = function (options = {}) {
  const { size = 750, expand = [] } = options;
  //大小相关的css属性
  let names = [
    'width', 'height', 'margin', 'margin-left', 'margin-right', 'margin-bottom', 'margin-top',
    'padding', 'padding-top', 'padding-left', 'padding-bottom', 'padding-right', 'line-height',
    'left', 'right', 'bottom', 'top', 'max-height', 'min-height', 'text-indent', 'border-radius',
    'background-size', 'background-position', 'letter-spacing', 'grid-template', 'grid-template-columns', 
    'grid-template-rows', 'row-gap', 'gap', 'column-gap', 'grid'
  ].concat(expand)
  let useNames = names.map(name => '[^a-z\\-]' + name).join('|');
  const sizeReg = new RegExp(`(?<=${useNames}):(.+?)(?=;)`, 'g');
  //字体 边框
  let _names = ['font', 'font-size', 'border', 'border-left', 'border-top', 'border-right', 'border-bottom']
  _names = _names.map(name => '[^a-z\\-]' + name).join('|');
  const fontReg = new RegExp(`(?<=${_names}):\\s*?(\\d+)px`, 'g');
  //css变量
  const varReg = /(?<=--[\w\-]+?:)(.+?)px(?=;)/g;
  //行内样式不带分号 style="margin: 10px"
  const styleReg = new RegExp(`(?<=style="|')(.+?)(?<!;)(?="|')`, 'g');
  return {
    name: "vite-plugin-vue-px2rem",
    enforce: 'pre',
    transform(code, id) {
      if (/src\/main\.(ts|js)$/.test(id)) {
        return {
          code: `import {_px2rem} from 'vite-plugin-vue-px2rem'; _px2rem(${size}); ${code};`,
        };
      }
      if (/\.(css|vue)/.test(id)) {
        code = code.replace(fontReg, function (_$0, $1) {
          return `:calc(var(--dpr) * ${$1} * 1px)`;
        })
        code = code.replace(sizeReg, function (_$0, $1) {
          return ':' + $1.replace(/px/g, 'rem');
        });
        code = code.replace(varReg, function (_$0, $1) {
          return  $1 + 'rem';
        });
        code =  code.replace(styleReg, function (_$0, $1) {
          const reg = new RegExp(`(?<=${names.join('|')}):([^;]+?)$`);
          return $1.replace(reg, function(_$0, $1){
            return ':' + $1.replace(/px/g, 'rem');
          });
        })
        return {
          code: code
        }
      }
    },
  }
}


export {
  plugin as default,
  _px2rem
}