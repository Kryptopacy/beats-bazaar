// AI DJ deep probe
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
const DIR='D:\\pacy_labs\\beats_bazaar';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9339, URL='http://localhost:3001';
const R={steps:[]};
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,'--no-first-run','--disable-gpu','--window-size=1440,900',`--user-data-dir=${DIR}\\.cdp-p5`,'about:blank'],{stdio:'ignore'});
let ws,msgId=0;const pending=new Map();
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}))});
async function ev(e){const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}
async function step(n,e){try{R.steps.push({name:n,data:await ev(e)})}catch(err){R.steps.push({name:n,error:String(err.message).slice(0,300)})}fs.writeFileSync(`${DIR}\\probe2.json`,JSON.stringify(R,null,2))}
try{
  let t=null;
  for(let i=0;i<50&&!t;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();t=l.find(x=>x.type==='page')}catch{}if(!t)await sleep(500)}
  ws=new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});
  ws.onmessage=(e)=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result)}};
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.navigate',{url:URL});
  await sleep(9000);

  await step('api_real_catalog',`(async()=>{
    try{
      const r=await fetch('/api/ai-dj',{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({prompt:'dark aggressive drill bars for a night cypher',beats:[
          {id:'b1',title:'Drill One',producer:'P',genre:'Afro-Drill',bpm:140,tags:['dark']},
          {id:'b2',title:'Sunset Log',producer:'Q',genre:'Amapiano',bpm:112,tags:['log drum']}]})});
      const j=await r.json();
      return {status:r.status, source:j.source, recommendedBeatId:j.recommendedBeatId, reasoning:j.reasoning, keys:Object.keys(j)};
    }catch(e){return{error:String(e)}}
  })()`);

  await step('open_and_enable',`(async()=>{
    const o={};
    const open=Array.from(document.querySelectorAll('button')).find(b=>/ask bazza/i.test(b.innerText||''));
    o.openLabel=open?open.innerText.trim():null;
    open.click();
    await new Promise(r=>setTimeout(r,1200));
    const ta=document.querySelector('textarea');
    o.textareaFound=!!ta;
    if(!ta) return o;
    const setter=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set;
    setter.call(ta,'dark aggressive drill bars for a night cypher');
    ta.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(r=>setTimeout(r,600));
    o.textareaValue=ta.value;
    const ask=Array.from(document.querySelectorAll('button')).find(b=>/Ask Bazza/i.test(b.innerText||''));
    o.askDisabled=ask?ask.disabled:null;
    o.askText=ask?ask.innerText.trim():null;
    o.allAskButtons=Array.from(document.querySelectorAll('button')).filter(b=>/Ask Bazza/i.test(b.innerText||'')).map(b=>({t:b.innerText.trim(),d:b.disabled}));
    return o;
  })()`);

  await step('submit_and_wait',`(async()=>{
    const o={};
    const ask=Array.from(document.querySelectorAll('button')).find(b=>/Ask Bazza/i.test(b.innerText||'')&&!b.disabled);
    if(!ask){o.submit='disabled-or-missing';return o}
    ask.click();
    o.submit='clicked';
    for(let i=0;i<12;i++){
      await new Promise(r=>setTimeout(r,1500));
      const b=document.body.innerText;
      const idx=b.indexOf("Bazza's Verdict");
      if(idx>=0){o.foundAfterMs=(i+1)*1500;o.verdict=b.slice(idx,idx+320).replace(/\\s+/g,' ');return o}
      if(/Failed to get recommendation/i.test(b)){o.error=b.match(/Failed to get recommendation[^\\n]*/)[0];return o}
    }
    o.bodyTail=document.body.innerText.slice(-700).replace(/\\s+/g,' ');
    return o;
  })()`);
}catch(e){R.fatal=String(e&&e.stack||e)}
finally{fs.writeFileSync(`${DIR}\\probe2.json`,JSON.stringify(R,null,2));try{ws&&ws.close()}catch{};chrome.kill();await sleep(300);process.exit(0)}
