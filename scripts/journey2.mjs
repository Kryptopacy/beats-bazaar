// Full raw-CDP end-to-end journey for Beats Bazaar (appended to journey.mjs).
// Exercises marketplace render, AI DJ (Bazza), Cypher Room, audio playback,
// upload modal, license -> Bachs checkout -> certificate, mobile layout.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';

const DIR = 'D:\\pacy_labs\\beats_bazaar';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9341;
const URL = process.env.APP_URL || 'http://localhost:3001';
const R = { steps: [], consoleErrors: [], pageErrors: [], netFails: [] };

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--disable-gpu', '--autoplay-policy=no-user-gesture-required',
  '--window-size=1440,1000', `--user-data-dir=${DIR}\\.cdp-j5`, 'about:blank',
], { stdio: 'ignore' });

let ws, msgId = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++msgId; pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params }));
});
async function ev(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result?.value;
}
async function shot(name) {
  try {
    const r = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${DIR}\\artifacts-${name}.png`, Buffer.from(r.data, 'base64'));
  } catch {}
}
async function step(name, expression) {

try {
  let target = null;
  for (let i = 0; i < 50 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch {}
    if (!target) await sleep(500);
  }
  if (!target) throw new Error('CDP never came up');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); return;
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error','warning'].includes(m.params.type))
      R.consoleErrors.push(`${m.params.type}: ${m.params.args.map(a=>a.value??a.description??'').join(' ')}`.slice(0,240));
    if (m.method === 'Runtime.exceptionThrown')
      R.pageErrors.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').slice(0,300));
    if (m.method === 'Network.loadingFailed') R.netFails.push(`${m.params.type} ${m.params.errorText}`);
  };
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Page.navigate', { url: URL });
  await sleep(9000);

  await step('load', `({
    title: document.title,
    navTabs: Array.from(document.querySelectorAll('header button')).map(b=>b.innerText.trim()).filter(Boolean),
    bodySnippet: document.body.innerText.replace(/\\n+/g,' | ').slice(0,600)
  })`);
  await shot('01-home');

  // ---- AI DJ: raw API truth ----
  await step('aidj-api', `(async () => {
    const r = await fetch('/api/ai-dj', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prompt:'dark aggressive drill bars for a night cypher',
        beats:[{id:'b1',title:'Test Drill',producer:'P',genre:'Afro-Drill',bpm:140,tags:['dark']},
               {id:'b2',title:'Sunset Log',producer:'Q',genre:'Amapiano',bpm:112,tags:['log drum']}] }) });
    const j = await r.json();
    return { status:r.status, source:j.source, recommendedBeatId:j.recommendedBeatId, reasoning:j.reasoning };
  })()`);

  // ---- AI DJ: UI flow ----
  await step('aidj-open', `(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x=>/bazza|ai dj/i.test(x.innerText));
    if (b) { b.click(); return { clicked:true, label:b.innerText.trim().slice(0,40) }; }
    return { clicked:false, buttons:Array.from(document.querySelectorAll('button')).map(x=>x.innerText.trim()).filter(Boolean).slice(0,30) };
  })()`);
  await sleep(1500);
  await step('aidj-modal', `({
    hasInput: !!document.querySelector('input,textarea'),
    placeholders: Array.from(document.querySelectorAll('input,textarea')).map(i=>i.placeholder),
    presets: Array.from(document.querySelectorAll('button')).map(b=>b.innerText.trim()).filter(t=>/Amapiano|Drill|Sunset|Lagos/i.test(t))
  })`);

  // ---- CYPHER ROOM ----
  await step('cypher-nav', `(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x=>/Cypher Room/i.test(x.innerText));
    if (b) { b.click(); return true; } return false; })()`);
  await sleep(2500);
  await step('cypher-state', `({
    bpmCount: (document.body.innerText.match(/\\d+ BPM/gi)||[]).length,
    snippet: document.body.innerText.replace(/\\n+/g,' | ').slice(0,700),
    hasAudio: !!document.querySelector('audio') })`);
  await shot('04-cypher');

  // ---- AUDIO PLAYBACK ----
  await step('playback', `(async () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const play = btns.find(b=>/play/i.test(b.getAttribute('aria-label')||b.title||'')) || btns.find(b=>b.innerText.trim()==='Play');
    if (!play) return { clicked:false, sample: btns.map(b=>b.innerText.trim()).filter(Boolean).slice(0,25) };
    play.click();
    await new Promise(r=>setTimeout(r,3000));
    const a = document.querySelector('audio');
    return { clicked:true, hasAudioEl: !!a, paused:a?.paused, currentTime:a?.currentTime,
             duration:a?.duration, src:(a?.src||'').slice(0,60) }; })()`);
  await shot('05-playing');

  // ---- UPLOAD MODAL ----
  await step('upload-modal', `(async () => {
    const b = Array.from(document.querySelectorAll('button')).find(x=>/drop a beat/i.test(x.innerText));
    if (!b) return { found:false };
    b.click();
    await new Promise(r=>setTimeout(r,1000));
    const m = document.querySelector('.fixed');
    return { found:true, open:!!m,
             fields: m ? Array.from(m.querySelectorAll('input,select,textarea')).map(i=>i.type||i.tagName) : [],
             text: m ? m.innerText.replace(/\\n+/g,' | ').slice(0,300) : null }; })()`);
  await shot('06-upload');
  await ev(`(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/close|✕|×/i.test(x.getAttribute('aria-label')||x.title||'')); if(b) b.click(); return true; })()`);
  await sleep(700);

  // ---- LICENSE -> BACHS -> CERTIFICATE ----
  await step('market-nav', `(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x=>/^Marketplace$/i.test(x.innerText.trim()));
    if (b) { b.click(); return true; } return false; })()`);
  await sleep(2000);
  await step('checkout', `(async () => {
    const out = {};
    const btns = () => Array.from(document.querySelectorAll('button'));
    const lic = btns().find(b=>/license this beat/i.test(b.innerText||''));
    out.licenseBtn = !!lic;
    if (!lic) { out.sample = btns().map(b=>b.innerText.trim()).filter(Boolean).slice(0,30); return out; }
    lic.click();
    await new Promise(r=>setTimeout(r,1200));
    const modal = document.querySelector('.fixed');
    out.bachsOpen = !!modal;
    out.bachsText = modal ? modal.innerText.replace(/\\n+/g,' | ').slice(0,300) : null;
    const pay = btns().find(b=>/^Pay \\$/i.test((b.innerText||'').trim()));
    out.payBtn = !!pay; out.payLabel = pay ? pay.innerText.trim() : null;
    if (!pay) return out;
    pay.click();
    await new Promise(r=>setTimeout(r,3200));
    const cert = Array.from(document.querySelectorAll('div')).find(d=>/Digital License Certificate/i.test(d.innerText||'') && String(d.className).includes('fixed'));
    out.certShown = !!cert;
    out.certText = cert ? cert.innerText.replace(/\\n+/g,' | ').slice(0,420) : null;
    out.certHasId = !!(cert && /BB-LIC-/.test(cert.innerText||''));
    out.downloadLink = !!Array.from(document.querySelectorAll('a')).find(a=>/download/i.test(a.innerText||''));
    return out; })()`);
  await shot('07-checkout');
  await sleep(600);
  await shot('08-certificate');

  // ---- RESPONSIVE ----
  await send('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:2, mobile:true });
  await sleep(1500);
  await step('mobile-390', `({ w: window.innerWidth, scrollWidth: document.documentElement.scrollWidth,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 2 })`);
  await shot('09-mobile');
  await send('Emulation.clearDeviceMetricsOverride');

  await step('errors', `({ consoleErrors: R.consoleErrors.length, pageErrors: R.pageErrors.length, netFails: R.netFails.length })`);
} catch (e) {
  R.steps.push({ name:'FATAL', error: String(e && e.stack || e).slice(0,600) });
} finally {
  fs.writeFileSync(`${DIR}\\e2e-journey.json`, JSON.stringify(R, null, 2));
  try { ws?.close(); } catch {}
  chrome.kill();
  await sleep(400);
  process.exit(0);
}

  await shot('02-aidj-modal');

  await step('aidj-preset', `(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x=>/Heavy Amapiano/i.test(x.innerText));
    if (b) { b.click(); return b.innerText.trim().slice(0,60); } return null; })()`);
  await sleep(500);
  await step('aidj-submit', `(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x=>/Ask Bazza/i.test(x.innerText));
    if (b) { b.click(); return true; } return false; })()`);
  await sleep(7000);
  await step('aidj-result', `(() => {
    const t = document.body.innerText; const i = t.indexOf("Bazza's Verdict");
    return { hasVerdict: i>=0, verdict: i>=0 ? t.slice(i,i+300) : null,
             err: (t.match(/Failed to get[^\\n]*/)||[])[0] || null }; })()`);
  await shot('03-aidj-result');
  await ev(`(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/close|✕|×/i.test(x.getAttribute('aria-label')||x.title||'')); if(b) b.click(); return true; })()`);
  await sleep(800);

  try { R.steps.push({ name, data: await ev(expression) }); }
  catch (e) { R.steps.push({ name, error: String(e.message).slice(0, 300) }); }
  fs.writeFileSync(`${DIR}\\e2e-journey.json`, JSON.stringify(R, null, 2));
}
