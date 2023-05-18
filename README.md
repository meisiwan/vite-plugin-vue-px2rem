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
