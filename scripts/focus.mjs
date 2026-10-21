// Focused test: license modal -> payment -> certificate, and audio playback.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIR = 'D:\\pacy_labs\\beats_bazaar';
const PORT = 9338;
const URL = 'http://localhost:3001';
const R = { steps: [], consoleErrors: [], pageErrors: [] };

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--disable-gpu', '--autoplay-policy=no-user-gesture-required',
  '--window-size=1440,900', `--user-data-dir=${DIR}\\.cdp-p4`, 'about:blank',
], { stdio: 'ignore' });

let ws, msgId = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++msgId; pending.set(id, { resolve, reject });
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
    fs.writeFileSync(`${DIR}\\e2e-${name}.png`, Buffer.from(r.data, 'base64'));
  } catch {}
}
async function run(name, expression) {
  try { R.steps.push({ name, data: await ev(expression) }); }
  catch (e) { R.steps.push({ name, error: String(e.message).slice(0, 250) }); }
}


try {
  let target = null;
  for (let i = 0; i < 50 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch {}
    if (!target) await sleep(500);
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id); pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result); return;
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error','warning'].includes(m.params.type))
      R.consoleErrors.push(`${m.params.type}: ${m.params.args.map(a=>a.value??a.description??'').join(' ')}`.slice(0,220));
    if (m.method === 'Runtime.exceptionThrown')
      R.pageErrors.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').slice(0,300));
  };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate', { url: URL });
  await sleep(9000);

  await run('license_buttons', `(() => {
    const all = Array.from(document.querySelectorAll('button')).map((b,i)=>({i, t:(b.innerText||'').trim().replace(/\\s+/g,' ').slice(0,45)}));
    return all.filter(x=>/lease|buyout|buy|licen/i.test(x.t)).slice(0,10);
  })()`);

  await run('open_license', `(async()=>{
    const b=Array.from(document.querySelectorAll('button')).find(x=>/^Lease/i.test((x.innerText||'').trim()));
    if(!b) return {found:false};
    b.click(); await new Promise(r=>setTimeout(r,2000));
    const body=document.body.innerText;
    return {
      found:true,
      hasTotalDue:/Total Due/i.test(body),
      totalDueLine:(body.match(/Total Due[\\s\\S]{0,20}/)||[null])[0],
      hasEncrypted:/Encrypted checkout/i.test(body),
      hasPayout:/instant payout/i.test(body),
      hasFiat:/Fiat/i.test(body),
      hasCrypto:/Crypto/i.test(body),
      inputCount:document.querySelectorAll('input').length,
      inputPlaceholders:Array.from(document.querySelectorAll('input')).map(i=>i.placeholder||i.name||i.type).slice(0,8),
      payButtons:Array.from(document.querySelectorAll('button')).map(x=>(x.innerText||'').trim()).filter(t=>/pay/i.test(t))
    };
  })()`);
  await shot('07-license-modal');


  await run('pay_and_certificate', `(async()=>{
    const o={};
    const pay=Array.from(document.querySelectorAll('button')).find(x=>/^Pay \\$/i.test((x.innerText||'').trim()));
    if(!pay){o.payFound=false;return o;}
    o.payFound=true; o.payLabel=pay.innerText.trim();
    pay.click();
    await new Promise(r=>setTimeout(r,4000));
    const body=document.body.innerText;
    o.certShown=/certificate/i.test(body);
    o.certId=(body.match(/BB-LIC-[A-Z0-9-]+/)||[null])[0];
    o.hasDownload=Array.from(document.querySelectorAll('button,a')).some(x=>/download/i.test(x.innerText||''));
    o.exclusiveSold=/exclusive sold/i.test(body);
    o.bodySnippet=body.replace(/\\s+/g,' ').slice(0,350);
    return o;
  })()`);
  await shot('08-certificate');

  await run('audio_playback', `(async()=>{
    const b=Array.from(document.querySelectorAll('button')).find(x=>/play/i.test(x.getAttribute('aria-label')||x.title||''));
    if(!b) return {playBtn:false, allButtons: Array.from(document.querySelectorAll('button')).map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()).filter(Boolean).slice(0,25)};
    b.click(); await new Promise(r=>setTimeout(r,3500));
    const a=document.querySelector('audio');
    return {
      playBtn:true,
      audioEls:document.querySelectorAll('audio').length,
      hasAudio:!!a,
      paused:a?a.paused:null,
      currentTime:a?a.currentTime:null,
      duration:a?a.duration:null,
      src:(a?(a.currentSrc||a.src):'').slice(0,60),
      readyState:a?a.readyState:null
    };
  })()`);
  await shot('09-playing');

  R.steps.push({ name: 'errors', data: { consoleErrors: R.consoleErrors.slice(0,10), pageErrors: R.pageErrors.slice(0,10) } });
} catch (err) { R.fatal = String(err && err.stack || err).slice(0,600); }
finally {
  fs.writeFileSync(`${DIR}\\focus-result.json`, JSON.stringify(R, null, 2));
  try { ws.close(); } catch {}
  try { chrome.kill(); } catch {}
  await sleep(300);
  process.exit(0);
}
