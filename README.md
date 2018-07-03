# 门户后台项目(基于nodeJS+express)
npm install
# 开发
npm run dev
# 生产
npm run serve &
键盘输入 ctl+c

# 生产输入日志到当前目录下nohup.out
nohup npm run serve & 
#生产停止
ps -ef|grep node
找到 node ./bin/www 进程
kill -9 ID
#home访问
http://ip:port/dist/
# 管理端访问
http://ip:port/dist/#/admin
# 数据库配置
    ------ 根目录
      ---- pulic
        -- config
         - mysqlConfig.js