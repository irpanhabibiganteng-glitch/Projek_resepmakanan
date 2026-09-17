# Backend API

Struktur project dibuat dengan pola modular agar mudah dikembangkan.

## Struktur utama

- src/app.ts : konfigurasi aplikasi Express
- src/index.ts : entry point server
- src/routes : routing endpoint
- src/controllers : logic handler request
- src/config : konfigurasi umum seperti database
- src/types : definisi type TypeScript

## Jalankan server

```bash
npm install
npx ts-node src/index.ts
```

atau pakai nodemon:

```bash
npx nodemon --watch src --exec ts-node src/index.ts
```
