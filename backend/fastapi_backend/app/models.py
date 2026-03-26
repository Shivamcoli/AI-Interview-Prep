from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlmodel import Field, SQLModel


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    password_hash: str
    profileImageUrl: str = Field(default="")

    createdAt: datetime = Field(default_factory=now_utc)
    updatedAt: datetime = Field(default_factory=now_utc)


class SessionModel(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    role: str
    experience: str
    topicsToFocus: str
    description: str = Field(default="")

    createdAt: datetime = Field(default_factory=now_utc)
    updatedAt: datetime = Field(default_factory=now_utc)


class Question(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    session_id: str = Field(index=True)
    question: str
    answer: str
    isPinned: bool = Field(default=False, index=True)
    note: str = Field(default="")

    createdAt: datetime = Field(default_factory=now_utc)
    updatedAt: datetime = Field(default_factory=now_utc)


class UserPublic(SQLModel):
    _id: str
    name: str
    email: str
    profileImageUrl: str = ""


class AuthResponse(UserPublic):
    token: str


class RegisterRequest(SQLModel):
    name: str
    email: str
    password: str
    profileImageUrl: Optional[str] = ""


class LoginRequest(SQLModel):
    email: str
    password: str


class GenerateQuestionsRequest(SQLModel):
    role: str
    experience: str
    topicsToFocus: str
    numberOfQuestions: int


class GenerateExplanationRequest(SQLModel):
    question: str


class CreateSessionRequest(SQLModel):
    role: str
    experience: str
    topicsToFocus: str
    description: Optional[str] = ""
    questions: list[dict]


class AddQuestionsRequest(SQLModel):
    sessionId: str
    questions: list[dict]


class UpdateNoteRequest(SQLModel):
    note: Optional[str] = ""

