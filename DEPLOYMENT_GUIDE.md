# 🚀 CMS Platform - Hướng Dẫn Triển Khai Đầy Đủ

## 📊 Tổng Quan Hệ Thống

### Stack Công Nghệ
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Go + Gin Framework + GORM
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible)
- **Containerization**: Docker Compose

### URL Truy Cập
- **Website**: http://localhost:3000
- **API**: http://localhost:8080/api
- **API Docs**: http://localhost:8080/swagger
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)
- **Admin**: http://localhost:3000/admin

---

## 🔐 Nhóm Chức Năng 1: Quản Lý Người Dùng & Bảo Mật

### 1.1 Đăng Nhập & Đăng Ký (Hoàn Thành ✅)
```bash
# Đăng ký người dùng
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

# Đăng nhập
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
# Response:
{
  "access_token": "eyJ...",
  "refresh_token": "abc...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 1.2 Phân Quyền Người Dùng (Đã Thiết Kế ✅)
**Các Vai Trò (Roles):**
- **Admin**: Toàn quyền hệ thống
- **Editor**: Duyệt & xuất bản nội dung
- **Contributor**: Viết & gửi bài viết
- **Member**: Bình luận & tương tác
- **Guest**: Xem nội dung công khai

**Quyền (Permissions):**
- `news:create` - Tạo bài viết
- `news:edit` - Sửa bài viết
- `news:publish` - Xuất bản bài viết
- `users:manage` - Quản lý người dùng
- `roles:manage` - Quản lý vai trò
- `comments:moderate` - Duyệt bình luận

### 1.3 Xác Thực 2 Lớp (2FA) - Chuẩn Bị ✅
```bash
# Setup 2FA (TOTP)
POST /api/auth/2fa/setup
# Response: QR code + secret

# Verify OTP
POST /api/auth/2fa/verify
{
  "otp_code": "123456",
  "method": "app"  // app hoặc sms
}
```

### 1.4 Quản Lý Hồ Sơ Cá Nhân
```bash
# Xem thông tin cá nhân
GET /api/profile
Authorization: Bearer {token}

# Cập nhật hồ sơ
PUT /api/profile
{
  "full_name": "Nguyễn Văn A",
  "phone_number": "+84912345678",
  "avatar_url": "https://..."
}

# Đổi mật khẩu
POST /api/auth/change-password
{
  "old_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

---

## 📰 Nhóm Chức Năng 2: Quản Trị & Xuất Bản Nội Dung (CMS)

### 2.1 Trình Soạn Thảo Nội Dung (Hoàn Thành Cơ Bản ✅)
**Hiện Tại**: Text editor + Markdown
**Tương Lai**: Tích hợp TipTap hoặc Quill cho rich text

```typescript
// Dạng hiện tại
{
  "title": "Tiêu đề bài viết",
  "body": "Nội dung...",  // Plain text hoặc Markdown
  "featured_image_url": "https://...",
  "seo_title": "SEO Title",
  "seo_description": "SEO Description"
}
```

### 2.2 Quản Lý Danh Mục (Hoàn Thành ✅)
```bash
# Tạo danh mục
POST /api/admin/categories
{
  "name": "Thể Thao",
  "slug": "the-thao",
  "parent_id": null
}

# Danh mục con
{
  "name": "Bóng Đá",
  "slug": "bong-da",
  "parent_id": 1
}
```

### 2.3 Quy Trình Phê Duyệt (Approval Workflow) ✅
**Trạng Thái Bài Viết:**
```
draft → pending_review → approved → published
                   ↓
                rejected
```

```bash
# Tạo bài viết (Draft)
POST /api/admin/news
{
  "title": "Tiêu đề",
  "body": "Nội dung",
  "status": "draft"  // Tự động là draft
}

# Gửi để duyệt
PUT /api/admin/news/{id}
{
  "status": "pending_review"
}

# Editor duyệt
POST /api/admin/news/{id}/approve
{
  "notes": "Bài viết tốt"
}

# Hoặc từ chối
POST /api/admin/news/{id}/reject
{
  "notes": "Cần sửa lại phần..."
}

# Xuất bản (sau khi duyệt)
POST /api/admin/news/{id}/publish
```

### 2.4 Đặt Lịch Xuất Bản (Scheduling) ✅
```bash
# Xuất bản theo kế hoạch
POST /api/admin/news
{
  "title": "Tiêu đề",
  "body": "Nội dung",
  "scheduled_at": "2026-07-15T10:00:00Z",  # Đăng lúc 10:00 ngày 15/7
  "expires_at": "2026-07-22T23:59:59Z"    # Gỡ lúc 23:59 ngày 22/7
}
```

### 2.5 Quản Lý Đa Phương Tiện (Media Management) ✅
```bash
# Upload file
POST /api/media/upload
Content-Type: multipart/form-data
{
  "file": <binary>,
  "folder": "news-2026-07"
}

# Liệt kê media
GET /api/media/list?folder=news-2026-07&limit=20

# Xóa media
DELETE /api/media/{id}
```

---

## 🔍 Nhóm Chức Năng 3: Tương Tác & Khai Thác Thông Tin

### 3.1 Tìm Kiếm Nâng Cao (Advanced Search) 🚧
```bash
GET /api/search?q=keyword&category=123&author=456&date_from=2026-01-01&date_to=2026-12-31
```

### 3.2 Bình Luận & Đánh Giá ✅
```bash
# Thêm bình luận
POST /api/news/{id}/comments
{
  "author_name": "Nguyễn Văn A",
  "author_email": "user@example.com",
  "body": "Bài viết hay quá!",
  "rating": 5
}

# Danh sách bình luận (công khai)
GET /api/news/{id}/comments

# Duyệt bình luận (admin)
POST /api/admin/comments/{id}/approve
POST /api/admin/comments/{id}/reject
```

### 3.3 Khảo Sát & Thăm Dò (Polls/Surveys) ✅
```bash
# Tạo khảo sát
POST /api/admin/polls
{
  "title": "Tin tức nào bạn thích nhất?",
  "question": "Chọn chủ đề quan tâm",
  "options": [
    { "label": "Thể thao", "order": 1 },
    { "label": "Công nghệ", "order": 2 },
    { "label": "Giáo dục", "order": 3 }
  ]
}

# Bình chọn
POST /api/polls/{id}/vote
{
  "option_id": 1
}

# Xem kết quả
GET /api/polls/{id}/results
```

### 3.4 Đăng Ký Nhận Tin (Newsletter) ✅
```bash
# Đăng ký
POST /api/newsletter/subscribe
{
  "email": "user@example.com",
  "full_name": "Nguyễn Văn A"
}

# Hủy đăng ký
POST /api/newsletter/unsubscribe?token=abc123...
```

### 3.5 Hỗ Trợ Trực Tuyến 🚧
(Pending: Chatbot/Zalo/Messenger integration)

---

## 🔌 Nhóm Chức Năng 4: Tích Hợp & Tiện Ích

### 4.1 Quản Lý Quảng Cáo (Banner Management) ✅
```bash
# Tạo banner
POST /api/admin/banners
{
  "title": "Khuyến mãi tháng 7",
  "image_key": "banner-july.jpg",
  "image_url": "https://...",
  "link": "https://...",
  "position": "hero",
  "is_active": true,
  "start_at": "2026-07-01T00:00:00Z",
  "end_at": "2026-07-31T23:59:59Z"
}

# Vị trí banner: hero, sidebar, footer
```

### 4.2 Sitemap Tự Động 🚧
```bash
GET /sitemap.xml
# Tự động generate từ News, Categories
```

### 4.3 Thống Kê Truy Cập & Analytics ✅
```bash
# Overview
GET /api/admin/analytics/overview
{
  "stats": {
    "total_users": 150,
    "total_news": 245,
    "total_views": 15420,
    "active_users": 42
  }
}

# Traffic by date
GET /api/admin/analytics/traffic?date_from=2026-07-01&date_to=2026-07-31

# Content performance
GET /api/admin/analytics/content?limit=10

# User analytics
GET /api/admin/analytics/users
```

---

## 💻 Frontend Pages Hoàn Thành

### Public Pages ✅
- `GET /` - Homepage
- `GET /news` - News listing
- `GET /news/[id]` - News detail
- `GET /media` - Media gallery
- `GET /categories` - Category listing

### Admin Pages ✅
- `GET /admin` - Admin home
- `GET /admin/news` - News management
- `GET /admin/news/new` - Create news
- `GET /admin/news/[id]` - Edit news
- `GET /admin/users` - User management
- `GET /admin/dashboard` - Analytics dashboard

### Cần Phát Triển 🚧
- Admin users create/edit
- Role management UI
- Comment moderation panel
- Poll management
- Newsletter campaigns
- Banner management UI
- Analytics detailed pages
- 2FA setup UI
- Profile management

---

## 🛠️ Cách Sử Dụng

### 1. Khởi Động Hệ Thống
```bash
cd D:\Download\SourceCode\New\ project
docker compose up -d
```

### 2. Truy Cập
- Frontend: http://localhost:3000
- API: http://localhost:8080
- MinIO: http://localhost:9001

### 3. Đăng Nhập Admin
```
Email: admin@example.com
Password: Admin@123
```

### 4. Tạo Bài Viết
1. Vào `/admin/news/new`
2. Điền thông tin
3. Click "Đăng Bài" → Draft
4. Gửi duyệt → Status: pending_review
5. Editor duyệt → approved → published

### 5. Quản Lý Người Dùng
`/admin/users` - Xem, tạo, sửa, xóa, phân quyền

---

## 📝 Danh Sách Việc Cần Làm (Todo)

### Priority High 🔴
- [ ] Rich text editor (TipTap/Quill)
- [ ] 2FA implementation (TOTP + SMS)
- [ ] Approval workflow UI
- [ ] User management CRUD UI
- [ ] Analytics charts

### Priority Medium 🟡
- [ ] Comment moderation
- [ ] Advanced search
- [ ] Newsletter campaigns
- [ ] Polls management UI
- [ ] SEO sitemap

### Priority Low 🟢
- [ ] Dark mode
- [ ] Email notifications
- [ ] Social login (SSO)
- [ ] Chatbot integration
- [ ] Export/reporting

---

## 🚀 Deployment Options

### Local Development
```bash
docker compose up
```

### Production (AWS)
- ECS for containerized services
- RDS for PostgreSQL
- ElastiCache for Redis
- S3 instead of MinIO

### Production (VPS)
- Docker on VPS
- Nginx as reverse proxy
- Let's Encrypt for SSL
- Github Actions for CI/CD

---

## 📞 Support & Docs

- **API Documentation**: http://localhost:8080/swagger
- **Git Repository**: (để được cập nhật)
- **Issues**: Báo cáo lỗi trong Github

---

**Status**: MVP đang triển khai - 40% hoàn thành
**Ngày cập nhật**: 02/07/2026
