const STORAGE_KEY = 'url_shortener_logs_v1';


const LoggingMiddleware = {
init(config = {}) {
this.clientID = config.clientID || 'anonymous-client';
// create logs store if missing
if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
this.log('init', { clientID: this.clientID, ts: new Date().toISOString() });
},
getLogs() {
try {
return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
} catch { return []; }
},
saveLogs(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); },
log(eventType, payload = {}) {
const entry = { eventType, payload, ts: new Date().toISOString() };
const logs = this.getLogs();
logs.push(entry);
this.saveLogs(logs);
}
};


export default LoggingMiddleware;