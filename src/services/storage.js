const LINKS_KEY = 'url_shortener_links_v1';


export function loadAllLinks() {
try {
return JSON.parse(localStorage.getItem(LINKS_KEY) || '[]');
} catch {
return [];
}
}


export function saveAllLinks(list) {
localStorage.setItem(LINKS_KEY, JSON.stringify(list));
}


export function findLinkByShortcode(code) {
const all = loadAllLinks();
return all.find(l => l.shortcode === code);
}


export function upsertLink(link) {
const all = loadAllLinks();
const idx = all.findIndex(l => l.shortcode === link.shortcode);
if (idx >= 0) all[idx] = link; else all.push(link);
saveAllLinks(all);
}


export function shortcodeExists(code) {
return !!findLinkByShortcode(code);
}

