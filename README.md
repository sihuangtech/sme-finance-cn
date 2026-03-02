# SME Finance CN

小微企业和个体工商户财务记账报税软件（Web + Electron 桌面版）。

## 技术栈

- 前端: React + Ant Design + Recharts
- 后端: Node.js + Express + Sequelize + PostgreSQL
- 桌面: Electron + SQLite (离线支持)
- 部署: Docker + docker-compose

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动共享库

```bash
npm run build --workspace=@sme-finance/shared
```

### 3. 启动后端

```bash
cd backend
npm run dev
```

### 4. 启动前端

```bash
cd frontend
npm run dev
```

### 5. 启动桌面端 (Electron)

```bash
cd electron
npm start
```

## Docker 部署

```bash
docker-compose up -d
```

访问 `http://localhost` 即可使用。

## 功能列表

- [x] 用户注册/登录 (JWT)
- [x] 多账套管理
- [x] 收支记账 (覆盖中国常见科目)
- [x] 发票管理 (扫码识别/到期提醒)
- [x] 税务计算 (增值税、附加税、个税、企业所得税)
- [x] 工资管理 (个税计算/工资条)
- [x] 财务报表 (资产负债表、利润表)
- [x] 离线同步 (Electron)
