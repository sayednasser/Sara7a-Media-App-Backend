# 🚀 Sara7a Media App Backend

Backend API for the Sara7a Media App built with Node.js, Express.js, MongoDB, Redis, Cloudinary, and JWT Authentication.

---

# ✨ Features

## 🔐 Authentication & Security

* Register & Login System
* JWT Authentication
* Refresh Token Support
* OTP Email Verification
* Forgot Password & Reset Password
* Logout From Current Device / All Devices
* Password Hashing
* Token Revocation

## 💌 Anonymous Messaging System

* Send anonymous messages
* Send text messages or media attachments
* Favorite messages ⭐
* Hide / Unhide messages 🙈
* Public & Private messages
* Delete messages

## 🖼️ Media Uploads

* Upload profile image
* Upload cover image
* Upload message attachments
* Cloudinary integration

## ⚙️ User Features

* Edit profile information
* Public profile sharing
* Enable / Disable receiving messages
* Bio support

## 🛡️ Backend Features

* RESTful API
* Joi Validation
* Error Handling Middleware
* Authentication Middleware
* File Upload Middleware
* Redis Integration
* MongoDB Database
* Clean Modular Architecture

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Joi
* Multer
* Cloudinary
* Redis
* Bcrypt

---

# 📂 Project Structure

```bash
src/
│
├── common/
├── DB/
├── middleware/
├── module/
│   ├── auth/
│   ├── user/
│   ├── message/
│
└── app.controller.js
```

---

# ⚡ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sayednasser/Sara7a-Media-App-Backend.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create Environment Variables

Create `.env` file:

```env
PORT=5000
DB_URL=your_mongodb_url
TOKEN_SIGNATURE=your_secret
REFRESH_TOKEN_SIGNATURE=your_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_secret
REDIS_URL=your_redis_url
EMAIL=your_email
PASSWORD=your_email_password
```

---

# ▶️ Run Server

## Development Mode

```bash
npm run start:dev
```

## Production Mode

```bash
npm run start:prod

---


# 🌍 Deployment

* Railway
* MongoDB Atlas
* Cloudinary
* Upstash Redis
* google oauth

---

# 🔐 Environment Variables

| Variable                | Description            |
| ----------------------- | ---------------------- |
| PORT                    | Server Port            |
| DB_URL                  | MongoDB Connection URL |
| TOKEN_SIGNATURE         | Access Token Secret    |
| REFRESH_TOKEN_SIGNATURE | Refresh Token Secret   |
| CLOUD_NAME              | Cloudinary Cloud Name  |
| API_KEY                 | Cloudinary API Key     |
| API_SECRET              | Cloudinary API Secret  |
| REDIS_URL               | Redis Database URL     |
| EMAIL                   | SMTP Email             |
| PASSWORD                | SMTP Password          |

---

# 📡 API Features

## Authentication

* Register
* Login
* Refresh Token
* Verify Email
* Verify OTP
* Resend OTP
* Confirm Email
* Forgot Password
* Reset Password
* Logout

## User

* Update Profile
* Upload Profile Image
* Upload Cover Image
* Share Public Profile
* Toggle Messages

## Messages

* Send Anonymous Message
* Upload Attachments
* Favorite Message
* Hide Message
* Delete Message
* Public / Private Message

---

# 👨‍💻 Author

## Sayed Nasser

* GitHub: [https://github.com/sayednasser](https://github.com/sayednasser/Sara7a-Media-App-Backend.git)

---

# ⭐ Support

If you like this project:

* Give it a star ⭐
* Fork the repository 🍴
* Share it 🚀

---

# 📜 License

This project is licensed under the MIT License.
