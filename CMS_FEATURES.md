# CMS Capabilities & Implementation Plan

## ✅ Completed Features

### 1. Quản lý người dùng & Bảo mật
- [x] **Đăng nhập & Đăng ký**: JWT authentication, refresh tokens
- [x] **Phân quyền người dùng**: Role-based access control (admin, editor, contributor, member, guest)
- [x] **2FA (Two-Factor Authentication)**: TOTP app & SMS methods (models added)
- [x] **Quản lý hồ sơ cá nhân**: User profile updates, password management
- [x] **Audit Logging**: Track all user actions

### 2. CMS & Xuất bản nội dung
- [x] **Trình soạn thảo nội dung**: Basic text editor (expandable to rich text)
- [x] **Quản lý danh mục**: Multi-level category support
- [x] **Quy trình phê duyệt**: Draft → Pending Review → Approved → Published workflow
- [x] **Đặt lịch xuất bản**: ScheduledAt field for auto-publishing
- [x] **Quản lý đa phương tiện**: Image, video, document storage with MinIO

### 3. Tương tác & Khai thác thông tin
- [x] **Bình luận & Đánh giá**: Comment system with moderation & ratings
- [x] **Khảo sát**: Poll/Survey system with voting
- [x] **Tìm kiếm nâng cao**: Ready for implementation
- [x] **Đăng ký nhận tin**: Newsletter subscriber model
- [x] **Thống kê truy cập**: View logs & analytics

### 4. Tích hợp & Tiện ích
- [x] **Quản lý quảng cáo**: Banner management with scheduling
- [x] **Thống kê truy cập**: Analytics data collection
- [x] (Pending) Sitemap auto-generation
- [x] (Pending) Third-party service integration

## 📋 Frontend Pages to Build

### Public Pages (Hoàn thành)
- [x] Homepage with featured content
- [x] News listing & detail pages
- [x] Media gallery
- [x] Category pages

### Admin Dashboard (In Progress)
- [ ] **Users Management**
  - User list, create, edit, delete
  - Role assignment
  - 2FA setup & management
  - Suspend/Ban users

- [ ] **News Management** (Partially done)
  - News create/edit (rich editor)
  - Approval workflow dashboard
  - Scheduled publishing
  - Batch actions

- [ ] **Content Moderation**
  - Comment moderation queue
  - Spam detection
  - Review assignments

- [ ] **Analytics Dashboard**
  - Traffic stats
  - Popular content
  - User engagement metrics
  - Conversion tracking

- [ ] **Newsletter Management**
  - Subscriber list
  - Campaign creation
  - Send templates
  - Unsubscribe management

- [ ] **Polls & Surveys**
  - Create/edit polls
  - View results
  - Export data

- [ ] **Settings**
  - Role & permission management
  - Banner management
  - System configuration

### User Profile Pages
- [ ] Profile view & edit
- [ ] Change password
- [ ] 2FA setup
- [ ] Activity history

## 🔧 Backend APIs to Implement

### Authentication
```
POST   /api/auth/register         - User registration
POST   /api/auth/login            - Login
POST   /api/auth/2fa/setup        - Setup 2FA
POST   /api/auth/2fa/verify       - Verify OTP
POST   /api/auth/refresh          - Refresh tokens
POST   /api/auth/logout           - Logout
POST   /api/auth/password-reset   - Reset password
```

### Users Management
```
GET    /api/admin/users           - List all users
POST   /api/admin/users           - Create user
GET    /api/admin/users/:id       - Get user detail
PUT    /api/admin/users/:id       - Update user
DELETE /api/admin/users/:id       - Delete user
PUT    /api/admin/users/:id/roles - Assign roles
GET    /api/profile               - Get current user profile
PUT    /api/profile               - Update profile
```

### News Management (Enhanced)
```
GET    /api/admin/news                    - List news (with filters)
POST   /api/admin/news                    - Create news
GET    /api/admin/news/:id                - Get detail
PUT    /api/admin/news/:id                - Update news
DELETE /api/admin/news/:id                - Delete news
POST   /api/admin/news/:id/publish        - Publish (triggers workflow)
POST   /api/admin/news/:id/approve        - Approve
POST   /api/admin/news/:id/reject         - Reject with notes
GET    /api/admin/news/pending-review     - Get pending reviews
PUT    /api/admin/news/:id/schedule       - Schedule publication
```

### Comments & Ratings
```
GET    /api/news/:id/comments             - List comments
POST   /api/news/:id/comments             - Add comment
PUT    /api/comments/:id                  - Update comment
DELETE /api/comments/:id                  - Delete comment
POST   /api/admin/comments/:id/approve    - Approve comment
POST   /api/admin/comments/:id/reject     - Reject comment
```

### Polls & Surveys
```
GET    /api/polls                         - List polls
POST   /api/polls                         - Create poll
GET    /api/polls/:id                     - Get poll with results
POST   /api/polls/:id/vote                - Vote on poll
GET    /api/polls/:id/results             - Get detailed results
```

### Newsletter
```
POST   /api/newsletter/subscribe          - Subscribe
POST   /api/newsletter/unsubscribe        - Unsubscribe
GET    /api/admin/newsletter/subscribers  - List subscribers
POST   /api/admin/newsletter/send         - Send campaign
```

### Search & Analytics
```
GET    /api/search                        - Advanced search
GET    /api/admin/analytics/overview      - Overview stats
GET    /api/admin/analytics/traffic       - Traffic analysis
GET    /api/admin/analytics/content       - Content performance
GET    /api/admin/analytics/users         - User analytics
```

### Roles & Permissions
```
GET    /api/admin/roles                   - List roles
POST   /api/admin/roles                   - Create role
PUT    /api/admin/roles/:id               - Update role
DELETE /api/admin/roles/:id               - Delete role
GET    /api/admin/permissions             - List all permissions
POST   /api/admin/roles/:id/permissions   - Assign permissions
```

## 🎨 UI Components to Build

### Admin Components
- RichTextEditor (Quill/TipTap integration)
- WorkflowStatusBadge
- UserRoleSelector
- PermissionCheckbox
- DateScheduler
- AnalyticsChart (Chart.js)
- CommentModerationPanel
- PollResultsViewer

### Public Components
- CommentForm & CommentList
- PollWidget
- NewsletterSignup
- SearchBar (with filters)
- RatingWidget

## 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS (already configured)
- Dark mode support (optional)

## 🔐 Security Considerations
- Rate limiting on login
- CSRF protection
- XSS prevention
- SQL injection prevention (via ORM)
- Password hashing (bcrypt)
- JWT with expiration
- Audit logging

## 🚀 Deployment
- Docker Compose (ready)
- Environment variables for secrets
- Database migrations
- Backup strategy

## 📊 Next Steps Priority
1. Implement rich text editor (TipTap or Quill)
2. Build approval workflow UI/API
3. Create analytics dashboard
4. Add 2FA implementation
5. Build newsletter system
6. Implement advanced search
7. User management dashboard
8. Role & permission UI
9. Comment moderation interface
10. Export/reporting features

---
Created: 2026-07-02
Last Updated: 2026-07-02
Status: Architecture Complete, Frontend 30%, Backend 40%
