前端后台打包 在vue.config.js文件中配置了一下输出目录，打包时注意：

   测试环境打包：src/api目录下的 login.js 文件和 manage.js文件中的 baseUrl 切换到测试环境，
   vue.config.js 文件中的outputDir属性改成 "测试环境-dist"  ，即： outputDir:"测试环境-dist"     
   
   生产环境打包：src/api目录下的 login.js 文件和 manage.js文件中的 baseUrl 切换到生产环境，
   vue.config.js 文件中的outputDir属性改成 "生产环境-dist"  ，即： outputDir:"生产环境-dist"   