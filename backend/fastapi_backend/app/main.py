from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select

from .auth import create_access_token, get_current_user, hash_password, verify_password
from .db import get_session, init_db
from .models import (
    AddQuestionsRequest,
    CreateSessionRequest,
    GenerateExplanationRequest,
    GenerateQuestionsRequest,
    LoginRequest,
    Question,
    RegisterRequest,
    SessionModel,
    UpdateNoteRequest,
    User,
)


BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


app = FastAPI(title="Interview Prep AI (FastAPI)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    init_db()


app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


def _touch_updated(obj: Any) -> None:
    if hasattr(obj, "updatedAt"):
        obj.updatedAt = datetime.now(timezone.utc)


def _mongo_id_dict(model: Any) -> dict:
    d = model.model_dump() if hasattr(model, "model_dump") else dict(model)
    if "id" in d:
        d["_id"] = d.pop("id")
    return d


def _question_to_api(q: Question) -> dict:
    data = _mongo_id_dict(q)
    data["session"] = q.session_id
    data.pop("session_id", None)
    return data


def _session_to_api(session_row: SessionModel, questions: list[Question]) -> dict:
    data = _mongo_id_dict(session_row)
    data["user"] = session_row.user_id
    data.pop("user_id", None)
    data["questions"] = [_question_to_api(q) for q in questions]
    return data


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/api/auth/upload-image")
async def upload_image(request: Request, image: UploadFile = File(...)) -> dict:
    ext = Path(image.filename or "").suffix.lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
        raise HTTPException(status_code=400, detail={"message": "Unsupported file type"})

    filename = f"{uuid4()}{ext}"
    dest = UPLOAD_DIR / filename
    content = await image.read()
    dest.write_bytes(content)

    base_url = str(request.base_url).rstrip("/")
    return {"imageUrl": f"{base_url}/uploads/{filename}"}


@app.post("/api/auth/register")
def register(
    payload: RegisterRequest,
    session: Session = Depends(get_session),
) -> dict:
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail={"message": "User already exists"})

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        profileImageUrl=payload.profileImageUrl or "",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "_id": user.id,
        "name": user.name,
        "email": user.email,
        "profileImageUrl": user.profileImageUrl,
        "token": create_access_token(user.id),
    }


@app.post("/api/auth/login")
def login(payload: LoginRequest, session: Session = Depends(get_session)) -> dict:
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user:
        raise HTTPException(status_code=400, detail={"message": "This username does not exist"})

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail={"message": "Wrong Password"})

    return {
        "_id": user.id,
        "name": user.name,
        "email": user.email,
        "profileImageUrl": user.profileImageUrl,
        "token": create_access_token(user.id),
    }


@app.get("/api/auth/profile")
def profile(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "profileImageUrl": current_user.profileImageUrl,
    }


def _generate_questions(role: str, experience: str, topics: str, n: int) -> list[dict]:
    topics_list = [t.strip() for t in topics.split(",") if t.strip()]
    if not topics_list:
        topics_list = [topics.strip()] if topics.strip() else ["core concepts"]

    out: list[dict] = []
    for i in range(1, n + 1):
        topic = topics_list[(i - 1) % len(topics_list)]
        q = f"[{role}] ({experience}) Explain {topic}: key ideas, trade-offs, and a real-world example."
        a = (
            f"### Key ideas\n"
            f"- Define {topic} and why it matters for a {role}.\n"
            f"- Mention common patterns, pitfalls, and best practices.\n\n"
            f"### Trade-offs\n"
            f"- When to use it vs alternatives.\n\n"
            f"### Example\n"
            f"- Provide a small example scenario showing {topic} in practice."
        )
        out.append({"question": q, "answer": a})
    return out


@app.post("/api/ai/generate-questions")
def generate_questions(payload: GenerateQuestionsRequest) -> dict:
    if not payload.role or not payload.experience or not payload.topicsToFocus or not payload.numberOfQuestions:
        raise HTTPException(status_code=400, detail={"message": "Missing required fields"})

    data = _generate_questions(
        role=payload.role,
        experience=payload.experience,
        topics=payload.topicsToFocus,
        n=max(1, min(payload.numberOfQuestions, 50)),
    )
    return {"success": True, "data": data}


@app.post("/api/ai/generate-explanation")
def generate_explanation(payload: GenerateExplanationRequest) -> dict:
    if not payload.question:
        raise HTTPException(status_code=400, detail={"message": "Missing required field"})

    title = "Concept breakdown"
    explanation = (
        f"### What this question is testing\n"
        f"- Understanding of the concept and how you reason about trade-offs.\n\n"
        f"### How to answer\n"
        f"1. Restate the concept in your own words.\n"
        f"2. Give 2-3 key points.\n"
        f"3. Mention a trade-off.\n"
        f"4. Add a concrete example.\n\n"
        f"### The question\n"
        f"> {payload.question}"
    )
    return {"success": True, "data": {"title": title, "explanation": explanation}}


@app.post("/api/sessions/create")
def create_session(
    payload: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    session_row = SessionModel(
        user_id=current_user.id,
        role=payload.role,
        experience=payload.experience,
        topicsToFocus=payload.topicsToFocus,
        description=payload.description or "",
    )
    session.add(session_row)
    session.commit()
    session.refresh(session_row)

    created_questions: list[Question] = []
    for q in payload.questions:
        question_text = (q or {}).get("question")
        answer_text = (q or {}).get("answer")
        if not question_text or not answer_text:
            continue
        qr = Question(session_id=session_row.id, question=question_text, answer=answer_text)
        session.add(qr)
        created_questions.append(qr)
    _touch_updated(session_row)
    session.add(session_row)
    session.commit()

    # refresh questions
    qs = session.exec(select(Question).where(Question.session_id == session_row.id)).all()
    return {"success": True, "session": _session_to_api(session_row, qs)}


@app.get("/api/sessions/my-sessions")
def my_sessions(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    sessions = session.exec(
        select(SessionModel).where(SessionModel.user_id == current_user.id).order_by(SessionModel.createdAt.desc())
    ).all()

    out: list[dict] = []
    for s in sessions:
        qs = session.exec(select(Question).where(Question.session_id == s.id)).all()
        out.append(_session_to_api(s, qs))
    return out


@app.get("/api/sessions/{id}")
def get_session_by_id(
    id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    s = session.exec(select(SessionModel).where(SessionModel.id == id)).first()
    if not s or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail={"message": "Session not found"})

    qs = session.exec(
        select(Question)
        .where(Question.session_id == s.id)
        .order_by(Question.isPinned.desc(), Question.createdAt.asc())
    ).all()
    return {"success": True, "session": _session_to_api(s, qs)}


@app.delete("/api/sessions/{id}")
def delete_session(
    id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    s = session.exec(select(SessionModel).where(SessionModel.id == id)).first()
    if not s or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail={"message": "Session not found"})

    qs = session.exec(select(Question).where(Question.session_id == s.id)).all()
    for q in qs:
        session.delete(q)
    session.delete(s)
    session.commit()
    return {"message": "Session deleted successfully"}


@app.post("/api/questions/add")
def add_questions(
    payload: AddQuestionsRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    s = session.exec(select(SessionModel).where(SessionModel.id == payload.sessionId)).first()
    if not s or s.user_id != current_user.id:
        raise HTTPException(status_code=400, detail={"message": "Session not found."})

    created: list[Question] = []
    for q in payload.questions:
        question_text = (q or {}).get("question")
        answer_text = (q or {}).get("answer")
        if not question_text or not answer_text:
            continue
        qr = Question(session_id=s.id, question=question_text, answer=answer_text)
        session.add(qr)
        created.append(qr)

    _touch_updated(s)
    session.add(s)
    session.commit()
    return [_question_to_api(q) for q in created]


@app.post("/api/questions/{id}/pin")
def toggle_pin(
    id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    q = session.exec(select(Question).where(Question.id == id)).first()
    if not q:
        raise HTTPException(status_code=400, detail={"message": "Question not found"})

    s = session.exec(select(SessionModel).where(SessionModel.id == q.session_id)).first()
    if not s or s.user_id != current_user.id:
        raise HTTPException(status_code=401, detail={"message": "Not authorized"})

    q.isPinned = not q.isPinned
    _touch_updated(q)
    session.add(q)
    _touch_updated(s)
    session.add(s)
    session.commit()
    session.refresh(q)
    return {"success": True, "question": _question_to_api(q)}


@app.post("/api/questions/{id}/note")
def update_note(
    id: str,
    payload: UpdateNoteRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    q = session.exec(select(Question).where(Question.id == id)).first()
    if not q:
        raise HTTPException(status_code=400, detail={"message": "Question not found"})

    s = session.exec(select(SessionModel).where(SessionModel.id == q.session_id)).first()
    if not s or s.user_id != current_user.id:
        raise HTTPException(status_code=401, detail={"message": "Not authorized"})

    q.note = payload.note or ""
    _touch_updated(q)
    session.add(q)
    _touch_updated(s)
    session.add(s)
    session.commit()
    return {"success": True, "note": q.note}

