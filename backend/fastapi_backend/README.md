# FastAPI backend 

## Setup

From `backend/fastapi_backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API base URL (for the React app): `http://localhost:8000`

