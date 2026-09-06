"use client";

const KEY = "mora.visitor-id";

export function getVisitorId(): string {
  const existing = window.localStorage.getItem(KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(KEY, id);
  return id;
}
