// mobile overflow culprit finder
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
const DIR='D:\\pacy_labs\\beats_bazaar';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9342, URL='http://localhost:3001';
const R={steps:[]};
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,'--no-first-run','--disable-gpu','--window-size=390,844',`--user-data-dir=${DIR}\\.cdp-p8`,'about:blank'],{stdio:'ignore'});
let ws,msgId=0;const pending=new Map();
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}))});
async function ev(e){const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}
async function step(n,e){try{R.steps.push({name:n,data:await ev(e)})}catch(err){R.steps.push({name:n,error:String(err.message).slice(0,300)})}fs.writeFileSync(`${DIR}\\mobile.json`,JSON.stringify(R,null,2))}
try{
  let t=null;
  for(let i=0;i<50&&!t;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();t=l.find(x=>x.type==='page')}catch{}if(!t)await sleep(500)}
  ws=new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});
  ws.onmessage=(e)=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result)}};
  await send('Runtime.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await send('Page.navigate',{url:URL});
  await sleep(9000);
  await step('overflow',`(()=>{
    const vw=document.documentElement.clientWidth;
    const bad=[];
    document.querySelectorAll('*').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.right>vw+2 && r.width>10){
        bad.push({tag:el.tagName, cls:String(el.className).slice(0,90), right:Math.round(r.right), w:Math.round(r.width), text:(el.innerText||'').trim().slice(0,40)});
      }
    });
    return {vw, scrollW:document.documentElement.scrollWidth, offenders:bad.slice(0,14)};
  })()`);
}catch(e){R.fatal=String(e&&e.stack||e)}
finally{fs.writeFileSync(`${DIR}\\mobile.json`,JSON.stringify(R,null,2));try{ws&&ws.close()}catch{};chrome.kill();await sleep(300);process.exit(0)}
