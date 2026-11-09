/* טיקטין – חשמל זמני לאתר בנייה: נתונים, כללי הערכה וחישוב משותפים.
   משמש את אפליקציית "תכנון חשמל זמני" ואת טופס פתיחת ההזמנות בחברת החשמל. */
(function(g){
 'use strict';
 const CRANES=[
  ['Liebherr 110 EC-B 6','שטוח-ראש','6 טון','~53 מ\'',30,'3X63'],
  ['Comansa LCL165-8t','זרוע מתרוממת (VFD)','8 טון','~49.5 מ\'',35,'3X80'],
  ['Liebherr 110 EC-B 6 FR.tronic','שטוח-ראש (VFD)','6 טון','~46 מ\'',40,'3X80'],
  ['Potain MC 125','פטיש / ראש-חתול','6 טון','~60 מ\'',45,'3X100'],
  ['Potain MDT 219 J8','שטוח-ראש (VFD)','8 טון','65 מ\'',60,'3X100'],
  ['Comansa 21LC210','שטוח-ראש','18 טון','~64 מ\'',60,'3X100'],
  ['Potain MR 160 C','זרוע מתרוממת','10 טון','~50 מ\'',60,'3X100'],
  ['Potain MDT 219 J10','שטוח-ראש (VFD)','10 טון','65 מ\'',65,'3X125'],
  ['Comansa 21LC335','שטוח-ראש','12 עד 20 טון','~65 מ\'',65,'3X125'],
  ['Comansa LCL280-18t','זרוע מתרוממת (VFD)','18 טון','~53 מ\'',70,'3X125'],
  ['Comansa 21LC600','שטוח-ראש','20 טון','~85 מ\'',70,'3X125'],
  ['Comansa 21LC650','שטוח-ראש','25 טון','~85 מ\'',85,'3X160']];
 const HOISTS=[
  ['GEDA 500 Z/ZP','תא בודד','1×~9 kW',9,'3X32'],
  ['GEDA 1200 Z/ZP','תא בודד','2×~11.5 kW',23,'3X63'],
  ['Alimak SC45/30','תא בודד','2×15 kW (VFC)',30,'3X63'],
  ['Alimak SC65/32','תא בודד','3×11 kW',33,'3X63'],
  ['Alimak SC45/30 3M','תא בודד','3×15 kW',45,'3X80'],
  ['GEDA 1500 Z/ZP','תא כפול','2×2×~11.5 kW',46,'3X100'],
  ['Alimak SC65 Twin','תא כפול','2×(3×11) kW',66,'3X125'],
  ['Alimak SC200 Twin','תא כפול','2×(2×23) kW',92,'3X160']];
 // מדרגות מפסק הזנה ללוחות, וגדלי חיבור זמני בחברת החשמל (3X40 עד 3X910)
 const STEPS=[16,20,25,32,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500];
 const CONN=[40,63,80,100,125,160,200,250,315,400,500,630,800,910];
 const DEF={V:400,PF:0.85,RS:1.25,useG:true,G:[1,0.9,0.85,0.8]};
 const kw2a=(kw,V,PF)=>kw*1000/(Math.sqrt(3)*(V||400)*(PF||0.85));
 // צרכנים מוכנים: [שם, זרם ליח' או null, מפסק, מקדם שימוש, הספק kW כשהזרם מחושב]
 const PRESETS=[
  ['מנוף צריח',160,'3X160',0.5],
  ['מעלית משא חיצונית',80,'3X100',0.5],
  ['משאבה סטטית',63,'3X63',0.3],
  ['משרדי אתר',100,'3X100',0.7],
  ['משאבת ניקוז',16,'3X25',0.3],
  ['משאבת מים – הגברת לחץ',32,'3X40',0.7],
  ['עמדת עבודה',10,'3X63',0.3],
  ['טיח חוץ',32,'3X32',0.4],
  ['פיגום תלוי',63,'3X80',0.4],
  ['תאורת אתר כללית',null,'3X25',0.9,8],
  ['מכונת ריתוך',null,'3X32',0.5,12],
  ['סילו צמנט + מסוע חלזון',null,'3X25',0.7,11],
  ['שער, שמירה ומצלמות',16,'1X16',0.8]];
 CRANES.forEach(c=>PRESETS.push(['מנוף '+c[0],null,c[5],0.5,c[4]]));
 HOISTS.forEach(h=>PRESETS.push(['מעלית '+h[0],null,h[4],0.5,h[3]]));
 const preset=n=>PRESETS.find(p=>p[0]===String(n||'').trim());
 const num=v=>{const x=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(x)?x:0};

 /* ---- כללי ההערכה לפי מבנים ----
   עד 29 מ' – מנוף אחד לכל זוג בניינים.
   מעל 29 מ' – לכל בניין מנוף ומעלית חיצונית, וגם משאבת מים להגברת לחץ, משאבה סטטית ופיגום תלוי.
   לכל בניין: לוח משנה, עמדות עבודה לפי קומות וטיח חוץ.
   מרתף: לוח משנה חניון, עמדות עבודה ומשאבות ניקוז לפי קומות המרתף.
   לכל האתר: משרדי אתר, תאורת אתר, מכונת ריתוך, שער ושמירה. */
 const RULES={wsLow:1,wsLowMin:10,wsTall:2,wsBase:4};
 function row(n,q,b,note,V,PF){const p=preset(n)||[n,0,'',0.5];const a=p[1]!=null?p[1]:Math.round(kw2a(p[4],V,PF)*10)/10;return {n,q,a,brk:p[2],b,u:p[3],note:note||''}}
 function generate(inp,params){
  inp=inp||{};const P=Object.assign({},DEF,params||{});
  const blds=(inp.buildings||[]).map((b,i)=>({name:String(b.name||'').trim()||('בניין '+(i+1)),floors:Math.max(0,Math.round(num(b.floors))),tall:isTall(b)}));
  const boards=[{id:'b0',n:'לוח ראשי',p:''}],rows=[];let k=1;const nb=n=>{const id='b'+(k++);boards.push({id,n,p:'b0'});return id};
  const low=blds.filter(b=>!b.tall),tall=blds.filter(b=>b.tall);
  for(let i=0;i<low.length;i+=2){const pair=low.slice(i,i+2),id=nb('לוח מנוף '+(Math.floor(i/2)+1)+' – '+pair.map(b=>b.name).join(' + '));
   rows.push(row('מנוף צריח',1,id,'מנוף אחד ל'+(pair.length>1?'זוג בניינים עד 29 מ\'':'בניין עד 29 מ\''),P.V,P.PF));}
  tall.forEach(b=>{const id=nb('לוח מנוף – '+b.name);rows.push(row('מנוף צריח',1,id,'בניין מעל 29 מ\'',P.V,P.PF))});
  blds.forEach(b=>{const id=nb('לוח משנה – '+b.name);
   const ws=b.tall?Math.max(1,b.floors)*RULES.wsTall:Math.max(RULES.wsLowMin,(b.floors+1)*RULES.wsLow);
   rows.push(row('עמדת עבודה',ws,id,b.tall?RULES.wsTall+' עמדות לקומה':'עמדה לקומה, לפחות '+RULES.wsLowMin,P.V,P.PF));
   if(b.tall){rows.push(row('מעלית משא חיצונית',1,id,'בניין מעל 29 מ\'',P.V,P.PF));
    rows.push(row('משאבת מים – הגברת לחץ',1,id,'',P.V,P.PF));
    rows.push(row('משאבה סטטית',1,id,'יציקות בקומות גבוהות',P.V,P.PF));
    rows.push(row('פיגום תלוי',1,id,'',P.V,P.PF));}
   rows.push(row('טיח חוץ',1,id,'',P.V,P.PF));});
  const bf=Math.max(0,Math.round(num(inp.basementFloors)));
  if(bf>0){const id=nb('לוח משנה חניון');
   const r1=row('עמדת עבודה',bf*RULES.wsBase,id,RULES.wsBase+' עמדות לכל קומת מרתף',P.V,P.PF);r1.u=0.5;rows.push(r1);
   rows.push(row('משאבת ניקוז',bf+1,id,'',P.V,P.PF));}
  rows.push(row('משרדי אתר',1,'b0','מכולות משרדים',P.V,P.PF));
  rows.push(row('תאורת אתר כללית',1,'b0','',P.V,P.PF));
  rows.push(row('מכונת ריתוך',1,'b0','',P.V,P.PF));
  rows.push(row('שער, שמירה ומצלמות',1,'b0','',P.V,P.PF));
  return {boards,rows};
 }
 function isTall(b){if(b.tall!=null&&b.tall!=='')return b.tall===true||b.tall==='1'||b.tall==='yes';const h=num(b.height);return (h>0?h:num(b.floors)*2.9)>29}

 /* ---- חישוב ---- */
 const key=s=>String(s||'').trim().replace(/\s+/g,' ');
 const stepUp=(I,L)=>L.find(s=>I<=s+1e-9);
 function compute(state,params){
  const P=Object.assign({},DEF,params||{}),boards=state.boards,main=boards[0].id;
  const gf=n=>!P.useG?1:(n<=1?P.G[0]:n<=3?P.G[1]:n<=5?P.G[2]:P.G[3]);
  const bName=id=>{const b=boards.find(x=>x.id===id);return b?(b.n||'לוח ללא שם'):'—'};
  const cnt={};state.rows.forEach(r=>{const k=key(r.n);if(k)cnt[k]=(cnt[k]||0)+num(r.q)});
  const rows=state.rows.map(r=>{const g=gf(cnt[key(r.n)]||num(r.q));const b=boards.some(x=>x.id===r.b)?r.b:main;
   return Object.assign({},r,{b,q:num(r.q),a:num(r.a),u:num(r.u),g,t:num(r.q)*num(r.a)*num(r.u)*g,bn:bName(b)})});
  const own={},nc={};boards.forEach(b=>{own[b.id]=0;nc[b.id]=0});rows.forEach(r=>{own[r.b]+=r.t;nc[r.b]++});
  const tot={},sum=(id,d)=>{if(d>40)return 0;let s=own[id];boards.forEach(c=>{if(c.p===id&&c.id!==id)s+=sum(c.id,d+1)});return s};
  boards.forEach(b=>tot[b.id]=sum(b.id,0));
  const TA=tot[main],TD=TA*P.RS,conn=stepUp(TD,CONN)||CONN[CONN.length-1];
  const bo=boards.map((b,i)=>{const d=tot[b.id]*P.RS;return Object.assign({},b,{own:own[b.id],nc:nc[b.id],a:tot[b.id],d,brk:i===0?conn:(stepUp(d,STEPS)||2500)})});
  const c=n=>rows.filter(r=>key(r.n)===n||key(r.n).startsWith(n.split(' ')[0]+' ')&&n.split(' ')[0]!=='עמדת').reduce((s,r)=>s+r.q,0);
  return {P,rows,boards:bo,TA,TD,conn,size:'3X'+conn,over:TD>910,cranes:c('מנוף צריח'),hoists:c('מעלית משא חיצונית'),bName};
 }
 // המלצה מהירה: מבנים ← גודל חיבור זמני
 function recommend(inp,params){const st=generate(inp,params),r=compute(st,params);
  const parts=[];if(r.cranes)parts.push(r.cranes+' מנופים');if(r.hoists)parts.push(r.hoists+' מעליות חיצוניות');
  return {size:r.size,amps:r.conn,TA:r.TA,TD:r.TD,over:r.over,cranes:r.cranes,hoists:r.hoists,summary:parts.join(', '),state:st};}
 g.TTC={VER:'1',CRANES,HOISTS,STEPS,CONN,DEF,PRESETS,RULES,preset,kw2a,generate,compute,recommend,isTall};
})(typeof window!=='undefined'?window:globalThis);
