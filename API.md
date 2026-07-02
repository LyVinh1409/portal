# CMS Backend API Documentation

## Overview
Full-stack CMS Backend API with authentication, media management, user management, news publishing, and content management features.

**Base URL:** `http://localhost:8080/api`

**API Documentation:** `http://localhost:8080/swagger/index.html` (after running `swag init`)

## Authentication
- JWT-based authentication
- Protected routes require `Authorization: Bearer <token>` header
- Tokens valid for 24 hours
- Refresh tokens stored in Redis

## Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | - | Register new user |
| POST | `/auth/login` | - | User login |
| POST | `/auth/refresh` | - | Refresh tokens |
| POST | `/auth/logout` | ✓ | User logout |
| GET | `/me` | ✓ | Get current user |

### News (`/api/news`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/news` | - | List published news (public) |
| GET | `/news/:id` | - | Get news detail (public) |
| GET | `/news` | ✓ | List all news (admin) |
| POST | `/news` | ✓ | Create news |
| GET | `/news/:id` | ✓ | Get news by ID (admin) |
| PUT | `/news/:id` | ✓ | Update news |
| DELETE | `/news/:id` | ✓ | Delete news |
| POST | `/news/:id/comments` | - | Add comment to news |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | ✓ | List users |
| POST | `/users` | ✓ | Create user |
| GET | `/users/:id` | ✓ | Get user by ID |
| PUT | `/users/:id` | ✓ | Update user |
| DELETE | `/users/:id` | ✓ | Delete user |

### Categories (`/api/categories`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | ✓ | List categories (tree) |
| POST | `/categories` | ✓ | Create category |
| PUT | `/categories/:id` | ✓ | Update category |
| DELETE | `/categories/:id` | ✓ | Delete category |

### Banners (`/api/banners`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/banners` | - | List active banners (public) |
| GET | `/banners` | ✓ | List all banners (admin) |
| POST | `/banners` | ✓ | Create banner |
| PUT | `/banners/:id` | ✓ | Update banner |
| DELETE | `/banners/:id` | ✓ | Delete banner |

### Media (`/api/media`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/media/list` | - | List media by folder (public) |
| GET | `/media` | ✓ | List media (admin) |
| POST | `/media/upload` | ✓ | Upload media file |
| GET | `/media/:id` | ✓ | Get media by ID |
| DELETE | `/media/:id` | ✓ | Delete media |
| GET | `/media/folders` | ✓ | List media folders |

### Roles & Permissions (`/api`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/roles` | ✓ | List roles |
| POST | `/roles` | ✓ | Create role |
| PUT | `/roles/:id` | ✓ | Update role |
| DELETE | `/roles/:id` | ✓ | Delete role |
| GET | `/permissions` | ✓ | List permissions |
| POST | `/permissions` | ✓ | Create permission |
| POST | `/roles/:id/permissions` | ✓ | Assign permission to role |
| DELETE | `/roles/:id/permissions/:pid` | ✓ | Revoke permission from role |

### Dashboard (`/api`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/stats` | ✓ | Get statistics |
| GET | `/dashboard/recent` | ✓ | Get recent activity |

## Request/Response Examples

### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123"
}
Response: 201 Created
{
  "id": 1,
  "email": "user@example.com"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "refresh_token_value",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Create News
```json
POST /api/news
Authorization: Bearer <token>
{
  "title": "News Title",
  "slug": "news-title",
  "excerpt": "Short excerpt",
  "body": "Full content...",
  "seo_title": "SEO Title",
  "seo_description": "SEO Description",
  "featured_key": "media/featured.jpg",
  "tag_ids": [1, 2],
  "published_at": "2026-07-02T10:00:00Z"
}
Response: 201 Created
{
  "data": {
    "id": 1,
    "title": "News Title",
    ...
  }
}
```

### Upload Media
```
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary file>
folder: album
Response: 200 OK
{
  "data": {
    "id": 1,
    "key": "media/1234567890_file.jpg",
    "folder": "album",
    "url": "http://minio:9000/bucket/media/1234567890_file.jpg"
  }
}
```

## Validation

Request validation using `go-playground/validator`:
- Email format validation
- Required fields
- Max length constraints
- Custom validations

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "error_type",
  "details": "error details"
}
```

Common HTTP Status Codes:
- 200 OK - Success
- 201 Created - Resource created
- 204 No Content - Success (no body)
- 400 Bad Request - Validation error
- 401 Unauthorized - Auth required
- 403 Forbidden - Permission denied
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

## Security
- JWT tokens for authentication
- Refresh tokens stored securely in Redis
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected endpoints require valid JWT

## Rate Limiting
Currently not implemented. Consider adding for production.

## CORS
Configured for cross-origin requests from frontend domain.

## To Generate Swagger Docs
```bash
# Install swag CLI (if not installed)
go install github.com/swaggo/swag/cmd/swag@latest

# Generate docs from annotations
cd backend
swag init
```

The generated OpenAPI spec will be available at `/swagger/index.html` (Swagger UI).
