# OPAS REST API Endpoints

## Authentication
- `POST /api/auth/login` - Login user and return JWT token
- `POST /api/auth/register` - Register new user (Admin specific or Self-registration if applicable)

## User Management (Admin)
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Student Dashboard
- `GET /api/student/dashboard/{studentId}` - Get comprehensive dashboard stats (Attendance, CGPA, Leave Status)

## Attendance
- `POST /api/attendance/mark` - Mark attendance (Faculty)
- `GET /api/attendance/student/{studentId}` - Get attendance history
- `GET /api/attendance/report` - Get class-wise attendance report

## Leave & On-Duty
- `POST /api/leave/request` - Submit leave/OD request
- `GET /api/leave/student/{studentId}` - Get request history
- `GET /api/leave/pending` - Get pending approvals for Approver (Mentor/Parent/Warden/HOD)
- `PUT /api/leave/approve/{requestId}` - Approve/Reject request

## Academic Records
- `POST /api/academic/record` - Add semester result (Admin/Faculty)
- `GET /api/academic/student/{studentId}` - Get academic history

## Company Participation
- `POST /api/company/participation` - Add participation record
- `GET /api/company/student/{studentId}` - Get participation history
