// Focused probe: real playback state, AI DJ verdict, upload modal, mobile overflow
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
const DIR='D:\\pacy_labs\\beats_bazaar';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9338, URL='http://localhost:3001';
const R={steps:[],consoleErrors:[],pageErrors:[]};
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,'--no-first-run','--disable-gpu','--autoplay-policy=no-user-gesture-required','--window-size=1440,900',`--user-data-dir=${DIR}\\.cdp-p4`,'about:blank'],{stdio:'ignore'});
let ws,msgId=0;const pending=new Map();
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}))});
async function ev(e){const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}
async function step(n,e){try{R.steps.push({name:n,data:await ev(e)})}catch(err){R.steps.push({name:n,error:String(err.message).slice(0,250)})}fs.writeFileSync(`${DIR}\\probe-result.json`,JSON.stringify(R,null,2))}
try{
  let t=null;
  for(let i=0;i<50&&!t;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();t=l.find(x=>x.type==='page')}catch{}if(!t)await sleep(500)}
  ws=new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});
  ws.onmessage=(e)=>{const m=JSON.parse(e.data);
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result);return}
    if(m.method==='Runtime.consoleAPICalled'&&['error','warning'].includes(m.params.type))R.consoleErrors.push(`${m.params.type}: ${m.params.args.map(a=>a.value??a.description??'').join(' ')}`.slice(0,200));
    if(m.method==='Runtime.exceptionThrown')R.pageErrors.push((m.params.exceptionDetails.exception?.description||'').slice(0,250));
  };
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.navigate',{url:URL});
  await sleep(9000);

  await step('boot_state',`({
    dockVisible: /Beats Bazaar/i.test(document.body.innerText),
    hasCrossfade: /crossfade|shuffle/i.test(document.body.innerText),
    timeReadout: (document.body.innerText.match(/\\d+:\\d+/g)||[]).slice(0,3),
    volumeCtl: !!document.querySelector('input[type=range]')
  })`);

  // --- REAL PLAYBACK: click a play button then read the dock time readout ---
  await step('playback',`(async()=>{
    const o={};
    const before=document.body.innerText.match(/\\d{1,2}:\\d{2}/g)||[];
    o.timeBefore=before.slice(0,2);
    const btns=Array.from(document.querySelectorAll('button'));
    const play=btns.find(b=>/play/i.test((b.getAttribute('aria-label')||'')+(b.title||'')))||btns.find(b=>b.innerText.trim()==='Play');
    o.playFound=!!play; o.playLabel=play?((play.getAttribute('aria-label')||'')+'|'+(play.title||'')+'|'+(play.innerText||'').trim()).slice(0,60):null;
    if(!play) return o;
    play.click();
    await new Promise(r=>setTimeout(r,3000));
    const after=document.body.innerText.match(/\\d{1,2}:\\d{2}/g)||[];
    o.timeAfter=after.slice(0,2);
    o.timeAdvanced=before[0]!==after[0];
    o.audioState=(()=>{try{const a=window.__bbAudio;return a?{paused:a.paused,t:a.currentTime,d:a.duration,src:(a.src||'').slice(0,30)}:null}catch(e){return null}})();
    o.dockText=(document.body.innerText.match(/Bazza[^\\n]{0,60}/)||[])[0]||null;
    return o;
  })()`);

  // --- AI DJ full flow with verdict capture ---
  await step('aidj_full',`(async()=>{
    const o={};
    const open=Array.from(document.querySelectorAll('button')).find(b=>/ask bazza|ai dj/i.test(b.innerText||''));
    if(!open){o.open=false;return o}
    o.open=true; open.click();
    await new Promise(r=>setTimeout(r,1200));
    o.modalOpen=/Ask Bazza/i.test(document.body.innerText);
    const inp=document.querySelector('input[type=text],textarea');
    o.hasInput=!!inp;
    if(inp){
      const proto=inp.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
      const setter=Object.getOwnPropertyDescriptor(proto,'value').set;
      setter.call(inp,'dark aggressive drill bars for a night cypher');
      inp.dispatchEvent(new Event('input',{bubbles:true}));
    }
    await new Promise(r=>setTimeout(r,400));
    const ask=Array.from(document.querySelectorAll('button')).find(b=>/Ask Bazza/i.test(b.innerText||''));
    o.askFound=!!ask;
    if(ask) ask.click();
    await new Promise(r=>setTimeout(r,8000));
    const body=document.body.innerText;
    const i=body.indexOf("Bazza's Verdict");
    o.verdictShown=i>=0;
    o.verdict=i>=0?body.slice(i,i+300).replace(/\\s+/g,' '):null;
    o.errorMsg=(body.match(/Failed to get recommendation[^\\n]*/)||[])[0]||null;
    o.recTitle=(body.match(/Prod\\. by [^\\n]{0,60}/)||[])[0]||null;
    o.mentionsGemini=/gemini/i.test(body);
    return o;
  })()`);

  // --- UPLOAD MODAL fresh ---
  await step('upload_modal',`(async()=>{
    const b=Array.from(document.querySelectorAll('button')).find(x=>/drop a beat/i.test(x.innerText));
    if(!b) return {found:false};
    b.click();
    await new Promise(r=>setTimeout(r,1200));
    const m=document.querySelector('.fixed');
    return {found:true,open:!!m,
      fields:m?Array.from(m.querySelectorAll('input,select,textarea')).map(i=>(i.type||i.tagName)+':'+(i.name||i.placeholder||'').slice(0,18)):[],
      text:m?m.innerText.replace(/\\s+/g,' ').slice(0,420):null};
  })()`);
}catch(e){R.fatal=String(e&&e.stack||e)}
finally{fs.writeFileSync(`${DIR}\\probe-result.json`,JSON.stringify(R,null,2));try{ws&&ws.close()}catch{};chrome.kill();await sleep(300);process.exit(0)}
