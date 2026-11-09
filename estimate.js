/* טיקטין – חשמל זמני לאתר בנייה: נתונים, כללי הערכה וחישוב משותפים.
   משמש את אפליקציית "תכנון חשמל זמני" ואת טופס פתיחת ההזמנות בחברת החשמל. */
(function(g){
 'use strict';
 // קטלוג מנופים ומעליות – מהאקסל "חשמל זמני לעבודה - חישוב" (גיליונות מנופים ומעליות).
 // חיבור מומלץ – לפי הזרם המחושב (kW, cosφ, ‏400V).
 // t: hammer / flat / luffing ; single / twin
 const CRANES=[
  {m:'Liebherr 110 EC-B 6',t:'flat',sub:'Flat-top',use:'בנייני מגורים, כמה מנופים סמוכים',load:'6 טון',hook:'~53 מ\' (~18 קומות)',mot:22,kw:30,pf:0.80,conn:'3X63',link:'https://www.lectura-specs.com/en/model/cranes/tower-cranes-trolley-boom-top-slewing-liebherr/110-ec-b-6-1049589',note:'מנוע הרמה 22kW מדף נתונים'},
  {m:'Comansa LCL165-8t',t:'luffing',sub:'Luffing (VFD)',use:'עיר צפופה, איסור חריגה מעל שכנים',load:'8 טון',hook:'~49.5 מ\' (~16 קומות)',mot:24,kw:35,pf:0.85,conn:'3X80',link:'https://www.bigge.com/crane-information/comansa-lcl165-8t/',note:'מנוע הרמה 24kW סטנדרט (אופציה 37/65kW)'},
  {m:'Liebherr 110 EC-B 6 FR.tronic',t:'flat',sub:'Flat-top (VFD)',use:'מגורים עם דרישת מהירות/עדינות',load:'6 טון',hook:'~46 מ\' (~15 קומות)',mot:30,kw:40,pf:0.85,conn:'3X80',link:'https://www.lectura-specs.com/en/model/cranes/tower-cranes-trolley-boom-top-slewing-liebherr/110-ec-b-6-fr-tronic-1049588',note:'מנוע הרמה 30kW מדף נתונים. VFD'},
  {m:'Potain MC 125',t:'hammer',sub:'Hammerhead',use:'בנייה כללית ותעשייה, טווח גדול',load:'6 טון',hook:'~60 מ\' (~20 קומות)',mot:33,kw:45,pf:0.80,conn:'3X100',link:'https://www.lectura-specs.com/en/model/cranes/tower-cranes-trolley-boom-top-slewing-potain/mc-125-11724735',note:'מנוע הרמה מוערך 33kW'},
  {m:'Potain MDT 219 J8',t:'flat',sub:'Flat-top (VFD)',use:'מגורים/מסחר בעיר, אתר צפוף',load:'8 טון',hook:'65 מ\' (~22 קומות)',mot:46,kw:60,pf:0.85,conn:'3X125',link:'https://www.bigge.com/crane-information/potain-mdt-219-j8/',note:'City range, VFD, מגביל הספק'},
  {m:'Comansa 21LC210',t:'flat',sub:'Flat-top',use:'בנייה כבדה, מבני מגורים גדולים',load:'18 טון',hook:'~64 מ\' (~21 קומות)',mot:45,kw:60,pf:0.80,conn:'3X125',link:'https://www.bigge.com/crane-information/comansa-21-lc-210/',note:'מנוע 60hp≈45kW סטנדרט'},
  {m:'Potain MR 160 C',t:'luffing',sub:'Luffing',use:'מגדלים בעיר, עבודה בין מבנים',load:'10 טון',hook:'~50 מ\' (~16 קומות)',mot:45,kw:60,pf:0.80,conn:'3X125',link:'https://www.lectura-specs.com/en/model/cranes/tower-cranes-trolley-boom-top-slewing-potain/mr-160-c-1138004',note:'10 טון, הגעה 51 מ\'. מנוע מוערך'},
  {m:'Potain MDT 219 J10',t:'flat',sub:'Flat-top (VFD)',use:'מבני מגורים/מסחר גבוהים',load:'10 טון',hook:'65 מ\' (~22 קומות)',mot:50,kw:65,pf:0.85,conn:'3X125',link:'https://www.bigge.com/crane-information/potain-mdt-219-j10/',note:'10 טון, וו 65 מ\', תורן 70.4 מ\''},
  {m:'Comansa 21LC335',t:'flat',sub:'Flat-top',use:'מגורים ומסחר – מהנפוצים בישראל',load:'12 עד 20 טון',hook:'~65 מ\' (~21 קומות)',mot:50,kw:65,pf:0.80,conn:'3X125',link:'https://www.comansa.com/en/21lc335-flat-top-crane',note:'הגעה 74 מ\''},
  {m:'Comansa LCL280-18t',t:'luffing',sub:'Luffing (VFD)',use:'מגדלים גבוהים, טיפוס פנימי בגרעין',load:'18 טון',hook:'~53 מ\' (~17 קומות)',mot:50,kw:70,pf:0.80,conn:'3X160',link:'https://www.bigge.com/crane-information/comansa-lcl280-18t/',note:'מנוע 50kW סטנדרט (אופציה 65kW)'},
  {m:'Comansa 21LC600 (20t)',t:'flat',sub:'Flat-top',use:'מגדלי מגורים גבוהים, זרוע ארוכה',load:'20 טון',hook:'~85 מ\' (~28 קומות)',mot:50,kw:70,pf:0.80,conn:'3X160',link:'https://www.comansa.com/en/21lc600-flat-top-crane',note:'מנוע 50kW סטנדרט. אופציה 110kW'},
  {m:'Comansa 21LC650 (25t)',t:'flat',sub:'Flat-top',use:'מגדלים גבוהים ופרויקטים כבדים',load:'25 טון',hook:'~85 מ\' (~28 קומות)',mot:65,kw:85,pf:0.80,conn:'3X160',link:'https://www.comansa.com/en/21lc650-flat-top-crane',note:'מנוע 65kW סטנדרט. אופציה 110kW'}];
 const HOISTS=[
  {m:'GEDA 500 Z/ZP',t:'single',mot:'1×~9 kW',use:'חומרים + אנשים, אתרים קטנים-בינוניים',load:'850 (אנשים) / 500',speed:'24 m/min',kw:9,pf:0.80,conn:'3X32',link:'https://www.geda.de/en/',note:'מעלית קלה. מנוע יחיד'},
  {m:'GEDA 1200 Z/ZP',t:'single',mot:'2×~11.5 kW',use:'חומרים ואנשים עד 150 מ\'',load:'1500',speed:'24 m/min',kw:23,pf:0.80,conn:'3X63',link:'https://www.lectura-specs.com/en/model/aerial-work-platform/industrial-hoists-geda/geda-1200-z-zp-11720806',note:'גובה עד 150 מ\''},
  {m:'Alimak SC45/30',t:'single',mot:'2×15 kW (VFC)',use:'מגורים ומסחר, גישה לאנשים וחומרים',load:'1500 עד 2000',speed:'30 m/min',kw:30,pf:0.85,conn:'3X63',link:'https://alimak.com/wp-content/uploads/2020/11/ALIMAK-SC-45-30-1540-EN-Aug-2020-1.pdf',note:'2 מנועים 15kW. VFC – זרם התנעה נמוך'},
  {m:'Alimak SC65/32',t:'single',mot:'3×11 kW',use:'תא בודד גבוה, מגדלי מגורים',load:'1500',speed:'32 עד 40 m/min',kw:33,pf:0.85,conn:'3X63',link:'https://www.alimak.com/',note:'3 מנועים 11kW. תא גדול'},
  {m:'Alimak SC45/30 (3 מנועים)',t:'single',mot:'3×15 kW',use:'גישה כבדה, תפוקה גבוהה',load:'2000',speed:'38 m/min',kw:45,pf:0.85,conn:'3X80',link:'https://alimak.com/',note:'גרסת 3 מנועים 15kW. הספק גבוה'},
  {m:'GEDA 1500 Z/ZP',t:'twin',mot:'2×2×~11.5 kW',use:'תא כפול, אתרים גבוהים ותפוקה כפולה',load:'2000',speed:'24 m/min',kw:46,pf:0.80,conn:'3X100',link:'https://www.geda.de/en/product/1500-zzp/',note:'תורן כפול, שני תאים עצמאיים'},
  {m:'Alimak SC65 Twin',t:'twin',mot:'2×(3×11) kW',use:'מגדלים גבוהים, שני תאים במקביל',load:'1500 לתא',speed:'32 m/min',kw:66,pf:0.85,conn:'3X125',link:'https://www.alimak.com/',note:'שני תאים × 33kW = 66kW מותקן'},
  {m:'Alimak SC200 Twin',t:'twin',mot:'2×(2×23) kW',use:'פרויקטים גדולים ומגדלים, עומס גבוה',load:'2000 לתא',speed:'40+ m/min',kw:92,pf:0.85,conn:'3X160',link:'https://www.alimak.com/',note:'תא כפול עתיר הספק. 2×46kW'}];
 const CTYPES={
  hammer:{n:'מנוף פטיש / ראש-חתול',en:'Hammerhead',img:'img/crane-hammerhead.png',d:'סימן היכר: המשולש (ראש-חתול) בראש התורן שממנו נמתחים כבלי מתיחה לזרוע האופקית. שימוש: בנייה כללית ותעשייה. חזק, טווח הגעה גדול ועומסים כבדים. דוגמה: Potain MC 125.'},
  flat:{n:'מנוף שטוח-ראש',en:'Flat-top / Topless',img:'img/crane-flattop.png',d:'סימן היכר: אין ראש-חתול. הזרוע וזרוע-הנגד ישרות ושטוחות לחלוטין. שימוש: בנייני מגורים – הנפוץ ביותר. הרכבה מהירה, מתאים לאתר צפוף עם כמה מנופים. דוגמאות: Comansa 21LC, Potain MDT, Liebherr EC-B.'},
  luffing:{n:'מנוף זרוע מתרוממת',en:'Luffing jib',img:'img/crane-luffing.png',d:'סימן היכר: הזרוע עולה ויורדת בזווית, לא אופקית קבועה. שימוש: בנייה עירונית צפופה ומגדלים. הזרוע לא חורגת מעל מגרשים שכנים. דוגמאות: Comansa LCL, Potain MR 160.'}};
 const HTYPES={
  single:{n:'תא בודד',en:'Single cage',img:'img/hoist-single.png',d:'תא אחד שנע על תורן מסילה מעוגן לבניין, מונע בגלגל שיניים על מסילה משוננת. הספק: אריזת מנועים 2×15 או 3×11 kW, כ-33 עד 45 kW מותקן. חיבור טיפוסי: 3X63A עד 3X80A. דוגמאות: Alimak SC45, GEDA 500.'},
  twin:{n:'תא כפול',en:'Twin cage',img:'img/hoist-twin.png',d:'שני תאים שנעים עצמאית על תורן משותף (או שני תרנים צמודים). מכפיל תפוקה באתרים גבוהים. הספק כפול בקירוב – שני התאים יכולים לנוע יחד. חיבור טיפוסי: 3X100A ומעלה. דוגמאות: Alimak SC65 twin, GEDA 1500 Z/ZP.'}};
 // מדרגות מפסק הזנה ללוחות, וגדלי חיבור זמני בחברת החשמל (3X40 עד 3X910)
 const STEPS=[16,20,25,32,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500];
 const CONN=[40,63,80,100,125,160,200,250,315,400,500,630,800,910];
 const DEF={V:400,PF:0.85,RS:1.25,useG:true,G:[1,0.9,0.85,0.8]};
 const kw2a=(kw,V,PF)=>kw*1000/(Math.sqrt(3)*(V||400)*(PF||0.85));
 // צרכנים מוכנים: [שם, זרם ליח' או null, מפסק, מקדם שימוש, הספק kW כשהזרם מחושב]
 const PRESETS=[
  ['מנוף צריח – בניין עד 29 מ\'',80,'3X80',0.5],
  ['מנוף צריח – בניין עד 42 מ\'',100,'3X100',0.5],
  ['מנוף צריח – בניין מעל 42 מ\'',160,'3X160',0.5],
  ['מעלית משא חיצונית',80,'3X80',0.5],
  ['משאבה סטטית',63,'3X63',0.1],
  ['משרדי אתר',25,'3X25',0.1],
  ['משאבת ניקוז',16,'3X25',0.1],
  ['משאבת מים – הגברת לחץ',32,'3X40',0.1],
  ['עמדת עבודה',10,'3X63',0.1],
  ['טיח חוץ',32,'3X32',0.1],
  ['פיגום תלוי',63,'3X80',0.1],
  ['תאורת אתר כללית',null,'3X25',0.1,8],
  ['מכונת ריתוך',null,'3X32',0.1,12],
  ['סילו צמנט + מסוע חלזון',null,'3X25',0.1,11],
  ['שער, שמירה ומצלמות',16,'1X16',0.1]];
 // זרם לדגם מהקטלוג – לפי ההספק הכולל ו-cosφ של הדגם, ‏400V
 const modelA=x=>Math.round(kw2a(x.kw,400,x.pf)*10)/10;
 CRANES.forEach(c=>PRESETS.push(['מנוף '+c.m,modelA(c),c.conn,0.5]));
 HOISTS.forEach(h=>PRESETS.push(['מעלית '+h.m,modelA(h),h.conn,0.5]));
 const preset=n=>PRESETS.find(p=>p[0]===String(n||'').trim());
 const num=v=>{const x=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(x)?x:0};

 /* ---- כללי ההערכה לפי מבנים ----
   עד 29 מ' – מנוף אחד לכל זוג בניינים (80A).
   מעל 29 מ' – לכל בניין מנוף (עד 42 מ' – 100A, מעל 42 מ' – 160A) ומעלית חיצונית (80A), וגם משאבת מים להגברת לחץ, משאבה סטטית ופיגום תלוי.
   לכל בניין: לוח משנה, עמדות עבודה לפי קומות וטיח חוץ.
   מרתף: לוח משנה חניון, עמדות עבודה ומשאבות ניקוז לפי קומות המרתף.
   לכל האתר: משרדי אתר, תאורת אתר, מכונת ריתוך, שער ושמירה.
   משרדי אתר: עד 2 בניינים עד 29 מ' – 3X25; יותר מ-2 בניינים או בניין מעל 29 מ' – 3X40; יותר מ-2 בניינים מעל 42 מ' – 3X63. */
 const RULES={wsLow:1,wsLowMin:10,wsTall:2,wsBase:4};
 function row(n,q,b,note,V,PF){const p=preset(n)||[n,0,'',0.1];const a=p[1]!=null?p[1]:Math.round(kw2a(p[4],V,PF)*10)/10;return {n,q,a,brk:p[2],b,u:p[3],note:note||''}}
 function generate(inp,params){
  inp=inp||{};const P=Object.assign({},DEF,params||{});
  const blds=(inp.buildings||[]).map((b,i)=>({name:String(b.name||'').trim()||('בניין '+(i+1)),floors:Math.max(0,Math.round(num(b.floors))),tall:isTall(b),cat:catOf(b)}));
  const boards=[{id:'b0',n:'לוח ראשי',p:''}],rows=[];let k=1;const nb=n=>{const id='b'+(k++);boards.push({id,n,p:'b0'});return id};
  const low=blds.filter(b=>!b.tall),tall=blds.filter(b=>b.tall);
  for(let i=0;i<low.length;i+=2){const pair=low.slice(i,i+2),id=nb('לוח מנוף '+(Math.floor(i/2)+1)+' – '+pair.map(b=>b.name).join(' + '));
   rows.push(row(CRANE_BY.low,1,id,pair.length>1?'מנוף אחד לזוג בניינים':'',P.V,P.PF));}
  tall.forEach(b=>{const id=nb('לוח מנוף – '+b.name);rows.push(row(CRANE_BY[b.cat],1,id,'',P.V,P.PF))});
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
   const r1=row('עמדת עבודה',bf*RULES.wsBase,id,RULES.wsBase+' עמדות לכל קומת מרתף',P.V,P.PF);rows.push(r1);
   rows.push(row('משאבת ניקוז',bf+1,id,'',P.V,P.PF));}
  {const nh=blds.filter(b=>b.cat==='high').length,oa=nh>2?63:((blds.length>2||tall.length)?40:25);const ro=row('משרדי אתר',1,'b0','מכולות משרדים',P.V,P.PF);ro.a=oa;ro.brk='3X'+oa;rows.push(ro);}
  rows.push(row('תאורת אתר כללית',1,'b0','',P.V,P.PF));
  rows.push(row('מכונת ריתוך',1,'b0','',P.V,P.PF));
  rows.push(row('שער, שמירה ומצלמות',1,'b0','',P.V,P.PF));
  return {boards,rows};
 }
 const CRANE_BY={low:'מנוף צריח – בניין עד 29 מ\'',mid:'מנוף צריח – בניין עד 42 מ\'',high:'מנוף צריח – בניין מעל 42 מ\''};
 const heightOf=b=>{const h=num(b.height);return h>0?h:num(b.floors)*2.9};
 function catOf(b){const h=heightOf(b);return h>42?'high':(h>29?'mid':'low')}
 function isTall(b){if(b.tall!=null&&b.tall!=='')return b.tall===true||b.tall==='1'||b.tall==='yes';const h=num(b.height);return (h>0?h:num(b.floors)*2.9)>29}

 /* ---- חישוב ---- */
 const key=s=>{s=String(s||'').trim().replace(/\s+/g,' ');return /^מנוף/.test(s)?'מנוף':(/^מעלית/.test(s)?'מעלית':s)};
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
  const c=n=>rows.filter(r=>key(r.n)===n).reduce((s,r)=>s+r.q,0);
  return {P,rows,boards:bo,TA,TD,conn,size:'3X'+conn,over:TD>910,cranes:c('מנוף'),hoists:c('מעלית'),bName};
 }
 // המלצה מהירה: מבנים ← גודל חיבור זמני
 function recommend(inp,params){const st=generate(inp,params),r=compute(st,params);
  const parts=[];if(r.cranes)parts.push(r.cranes===1?'מנוף אחד':r.cranes+' מנופים');if(r.hoists)parts.push(r.hoists===1?'מעלית חיצונית אחת':r.hoists+' מעליות חיצוניות');
  return {size:r.size,amps:r.conn,TA:r.TA,TD:r.TD,over:r.over,cranes:r.cranes,hoists:r.hoists,summary:parts.join(', '),state:st};}
 g.TTC={VER:'5',CRANES,HOISTS,CTYPES,HTYPES,modelA,catOf,STEPS,CONN,DEF,PRESETS,RULES,preset,kw2a,generate,compute,recommend,isTall};
})(typeof window!=='undefined'?window:globalThis);
