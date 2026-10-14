// Generado por src/mobile_export.py a partir de app/padel_view.js. No editar a mano.
"use strict";
function pxP(x){return (x==null||isNaN(x))?'–':(100*x).toFixed(1)+'%'}
function pOdd(p){return p>0?(1/p).toFixed(2):'–'}
const PCACHE=new Map();
function devig2(o1,o2){if(!(o1>1&&o2>1))return null;const a=1/o1,b=1/o2,s=a+b;return {p1:a/s,p2:b/s,margin:s-1}}
function distFor(m,p){// distribución de marcadores para una prob. de victoria p (cadena de Markov + forma del día)
  if(Math.abs(p-m.p1)<1e-9&&m.games_diff)return {p1:m.p1,p_set1:m.p_set1,sets:m.sets,games_total:m.games_total,games_diff:m.games_diff,set1_diff:m.set1_diff,top:m.top_exact};
  const k=m.match_id+'|'+p.toFixed(5);if(PCACHE.has(k))return PCACHE.get(k);
  const M=simMatch(p,m.hold_a??0.8,m.hold_sig??1.0),d={p1:p,p_set1:M.p_set1,sets:M.sets,games_total:M.games_total,games_diff:M.games_diff,set1_diff:M.set1_diff,top:M.top};PCACHE.set(k,d);return d}
function selections(d,t1,t2){// todas las selecciones con su probabilidad; fam = familia para elegir la mejor línea
  const S=[],c=Math.ceil,D=d.games_diff,T=d.games_total,S1=d.set1_diff;
  S.push({fam:'win1',mk:'Ganador',sel:t1,p:d.p1},{fam:'win2',mk:'Ganador',sel:t2,p:1-d.p1});
  S.push({fam:'s1_1',mk:'1.er set',sel:t1,p:d.p_set1},{fam:'s1_2',mk:'1.er set',sel:t2,p:1-d.p_set1});
  S.push({fam:'sb20',mk:'Resultado en sets',sel:t1+' 2-0',p:d.sets['2-0']},{fam:'sb21',mk:'Resultado en sets',sel:t1+' 2-1',p:d.sets['2-1']},
         {fam:'sb02',mk:'Resultado en sets',sel:t2+' 2-0',p:d.sets['0-2']},{fam:'sb12',mk:'Resultado en sets',sel:t2+' 2-1',p:d.sets['1-2']});
  S.push({fam:'ts2',mk:'Total de sets',sel:'2 sets',p:d.sets['2-0']+d.sets['0-2']},{fam:'ts3',mk:'Total de sets',sel:'3 sets',p:d.sets['2-1']+d.sets['1-2']});
  for(const L of [1.5,2.5,3.5]){S.push({fam:'h1a',mk:'1.er set – hándicap',sel:`${t1} −${L}`,p:sumR(S1,6+c(L),12),L},{fam:'h1b',mk:'1.er set – hándicap',sel:`${t2} +${L}`,p:sumR(S1,0,6+c(L)-1),L},
    {fam:'h1c',mk:'1.er set – hándicap',sel:`${t1} +${L}`,p:sumR(S1,6-c(L)+1,12),L},{fam:'h1d',mk:'1.er set – hándicap',sel:`${t2} −${L}`,p:sumR(S1,0,6-c(L)),L})}
  for(const L of [1.5,2.5,3.5,4.5,5.5,6.5,7.5]){S.push({fam:'ha',mk:'Hándicap juegos',sel:`${t1} −${L}`,p:sumR(D,30+c(L),60),L},{fam:'hb',mk:'Hándicap juegos',sel:`${t2} +${L}`,p:sumR(D,0,30+c(L)-1),L},
    {fam:'hc',mk:'Hándicap juegos',sel:`${t1} +${L}`,p:sumR(D,30-c(L)+1,60),L},{fam:'hd',mk:'Hándicap juegos',sel:`${t2} −${L}`,p:sumR(D,0,30-c(L)),L})}
  for(let L=16.5;L<=27.5;L++){S.push({fam:'to',mk:'Total de juegos',sel:`Más de ${L}`,p:sumR(T,c(L),T.length-1),L},{fam:'tu',mk:'Total de juegos',sel:`Menos de ${L}`,p:sumR(T,0,c(L)-1),L})}
  return S}
function bestPicks(S,thr){// en mercados con líneas, la línea de mayor cuota que aún supera el umbral
  const by={},out=[];for(const x of S){if(x.p<thr)continue;if(x.L==null){out.push(x);continue}const b=by[x.fam];if(!b||x.p<b.p)by[x.fam]=x}
  return out.concat(Object.values(by)).sort((a,b)=>b.p-a.p)}
function sig(x){return 1/(1+Math.exp(-x))}
function setProbs(h1,h2){const SS=[[6,0],[6,1],[6,2],[6,3],[6,4],[7,5],[7,6],[0,6],[1,6],[2,6],[3,6],[4,6],[5,7],[6,7]],idx={};SS.forEach((s,i)=>idx[s]=i);
  const out=new Array(14).fill(0),tb=.5*(h1+1-h2);
  for(const first of [0,1]){let P={'0,0':1};for(let g=0;g<13;g++){const N={};for(const [k,pr] of Object.entries(P)){const [i,j]=k.split(',').map(Number);
    if(i===6&&j===6){out[idx[[7,6]]]+=.5*pr*tb;out[idx[[6,7]]]+=.5*pr*(1-tb);continue}
    const pw=((first+i+j)%2===0)?h1:1-h2;for(const [ni,nj,q] of [[i+1,j,pw],[i,j+1,1-pw]]){
      if((ni===6&&nj<=4)||(ni===7&&nj===5)||(nj===6&&ni<=4)||(nj===7&&ni===5))out[idx[[ni,nj]]]+=.5*pr*q;else N[ni+','+nj]=(N[ni+','+nj]||0)+pr*q}}P=N}}
  const s=out.reduce((a,b)=>a+b,0);return {SS,d:out.map(x=>x/s)}}
const GHZ=[-3.7504397177,-2.3667594107,-1.1544053947,0,1.1544053947,2.3667594107,3.7504397177],GHW=[0.000548268856,0.030757123968,0.240123178605,0.457142857143,0.240123178605,0.030757123968,0.000548268856];
function simMatch(p,a,sg){// forma del día ~ N(0,sg²) común a los sets; la prob. media de ganar el partido es p
  sg=sg||0;let lo=-12,hi=12;for(let it=0;it<50;it++){const b=(lo+hi)/2;let pm=0;GHZ.forEach((z,k)=>{const s=sig(b+sg*z);pm+=GHW[k]*s*s*(3-2*s)});if(pm<p)lo=b;else hi=b}
  const b=(lo+hi)/2,SS=setProbs(.5,.5).SS,ex=new Map(),sets={'2-0':0,'2-1':0,'1-2':0,'0-2':0},avg=new Array(14).fill(0);
  GHZ.forEach((z,k)=>{const sk=sig(b+sg*z),w=GHW[k];let l=-4,h=4,r;for(let it=0;it<30;it++){const d=(l+h)/2;r=setProbs(sig(a+d),sig(a-d));const s=r.d.slice(0,7).reduce((x,y)=>x+y,0);if(s<sk)l=d;else h=d}
    const d=r.d;d.forEach((v,i)=>avg[i]+=w*v);sets['2-0']+=w*sk*sk;sets['2-1']+=w*2*sk*sk*(1-sk);sets['1-2']+=w*2*sk*(1-sk)**2;sets['0-2']+=w*(1-sk)**2;
    for(let i=0;i<14;i++)for(let j=0;j<14;j++){const pij=d[i]*d[j];if((i<7)===(j<7)){const key=i+','+j;ex.set(key,(ex.get(key)||0)+w*pij)}else for(let q=0;q<14;q++){const key=i+','+j+','+q;ex.set(key,(ex.get(key)||0)+w*pij*d[q])}}});
  const T=new Array(45).fill(0),D=new Array(61).fill(0),S1=new Array(13).fill(0);let g=0;
  for(const [key,v] of ex){const ids=key.split(',').map(Number);let gt=0,gd=0;ids.forEach(i=>{gt+=SS[i][0]+SS[i][1];gd+=SS[i][0]-SS[i][1]});if(gt<45)T[gt]+=v;D[30+gd]+=v;g+=v*gt}
  avg.forEach((v,i)=>S1[6+SS[i][0]-SS[i][1]]+=v);
  const top=[...ex.entries()].sort((x,y)=>y[1]-x[1]).slice(0,6).map(([key,v])=>[key.split(',').map(i=>SS[+i].join('-')).join(' '),v]);
  return {sets,top,games:g,p_set1:avg.slice(0,7).reduce((x,y)=>x+y,0),games_total:T,games_diff:D,set1_diff:S1}}
function sumR(a,from,to){let s=0;for(let i=Math.max(0,from);i<=Math.min(a.length-1,to);i++)s+=a[i];return s}
