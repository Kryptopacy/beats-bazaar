// Direct CDP smoke test for Beats Bazaar (no external deps).
// Launches headless Chrome, loads the app, and probes runtime behavior.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const URL = 'http://localhost:3001';

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--autoplay-policy=no-user-gesture-required',
  '--user-data-dir=D:\\pacy_labs\\beats_bazaar\\.cdp-profile',
  'about:blank',
], { stdio: 'ignore' });

let ws, msgId = 0;
const pending = new Map();
const consoleLogs = [];
const pageErrors = [];
const failedRequests = [];

function send(method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
  });
}

async function evaluate(expression) {
  const r = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
}

try {
  let target = null;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      target = list.find(t => t.type === 'page');
      if (target) break;
    } catch {}
    await sleep(500);
  }
  if (!target) throw new Error('Chrome CDP endpoint never came up');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      return;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(`${msg.params.type}: ${msg.params.args.map(a => a.value ?? a.description ?? a.type).join(' ')}`);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      pageErrors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    }
    if (msg.method === 'Network.loadingFailed') {
      failedRequests.push(`${msg.params.type} ${msg.params.errorText}`);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');

  await send('Page.navigate', { url: URL });
  await sleep(6000);

  const aiDj = await evaluate(`(async () => {
    try {
      const r = await fetch('/api/ai-dj', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt:'dark aggressive drill bars for a cypher', beats:[{id:'b1',title:'Test Beat',producer:'P',genre:'Afro-Drill',bpm:140,tags:['dark']},{id:'b2',title:'Sunset',producer:'Q',genre:'Amapiano',bpm:112,tags:['log drum']}] })
      });
      const j = await r.json();
      return { status: r.status, body: j };
    } catch (e) { return { error: String(e) }; }
  })()`);
  console.log('AI_DJ_ENDPOINT:', JSON.stringify(aiDj));

  const modalOpen = await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => /ask bazza/i.test(b.innerText));
    if (!btn) return { found: false };
    btn.click();
    return { found: true };
  })()`);
  await sleep(1200);
  const modalText = await evaluate(`(() => {
    const dialogs = Array.from(document.querySelectorAll('div')).filter(d => /Bazza/.test(d.innerText||'') && String(d.className).includes('fixed'));
    return dialogs.length ? dialogs[0].innerText.slice(0,200) : 'NO_MODAL';
  })()`);
  console.log('AI_DJ_MODAL:', JSON.stringify(modalOpen), '->', modalText);

  console.log('--- CONSOLE LOGS (last 25) ---');
  consoleLogs.slice(-25).forEach(l => console.log('  ', l));
  console.log('--- PAGE ERRORS ---');
  console.log(pageErrors.length ? pageErrors.join('\n') : '  none');
  console.log('--- FAILED REQUESTS ---');
  console.log(failedRequests.length ? failedRequests.join('\n') : '  none');
  console.log('TITLE:', await evaluate('document.title'));
  console.log('VISIBLE_TEXT_LEN:', await evaluate('document.body.innerText.length'));
  console.log('HEADING:', await evaluate('document.querySelector("h1,h2")?.innerText?.slice(0,120)'));
  console.log('CARD_COUNT:', await evaluate(`document.querySelectorAll('[class*="rounded-3xl"]').length`));
  console.log('PLAY_CONTROLS:', JSON.stringify(await evaluate(`
    Array.from(document.querySelectorAll('button')).filter(b => /play/i.test(b.getAttribute('aria-label')||b.title||b.innerText)).slice(0,6)
      .map(b => (b.getAttribute('aria-label')||b.title||b.innerText).trim().slice(0,40))
  `)));

  const audioState = await evaluate(`(() => {
    const a = document.querySelector('audio');
    if (!a) return { found: false };
    return { found: true, src: (a.src||'').slice(0,40), paused: a.paused, duration: a.duration, readyState: a.readyState, currentTime: a.currentTime };
  })()`);
  console.log('AUDIO_TAG_STATE:', JSON.stringify(audioState));

  const playback = await evaluate(`(async () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const play = btns.find(b => /play/i.test(b.getAttribute('aria-label')||b.title||'')) || btns.find(b => b.innerText.trim()==='Play');
    if (!play) return { clicked: false };
    play.click();
    await new Promise(r => setTimeout(r, 2500));
    const a = document.querySelector('audio');
    return { clicked: true, hasAudio: !!a, paused: a?.paused, currentTime: a?.currentTime, duration: a?.duration, src: (a?.src||'').slice(0,30) };
  })()`);
  console.log('PLAYBACK_TEST:', JSON.stringify(playback));

  console.log('LOCALSTORAGE:', JSON.stringify(await evaluate(`({ keys: Object.keys(localStorage) })`)));

  // ---- BACHS CHECKOUT JOURNEY (license -> pay -> certificate) ----
  const checkout = await evaluate(`(async () => {
    const out = {};
    const btnText = (b) => (b.innerText||'').trim();
    const licenseBtn = Array.from(document.querySelectorAll('button')).find(b => /license this beat/i.test(btnText(b)));
    out.licenseButtonFound = !!licenseBtn;
    if (!licenseBtn) return out;
    licenseBtn.click();
    await new Promise(r => setTimeout(r, 900));

    const modal = document.querySelector('.fixed');
    out.bachsModalOpen = !!modal;
    out.bachsModalText = modal ? modal.innerText.replace(/\\n+/g,' | ').slice(0, 260) : null;

    const payBtn = Array.from(document.querySelectorAll('button')).find(b => /^Pay \\$/i.test(btnText(b)));
    out.payButtonFound = !!payBtn;
    out.payButtonLabel = payBtn ? btnText(payBtn) : null;
    if (!payBtn) return out;
    payBtn.click();
    await new Promise(r => setTimeout(r, 2600));

    const cert = Array.from(document.querySelectorAll('div')).find(d =>
      /Digital License Certificate/i.test(d.innerText||'') && String(d.className).includes('fixed'));
    out.certificateShown = !!cert;
    out.certificateText = cert ? cert.innerText.replace(/\\n+/g,' | ').slice(0, 300) : null;
    out.certificateHasId = !!(cert && /BB-LIC-/.test(cert.innerText||''));
    return out;
  })()`);
  console.log('CHECKOUT_JOURNEY:', JSON.stringify(checkout, null, 2));

  // ---- CYPHER ROOM SURFACE ----
  const cypher = await evaluate(`(async () => {
    const tab = Array.from(document.querySelectorAll('button')).find(b => /cypher/i.test(b.innerText||''));
    if (!tab) return { tabFound: false };
    tab.click();
    await new Promise(r => setTimeout(r, 1500));
    return {
      tabFound: true,
      bodyText: document.body.innerText.replace(/\\n+/g,' | ').slice(0, 400),
      hasAudio: !!document.querySelector('audio')
    };
  })()`);
  console.log('CYPHER_ROOM:', JSON.stringify(cypher, null, 2));

  // ---- PRODUCER UPLOAD MODAL ----
  const upload = await evaluate(`(async () => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => /drop a beat|upload/i.test(b.innerText||''));
    if (!btn) return { uploadButtonFound: false };
    btn.click();
    await new Promise(r => setTimeout(r, 900));
    const modal = document.querySelector('.fixed');
    return { uploadButtonFound: true, modalOpen: !!modal, fields: modal ? Array.from(modal.querySelectorAll('input,select')).map(i => i.name||i.type||i.tagName) : [] };
  })()`);
  console.log('UPLOAD_MODAL:', JSON.stringify(upload, null, 2));

} catch (err) {
  console.error('TEST_HARNESS_ERROR:', err.message);
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  await sleep(500);
  process.exit(0);
}
