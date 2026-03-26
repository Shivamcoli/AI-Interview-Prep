# AI Interview Prep (React + FastAPI)

This workspace contains:

- `frontend/`: React (Vite) app
- `backend/fastapi_backend/`: FastAPI backend (replaces the older Express backend)

## Run backend (FastAPI)

```bash
cd "backend/fastapi_backend"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run frontend (React)

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Then:

```bash
cd "frontend"
npm install
npm run dev
```

