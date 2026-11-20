# NestJS Template — Deploy to Render

A minimal **NestJS** backend with **no database**. Items are kept in memory and reset when the server restarts.
Configuration comes from **environment variables** (`.env` locally, the Render dashboard in production).

Part of the *Intro to DevOps* course. Sister projects with the same API:
[FastAPI](https://github.com/Abdalaziz-Tello/fastapi_example_to_mock_piplines) ·
[Laravel](https://github.com/Abdalaziz-Tello/laravel_template_for_piplines_session)

## Requirements

- Node.js **24** (see `.nvmrc`, run `nvm use` if you have nvm)

## Run locally

```bash
npm install
cp .env.example .env      # then edit the values if you like
npm run start:dev         # dev mode with auto-reload
```

Open:

- **API:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/docs
- **OpenAPI schema:** http://localhost:3000/openapi.json

## Endpoints

| Method | Path          | Description                                  |
|--------|---------------|----------------------------------------------|
| GET    | `/`           | Welcome message (from `WELCOME_MESSAGE`)     |
| GET    | `/health`     | Health check                                 |
| GET    | `/config`     | Shows the config the server loaded (no secrets) |
| GET    | `/items`      | List items                                   |
| GET    | `/items/{id}` | Get one item                                 |
| POST   | `/items`      | Create an item                               |
| PATCH  | `/items/{id}` | Partially update                             |
| DELETE | `/items/{id}` | Delete an item                               |

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Book", "price": 12.5}'
```

## Environment variables

| Variable          | Example              | Notes                                         |
|-------------------|----------------------|-----------------------------------------------|
| `PORT`            | `3000`               | **Render sets this automatically**, don't add it there |
| `APP_NAME`        | `NestJS Template`    | Shown in `/config` and Swagger title          |
| `APP_ENV`         | `production`         | `development` locally                         |
| `APP_VERSION`     | `0.1.0`              |                                               |
| `WELCOME_MESSAGE` | `Hello from Render!` | Returned by `GET /`                           |
| `API_SECRET`      | `some-long-random-string` | A secret. Only reported as `api_secret_configured: true/false` |

Real environment variables always win over values in `.env`.
**Never commit `.env`**, only `.env.example`.

## Test & build

```bash
npm test            # unit tests
npm run test:e2e    # API tests
npm run lint
npm run build       # compiles to dist/
npm run start:prod  # runs dist/main.js
```

## Deploy to Render

1. Push this repo to **your own public GitHub repo**.
2. On [render.com](https://render.com) → **New → Web Service** → connect the repo.
3. Settings:

   | Field             | Value                       |
   |-------------------|-----------------------------|
   | Language          | Node                        |
   | Build Command     | `npm ci && npm run build`   |
   | Start Command     | `npm run start:prod`        |
   | Instance Type     | Free                        |
   | Health Check Path | `/health`  (Advanced)       |

4. **Environment** → add `APP_NAME`, `APP_ENV=production`, `APP_VERSION`, `WELCOME_MESSAGE`, `API_SECRET`.
5. **Deploy** and open `https://<your-service>.onrender.com/config` to check your values were picked up.

> Free instances sleep after ~15 min without traffic; the first request afterwards takes up to a minute.
> In-memory data is lost every time the instance restarts or redeploys. That's expected.
