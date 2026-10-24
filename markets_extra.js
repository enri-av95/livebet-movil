// Mercados adicionales derivados de la distribución de marcadores (21-oct-2026).
// Equivalente JavaScript de src/markets_extra.py: si cambias uno, cambia el otro.
// cells: [[h,a,p],...] sumando ~1 (incluido el reparto de «otro»); lead: tabla de models/lead_table.json.
"use strict";
function mxLead(t,side,h,a){const T=t&&t[side];if(T&&h<7&&a<7)return T[h][a];
  return side==='home'?(h>a?1:h/(a+1)):(a>h?1:a/(h+1))}
function extraMarkets(cells,lead){
  const P=f=>cells.reduce((s,[h,a,p])=>s+(f(h,a)?p:0),0),out=[],c=(g,n,f)=>out.push({g,n,p:P(f)});
  const L=lead||null;
  out.push({g:'lead',n:'Local va ganando en algún momento (1UP)',p:cells.reduce((s,[h,a,p])=>s+p*mxLead(L,'home',h,a),0)});
  out.push({g:'lead',n:'Visitante va ganando en algún momento (1UP)',p:cells.reduce((s,[h,a,p])=>s+p*mxLead(L,'away',h,a),0)});
  c('handicap','Local gana por 2 o más (hándicap -1)',(h,a)=>h-1>a);
  c('handicap','Local gana por 3 o más (hándicap -2)',(h,a)=>h-2>a);
  c('handicap','Visitante gana por 2 o más (hándicap -1)',(h,a)=>a-1>h);
  c('handicap','Visitante gana por 3 o más (hándicap -2)',(h,a)=>a-2>h);
  for(const l of [0.5,1.5,2.5]){const s=String(l).replace('.',',');
    c('team_goals',`Local: más de ${s} goles`,(h,a)=>h>l);c('team_goals',`Visitante: más de ${s} goles`,(h,a)=>a>l)}
  c('combo','Local gana sin encajar',(h,a)=>h>a&&a===0);c('combo','Visitante gana sin encajar',(h,a)=>a>h&&h===0);
  c('combo','Gana local y ambos marcan',(h,a)=>h>a&&a>0);c('combo','Gana visitante y ambos marcan',(h,a)=>a>h&&h>0);
  c('combo','Empate y ambos marcan',(h,a)=>h===a&&h>0);
  for(const l of [1.5,2.5,3.5]){const s=String(l).replace('.',',');
    c('combo',`Gana local y más de ${s} goles`,(h,a)=>h>a&&h+a>l);c('combo',`Gana visitante y más de ${s} goles`,(h,a)=>a>h&&h+a>l)}
  return out}
// 21-oct: el 1UP se calcula y se registra para calibrar, pero NO se muestra (decisión del usuario).
const MX_GROUPS={handicap:'Hándicap',team_goals:'Goles por equipo',combo:'Combinados'};
