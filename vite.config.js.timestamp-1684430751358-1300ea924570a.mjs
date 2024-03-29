// vite.config.js
import { defineConfig } from "file:///C:/Users/Usuario/Desktop/HenryMusic/henry-music/node_modules/vite/dist/node/index.js";
import mkcert from "file:///C:/Users/Usuario/Desktop/HenryMusic/henry-music/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import react from "file:///C:/Users/Usuario/Desktop/HenryMusic/henry-music/node_modules/@vitejs/plugin-react/dist/index.mjs";
var mkcertConfig = {
  hosts: ["localhost", "127.0.0.1", "henrymusic.test", "henrymusic.local"],
  keyFileName: "henrymusic.local+5-key.pem",
  certFileName: "henrymusic.local+5.pem"
};
var vite_config_default = defineConfig({
  plugins: [react(), mkcert(mkcertConfig)],
  server: { https: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc3VhcmlvXFxcXERlc2t0b3BcXFxcSGVucnlNdXNpY1xcXFxoZW5yeS1tdXNpY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXN1YXJpb1xcXFxEZXNrdG9wXFxcXEhlbnJ5TXVzaWNcXFxcaGVucnktbXVzaWNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzdWFyaW8vRGVza3RvcC9IZW5yeU11c2ljL2hlbnJ5LW11c2ljL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IG1rY2VydCBmcm9tJ3ZpdGUtcGx1Z2luLW1rY2VydCdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5cclxuY29uc3QgbWtjZXJ0Q29uZmlnID0ge1xyXG4gIGhvc3RzOiBbJ2xvY2FsaG9zdCcsICcxMjcuMC4wLjEnLCAnaGVucnltdXNpYy50ZXN0JywgJ2hlbnJ5bXVzaWMubG9jYWwnXSxcclxuICBrZXlGaWxlTmFtZTogJ2hlbnJ5bXVzaWMubG9jYWwrNS1rZXkucGVtJyxcclxuICBjZXJ0RmlsZU5hbWU6ICdoZW5yeW11c2ljLmxvY2FsKzUucGVtJ1xyXG59XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIG1rY2VydChta2NlcnRDb25maWcpXSxcclxuICBzZXJ2ZXI6IHsgaHR0cHM6IHRydWUgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVSxTQUFTLG9CQUFvQjtBQUN4VyxPQUFPLFlBQVc7QUFDbEIsT0FBTyxXQUFXO0FBRWxCLElBQU0sZUFBZTtBQUFBLEVBQ25CLE9BQU8sQ0FBQyxhQUFhLGFBQWEsbUJBQW1CLGtCQUFrQjtBQUFBLEVBQ3ZFLGFBQWE7QUFBQSxFQUNiLGNBQWM7QUFDaEI7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sWUFBWSxDQUFDO0FBQUEsRUFDdkMsUUFBUSxFQUFFLE9BQU8sS0FBSztBQUN4QixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
