// AI DJ probe scoped to the modal container
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
const DIR='D:\\pacy_labs\\beats_bazaar';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9340, URL='http://localhost:3001';
const R={steps:[]};
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,'--no-first-run','--disable-gpu','--window-size=1440,900',`--user-data-dir=${DIR}\\.cdp-p6`,'about:blank'],{stdio:'ignore'});
let ws,msgId=0;const pending=new Map();
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}))});
async function ev(e){const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}
async function step(n,e){try{R.steps.push({name:n,data:await ev(e)})}catch(err){R.steps.push({name:n,error:String(err.message).slice(0,300)})}fs.writeFileSync(`${DIR}\\probe3.json`,JSON.stringify(R,null,2))}
try{
  let t=null;
  for(let i=0;i<50&&!t;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();t=l.find(x=>x.type==='page')}catch{}if(!t)await sleep(500)}
  ws=new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});
  ws.onmessage=(e)=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result)}};
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.navigate',{url:URL});
  await sleep(9000);

  await step('modal_scoped',`(async()=>{
    const o={};
    // open via the marketplace hero button
    const opener=Array.from(document.querySelectorAll('button')).find(b=>/^Ask Bazza$/i.test(b.innerText.trim()));
    o.openerFound=!!opener;
    opener.click();
    await new Promise(r=>setTimeout(r,1200));
    const modal=document.querySelector('.fixed');
    o.modalFound=!!modal;
    if(!modal) return o;
    const ta=modal.querySelector('textarea');
    o.textarea=!!ta;
    const setter=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set;
    setter.call(ta,'dark aggressive drill bars for a night cypher');
    ta.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(r=>setTimeout(r,600));
    const ask=Array.from(modal.querySelectorAll('button')).find(b=>/Ask Bazza/i.test(b.innerText||''));
    o.askFound=!!ask; o.askDisabled=ask?ask.disabled:null;
    o.modalButtons=Array.from(modal.querySelectorAll('button')).map(b=>b.innerText.trim().slice(0,28));
    ask.click();
    o.clicked=true;
    for(let i=0;i<12;i++){
      await new Promise(r=>setTimeout(r,1500));
      const b=document.body.innerText;
      const idx=b.indexOf("Bazza's Verdict");
      if(idx>=0){o.foundAfterMs=(i+1)*1500;o.verdict=b.slice(idx,idx+340).replace(/\\s+/g,' ');return o}
      if(/Failed to get recommendation/i.test(b)){o.error=b.match(/Failed to get recommendation[^\\n]*/)[0];return o}
    }
    o.stillLoading=/digging through crates/i.test(document.body.innerText);
    o.bodyTail=document.body.innerText.slice(-500).replace(/\\s+/g,' ');
    return o;
  })()`);

  await step('preset_flow',`(async()=>{
    const o={};
    const modal=document.querySelector('.fixed');
    if(!modal) return {noModal:true};
    const preset=Array.from(modal.querySelectorAll('button')).find(b=>/Heavy Amapiano/i.test(b.innerText||''));
    o.preset=preset?preset.innerText.trim():null;
    if(!preset) return o;
    preset.click();
    for(let i=0;i<12;i++){
      await new Promise(r=>setTimeout(r,1500));
      const b=document.body.innerText;
      const idx=b.indexOf("Bazza's Verdict");
      if(idx>=0){o.foundAfterMs=(i+1)*1500;o.verdict=b.slice(idx,idx+340).replace(/\\s+/g,' ');o.rec=(b.match(/Prod\\. by [^\\n]{0,70}/)||[])[0]||null;return o}
    }
    o.bodyTail=document.body.innerText.slice(-400).replace(/\\s+/g,' ');
    return o;
  })()`);
}catch(e){R.fatal=String(e&&e.stack||e)}
finally{fs.writeFileSync(`${DIR}\\probe3.json`,JSON.stringify(R,null,2));try{ws&&ws.close()}catch{};chrome.kill();await sleep(300);process.exit(0)}
