# TerraPulse AI

TerraPulse คือแพลตฟอร์มต้นแบบสำหรับวิเคราะห์และติดตามระบบนิเวศป่าชายเลนและ Blue Carbon  
โดยผสานแดชบอร์ดเชิงภาพ, เวิร์กโฟลว์ AI และโครงสร้าง Backend ที่พร้อมต่อยอดสู่ระบบจริง

## เดโมออนไลน์

- GitHub Pages: `https://ffirst2551.github.io/TerraPulseAI/`

## ฟีเจอร์หลัก

1. `Interactive 2D Eco-Map` แผนที่ 2 มิติแบบคลิกแต่ละโซน (sector) ได้
2. `Dynamic Sector Dashboard` แสดงค่า Health, Biomass และ Species ตามโซนที่เลือก
3. `Adaptive Biomass Analysis` กราฟวิเคราะห์ที่เล่น/หยุดและสลับตัวชี้วัดได้
4. `Multimodal AI Scanner` รองรับทั้งโหมดภาพดาวเทียมและโหมด Bio-Acoustics
5. `ResNet Pipeline UI` แสดงลำดับขั้นตอนการสแกนแบบมีแอนิเมชัน
6. `Bio-Acoustics Telemetry` แสดงสัญญาณเชิงเสียงและดัชนีที่เกี่ยวข้อง
7. `Polygon Verification Framework (Mock)` แนวคิดความโปร่งใสของข้อมูล

## เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend

- `Vanilla HTML5`
- `React 18` (โหลดผ่าน CDN แบบ UMD)
- `Babel Standalone`
- `Tailwind CSS` (CDN)
- `Lucide React` Icons
- `PWA เบื้องต้น` (`manifest.json`, `sw.js`)

### Backend (Scaffold)

- `Node.js 20+`
- `Fastify`
- `Prisma` + `PostgreSQL schema`
- `BullMQ` + `Redis`
- `Socket.IO` (Realtime)
- `JWT Authentication`

## สถานะการพัฒนาปัจจุบัน

- Dashboard และ Scanner ฝั่ง Frontend: `พร้อมเดโม`
- Backend API โครงหลัก: `พร้อมใช้งานระดับต้นแบบ`
- โมเดลจริง ResNet/AST: `ยังไม่เชื่อม inference จริง (จำลอง flow)`
- Polygon on-chain: `ยังเป็น mock`
- Web Audio รับไมค์สดแบบ production: `ยังไม่เปิดใช้งานจริง`

## โครงสร้างโปรเจกต์

```text
.
|-- index.html
|-- manifest.json
|-- sw.js
|-- .github/workflows/deploy-pages.yml
|-- backend/
|   |-- src/
|   |-- prisma/
|   |-- .env.example
|   `-- README.md
`-- samples/
```

## วิธีเริ่มใช้งาน (Frontend)

1. เปิดไฟล์ `index.html` ผ่านเบราว์เซอร์ได้ทันที  
2. หากต้องการแชร์ในวงแลน ให้ดู `scripts/share-lan.ps1` และ `SHARE.md`

## วิธีเริ่มใช้งาน (Backend)

1. เข้าโฟลเดอร์ backend
```bash
cd backend
```
2. ติดตั้ง dependencies
```bash
npm install
```
3. สร้างไฟล์ env จากตัวอย่าง
```bash
cp .env.example .env
```
4. รัน API
```bash
npm run dev
```

รายละเอียดเชิงลึกดูที่:
- `backend/README.md`

## การ Deploy

### Frontend (GitHub Pages)

- ใช้ workflow: `.github/workflows/deploy-pages.yml`
- ในหน้า Repository Settings > Pages ให้เลือก Source เป็น `GitHub Actions`

### Backend

- โปรเจกต์นี้ยังไม่ได้ deploy backend อัตโนมัติ
- สามารถ deploy แยกบน Render, Railway, Fly.io, VM หรือ Kubernetes

## API หลักของ Backend

- `GET /health`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /projects/:id/sectors`
- `GET /dashboard/:projectId`
- `POST /scans`
- `GET /scans/:id/status`
- `POST /verification/hash`
- `GET /verification/:id`

## หมายเหตุ

- โค้ดชุดนี้ถูกออกแบบให้เดโมได้เร็วและโชว์แนวคิดครบ
- หากขึ้น production ควรย้ายการจัดการ API keys ไป backend ทั้งหมด
- ควรเพิ่ม observability, secrets management และ policy ด้านสิทธิ์ผู้ใช้ให้ครบ

---

พัฒนาสำหรับ SPU GreenTech Gen Z Challenge 2026
