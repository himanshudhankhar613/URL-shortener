// src/services/urlService.js
const STORAGE_KEY = "shortened_links";

export function getAllLinks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function upsertLink(link) {
  const links = getAllLinks();
  const updated = [...links.filter(l => l.shortcode !== link.shortcode), link];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function shortcodeExists(code) {
  const links = getAllLinks();
  return links.some(link => link.shortcode === code);
}

export function generateShortcode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  } while (shortcodeExists(code));
  return code;
}
