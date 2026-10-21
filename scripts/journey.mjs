// E2E journey test for Beats Bazaar (raw CDP). Writes e2e-result.json.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';

const DIR = 'D:\\pacy_labs\\beats_bazaar';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9337;
const URL = 'http://localhost:3001';
const R = { steps: [], consoleErrors: [], pageErrors: [], netFails: [] };

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--disable-gpu', '--autoplay-policy=no-user-gesture-required',
  '--window-size=1440,900', `--user-data-dir=${DIR}\\.cdp-p3`, 'about:blank',
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
    fs.writeFileSync(`${DIR}\\e2e-${name}.png`, Buffer.from(r.data, 'base64'));
  } catch {}
}
async function step(name, expression) {
  try { R.steps.push({ name, data: await ev(expression) }); }
  catch (e) { R.steps.push({ name, error: String(e.message).slice(0, 250) }); }
  fs.writeFileSync(`${DIR}\\e2e-result.json`, JSON.stringify(R, null, 2));
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
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); return;
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error','warning'].includes(m.params.type))
      R.consoleErrors.push(`${m.params.type}: ${m.params.args.map(a => a.value ?? a.description ?? '').join(' ')}`.slice(0, 220));
    if (m.method === 'Runtime.exceptionThrown')
      R.pageErrors.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').slice(0, 300));
    if (m.method === 'Network.loadingFailed') R.netFails.push(`${m.params.type} ${m.params.errorText}`);
  };
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Page.navigate', { url: URL });
  await sleep(9000);

  await step('load', `({
    title: document.title,
    textLen: document.body.innerText.length,
    heading: document.querySelector('h1,h2')?.innerText?.slice(0,80),
    buttons: Array.from(document.querySelectorAll('button')).map(b=>b.innerText.trim()).filter(Boolean).slice(0,22)
  })`);
  await shot('01-home');


  await step('aidj', `(async()=>{
    const o={};
    const open=Array.from(document.querySelectorAll('button')).find(b=>/bazza|ai dj/i.test(b.innerText||''));
    if(!open){o.open=false;return o;} o.open=true; open.click();
    await new Promise(r=>setTimeout(r,1200));
    o.modalOpen=/Ask Bazza/i.test(document.body.innerText);
    const preset=Array.from(document.querySelectorAll('button')).find(b=>/Aggressive Drill|Heavy Amapiano|Chilled Sunset|Bouncy Lagos/i.test(b.innerText||''));
    o.preset=preset?preset.innerText.trim().slice(0,40):null;
    if(preset) preset.click();
    await new Promise(r=>setTimeout(r,400));
    const ask=Array.from(document.querySelectorAll('button')).find(b=>/Ask Bazza/i.test(b.innerText||''));
    if(ask) ask.click();
    await new Promise(r=>setTimeout(r,6000));
    const body=document.body.innerText;
    const i=body.indexOf("Bazza's Verdict");
    o.verdictShown=i>=0;
    o.verdict=i>=0?body.slice(i,i+220).replace(/\\s+/g,' '):null;
    o.disclosesEngine=/engine|fallback|offline|local matcher/i.test(body);
    o.disclosesGemini=/gemini/i.test(body);
    o.hasCypherCTA=/Play in Cypher Room/i.test(body);
    return o;
  })()`);
  await shot('02-aidj');

  await step('aidj_api', `(async()=>{
    const r=await fetch('/api/ai-dj',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({prompt:'high energy amapiano log drum',beats:[{id:'b1',title:'X',producer:'P',genre:'Amapiano',bpm:112,tags:['log drum']}]})});
    return {status:r.status, body: await r.json()};
  })()`);

  await step('close_modal', `(async()=>{
    const b=Array.from(document.querySelectorAll('button')).find(x=>(x.getAttribute('aria-label')||'').match(/close/i));
    if(b){b.click();await new Promise(r=>setTimeout(r,900));return true;} return false;
  })()`);

  await step('cypher', `(async()=>{
    const nav=Array.from(document.querySelectorAll('button,a')).find(x=>/cypher room/i.test(x.innerText||''));
    if(!nav) return {found:false};
    nav.click(); await new Promise(r=>setTimeout(r,2500));
    const body=document.body.innerText;
    return {found:true, hasCypher:/cypher/i.test(body), hasBpm:/bpm/i.test(body), len:body.length, snippet:body.replace(/\\s+/g,' ').slice(0,300)};
  })()`);
  await shot('03-cypher');

  await step('playback', `(async()=>{
    const b=Array.from(document.querySelectorAll('button')).find(x=>/play/i.test((x.getAttribute('aria-label')||'')+(x.title||'')+(x.innerText||'')));
    if(!b) return {clicked:false, reason:'no play button'};
    b.click(); await new Promise(r=>setTimeout(r,3000));
    const a=document.querySelector('audio');
    return {clicked:true, label:b.innerText.trim().slice(0,30), audioEls:document.querySelectorAll('audio').length,
            paused:a?a.paused:null, currentTime:a?a.currentTime:null, duration:a?a.duration:null};
  })()`);
  await shot('04-playing');

  await step('license_flow', `(async()=>{
    const lic=Array.from(document.querySelectorAll('button')).find(x=>/license/i.test(x.innerText||''));
    if(!lic) return {found:false, available:Array.from(document.querySelectorAll('button')).map(b=>b.innerText.trim()).filter(Boolean).slice(0,30)};
    lic.click(); await new Promise(r=>setTimeout(r,1500));
    const body=document.body.innerText;
    const o={found:true, hasBachs:/Bachs/i.test(body), hasEncrypted:/Encrypted checkout/i.test(body),
             mentionsPayout:/payout/i.test(body), snippet:body.replace(/\\s+/g,' ').slice(-500)};
    const pay=Array.from(document.querySelectorAll('button')).find(x=>/^Pay/i.test((x.innerText||'').trim()));
    o.payLabel=pay?pay.innerText.trim():null;
    if(pay){ pay.click(); await new Promise(r=>setTimeout(r,4000)); }
    const b2=document.body.innerText;
    o.afterPay={ hasCertificate:/CERTIFICATE|Certificate/i.test(b2), hasTxRef:/BACHS-/i.test(b2),
                 hasDownload:/Download/i.test(b2), snippet:b2.replace(/\\s+/g,' ').slice(-600) };
    return o;
  })()`);
  await shot('06-license');

  await step('upload_modal', `(async()=>{
    const b=Array.from(document.querySelectorAll('button')).find(x=>/drop a beat|drop$/i.test((x.innerText||'').trim()));
    if(!b) return {found:false};
    b.click(); await new Promise(r=>setTimeout(r,1500));
    const body=document.body.innerText;
    return {found:true, label:b.innerText.trim().slice(0,30), fields:document.querySelectorAll('input,select,textarea').length,
            hasUploadWord:/upload/i.test(body), snippet:body.replace(/\\s+/g,' ').slice(-400)};
  })()`);
  await shot('07-upload');

  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await sleep(1500);
  await step('mobile_390', `({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  })`);
  await shot('08-mobile');
  await send('Emulation.clearDeviceMetricsOverride');
} catch (e) {
  R.fatal = String(e && e.stack || e);
} finally {
  fs.writeFileSync(`${DIR}\\e2e-result.json`, JSON.stringify(R, null, 2));
  try { ws && ws.close(); } catch {}
  chrome.kill();
}
