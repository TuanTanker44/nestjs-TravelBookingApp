# Travel Booking System

## Introduce

Một hệ thống **Travel Booking** được xây dựng theo kiến trúc **Microservices** sử dụng **NestJS** ở backend và **Next.js** ở frontend. Dự án cung cấp các chức năng cơ bản của một nền tảng đặt phòng khách sạn như:

- Đăng ký, đăng nhập bằng JWT Authentication.
- Quản lý thông tin người dùng.
- Tìm kiếm khách sạn theo từ khóa.
- Xem danh sách khách sạn và thông tin chi tiết.
- Hiển thị các điểm đến phổ biến.
- API Gateway làm điểm truy cập duy nhất cho client.
- Giao tiếp giữa các service thông qua HTTP.

---

## Architecture

```text

                               +---------------------------+
                               |     Next.js Frontend      |
                               |   (travel-booking-app-ui) |
                               +-------------+-------------+
                                             |
                                             | HTTP / JWT
                                             |
                                             v
                              +------------------------------+
                              |         API Gateway          |
                              | Authentication               |
                              | Authorization                |
                              | Request Routing              |
                              +------+-----------------------+
                                     |
        ------------------------------------------------------------------------
        |             |              |              |            |              |
        |             |              |              |            |              |
        v             v              v              v            v              v

+---------------+ +---------------+ +---------------+ +---------------+ +---------------+ +---------------+
| Auth Service  | | User Service  | | Hotel Service | |Search Service | |Booking Service| |Payment Service|
+-------+-------+ +-------+-------+ +-------+-------+ +-------+-------+ +-------+-------+ +-------+-------+
        |                 |                 |                 |                 |                 |
        |                 |                 |                 |                 |                 |
        ------------------------------------------------------------------------
                                     |
                                     |
                                     v
                           +-----------------------+
                           |    Shared Database    |
                           |        (MySQL)        |
                           +-----------------------+

                    +--------------------------------+
                    | Shared Library (libs/database) |
                    | Common TypeORM Configuration   |
                    +--------------------------------+
```

---

## Technology Stack

### Backend

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication
- Docker
- Docker Compose

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## Project Structure

```text
travel-booking-app/
├── 📁 apps
│   ├── 📁 api-gateway
│   │   ├── 📁 src
│   │   │   ├── 📁 auth
│   │   │   │   ├── 📄 auth.module.ts
│   │   │   │   ├── 📄 jwt.guard.ts
│   │   │   │   └── 📄 jwt.strategy.ts
│   │   │   ├── 📁 common
│   │   │   ├── 📁 config
│   │   │   │   ├── 📄 jwt.config.ts
│   │   │   │   ├── 📄 services-dev.config.ts
│   │   │   │   └── 📄 services.config.ts
│   │   │   ├── 📁 decorators
│   │   │   ├── 📁 proxy
│   │   │   ├── 📄 app.module.ts
│   │   │   └── 📄 main.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 auth-service
│   │   ├── 📁 src
│   │   │   ├── 📁 clients
│   │   │   │   └── 📄 user.client.ts
│   │   │   ├── 📁 dto
│   │   │   ├── 📁 entities
│   │   │   ├── 📁 enums
│   │   │   │   ├── 📄 user-role.enum.ts
│   │   │   │   └── 📄 user-status.enum.ts
│   │   │   ├── 📄 auth-service.module.ts
│   │   │   └── 📄 main.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 booking-service
│   │   ├── 📁 src
│   │   │   ├── 📁 booking
│   │   │   ├── 📁 booking-history
│   │   │   ├── 📁 booking_room
│   │   │   ├── 📁 payment-integration
│   │   │   ├── 📁 redis
│   │   │   ├── 📁 room_reservation
│   │   │   ├── 📄 app.module.ts
│   │   │   └── 📄 main.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 hotel-service
│   │   ├── 📁 src
│   │   │   ├── 📁 amenity
│   │   │   ├── 📁 hotel
│   │   │   ├── 📁 redis
│   │   │   ├── 📁 room
│   │   │   ├── 📁 room_amenity
│   │   │   ├── 📄 app.module.ts
│   │   │   └── 📄 main.ts
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 inventory-service
│   │   │   ├── 📄 app.module.ts
│   │   │   └── 📄 main.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 notification-service
│   │   ├── 📁 src
│   │   │   ├── 📄 main.ts
│   │   │   ├── 📄 notification-service.module.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 payment-service
│   │   ├── 📁 src
│   │   │   ├── 📁 dto
│   │   │   ├── 📁 entities
│   │   │   ├── 📁 enums
│   │   │   ├── 📁 redis
│   │   │   ├── 📄 main.ts
│   │   │   └── 📄 payment-service.module.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 review-service
│   │   ├── 📁 src
│   │   │   ├── 📄 main.ts
│   │   │   ├── 📄 review-service.module.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 search-service
│   │   ├── 📁 src
│   │   │   ├── 📁 dto
│   │   │   ├── 📁 entities
│   │   │   ├── 📁 enums
│   │   │   ├── 📁 redis
│   │   │   ├── 📄 main.ts
│   │   │   └── 📄 search-service.module.ts
│   │   ├── 📁 test
│   │   └── ⚙️ tsconfig.app.json
│   ├── 📁 travel-booking-app-ui
│   └── 📁 user-service
│       ├── 📁 src
│       │   ├── 📁 redis
│       │   ├── 📁 user
│       │   │   ├── 📁 dto
│       │   │   ├── 📁 enums
│       │   ├── 📄 app.module.ts
│       │   └── 📄 main.ts
│       ├── 📁 test
│       └── ⚙️ tsconfig.app.json
├── 📁 libs
│   └── 📁 database
│       ├── 📄 data-source.ts
│       ├── 📄 database.module.ts
│       └── 📄 index.ts
├── 📁 mysql
│   └── 📄 init.sql
├── ⚙️ .gitignore
├── 🐳 Dockerfile
├── ⚙️ docker-compose.yml
├── ⚙️ nest-cli.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json

```

---

## Requirements

Cần cài đặt trước:

- Node.js >= 20
- npm hoặc pnpm
- Docker
- Docker Compose
- MySQL (nếu không chạy bằng Docker)

---

## Environment Variables

Mỗi service cần có file `.env` phục vụ cho chạy local.

Ví dụ:

```.env
PORT=

DB_HOST=
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=travel_booking

JWT_SECRET=
```

---

## Installation

Clone project

```bash
git clone https://github.com/TuanTanker44/nestjs-TravelBookingApp

cd nestjs-TravelBookingApp-main
```

Cài đặt dependencies cho từng service

```bash
cd backend
npm install

cd apps/travel-booking-app-ui
npm install
```

---

## Running Locally

Mỗi service chạy trên một terminal riêng.

### API Gateway

```bash
cd backend
nest start api-gateway
```

### Auth Service

```bash
cd backend
nest start auth-service
```

### Hotel Service

```bash
cd backend
nest start hotel-service
```

### Search Service

```bash
cd backend
nest start search-service
```

### Front-end

```bash
cd backend/apps/travel-booking-app-ui
npm run dev
```

---

## Running with Docker

Build toàn bộ project

```bash
docker compose build
```

Khởi động các container

```bash
docker compose up
```

Hoặc chạy background

```bash
docker compose up -d
```

Dừng container

```bash
docker compose down
```

Build lại sau khi thay đổi source

```bash
docker compose up --build
```

---

## Available Services

| Service           | Default Port |
| ----------------- | -----------: |
| API Gateway       |         3000 |
| Auth Service      |         3001 |
| Booking Service   |         3003 |
| Hotel Service     |         3004 |
| Inventory Service |         3005 |
| Notifi Service    |         3006 |
| Payment Service   |         3007 |
| Search Service    |         3008 |
| User Service      |         3009 |
| Frontend          |         3010 |
| MySQL             |    3308:3306 |
| Redis             |         6379 |
| RabbitMQ          |        15672 |

---

## Future Improvements

- **API Gateway**
  - Thêm cache phía client để giảm số lượng request và cải thiện tốc độ phản hồi.

- **Search Service**
  - Bổ sung thông tin phân trang trong API:
    - `page`
    - `limit`
    - `total`
    - `totalPages`
