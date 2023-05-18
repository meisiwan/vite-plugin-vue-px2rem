根据设计稿宽度 自动适配计算出rem（支持行内样式，css变量） 可以使用vant
```javascript
import px2rem from 'vite-plugin-vue-px2rem'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    px2rem({
        size: 375 //设计稿的宽度
    })],
})
```
