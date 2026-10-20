/* StemBudget v2: burgerpotjes, demo only. No tracking/network/storage beyond localStorage. */
(() => {
  'use strict';
  const STORE = 'stembudget-v2';
  const ROOT = 'https://www.rijksfinancien.nl';
  const DATA_URL = ROOT + '/overzicht-datasets';
  // These are understandable CIVIC choices, NOT verbatim official budget rows.
  // 'source' is a relevant 2027 budget chapter/fund; not a verified 1:1 expense mapping.
  const GROUPS = [
    {id:'wegen',title:'Wegen, bruggen & verkeer',desc:'Onderhoud en veilige bereikbaarheid',color:'#588b9b',avg:12,source:'A',items:[
      ['wegenonderhoud','Asfalt en wegenonderhoud','Onderhoud aan bestaande rijkswegen'],
      ['bruggen','Bruggen en viaducten','Inspectie, herstel en vervanging'],
      ['verkeersveiligheid','Veiligere kruispunten','Verkeersveiligheid en maatregelen op wegen'],
      ['fietsroutes','Fietsroutes en fietspaden','Nieuwe en veiligere verbindingen'],
      ['tunnels','Onderhoud van tunnels','Herstel en veiligheid van tunnels']]},
    {id:'ov',title:'Treinen, bussen & stations',desc:'Openbaar vervoer en spoor',color:'#668cbe',avg:8,source:'A',items:[
      ['spooronderhoud','Onderhoud aan spoor en wissels','Bestaande treinverbindingen onderhouden'],
      ['stations','Stations toegankelijk maken','Liften, perrons en bereikbaarheid'],
      ['treindienst','Betere treinverbindingen','Capaciteit en bereikbaarheid'],
      ['bussen','Busverbindingen','Bereikbaarheid met de bus, vaak regionaal'],
      ['overwegen','Veiligere spoorwegovergangen','Ongevallen voorkomen']]},
    {id:'huisarts',title:'Huisarts & ziekenhuis',desc:'Directe medische zorg',color:'#198f83',avg:14,source:'XVI',items:[
      ['huisartsen','Meer huisartsenzorg','Toegankelijke zorg bij de huisarts'],
      ['ziekenhuizen','Ziekenhuiszorg','Behandeling, operaties en acute zorg'],
      ['ggz','Psychische hulp','Geestelijke gezondheidszorg'],
      ['wachtlijsten','Wachttijden in de zorg','Minder lang wachten op passende zorg'],
      ['preventie','Voorkomen van ziekte','Vaccinaties, preventie en leefstijl']]},
    {id:'ouderenzorg',title:'Ouderenzorg & ondersteuning',desc:'Hulp wanneer zelfstandig leven lastig is',color:'#44a79b',avg:10,source:'XVI',items:[
      ['wijkzorg','Thuiszorg en wijkverpleging','Zorg aan huis'],
      ['verpleeghuis','Verpleeghuizen','Langdurige verpleegzorg'],
      ['mantelzorg','Ondersteuning mantelzorgers','Hulp voor mensen die anderen verzorgen'],
      ['gehandicaptenzorg','Ondersteuning bij beperkingen','Langdurige zorg en begeleiding']]},
    {id:'school',title:'Scholen & opleidingen',desc:'Van basisschool tot beroepsonderwijs',color:'#478bb7',avg:12,source:'VIII',items:[
      ['basisschool','Basisscholen','Onderwijs voor kinderen'],
      ['leraren','Leraren en onderwijsondersteuning','Personeel en onderwijsbegeleiding'],
      ['schoolgebouwen','Veilige schoolgebouwen','Onderhoud, ventilatie en voorzieningen'],
      ['mbo','Mbo en vakopleidingen','Opleiden voor praktische beroepen'],
      ['hogeronderwijs','Hogescholen en universiteiten','Hoger onderwijs en kennis']]},
    {id:'wonen',title:'Woningen & buurten',desc:'Woonruimte, bouw en betaalbaarheid',color:'#897cc5',avg:9,source:'XXII',items:[
      ['betaalbaar','Betaalbare huurwoningen','Meer sociale en betaalbare huur'],
      ['nieuwbouw','Nieuwe woningen bouwen','Woningbouw en bereikbare locaties'],
      ['verduurzamen-woningen','Woningen energiezuiniger maken','Renovatie van woningen'],
      ['buurtvoorzieningen','Leefbare buurten','Voorzieningen en openbare ruimte, vaak gemeentelijk']]},
    {id:'natuur',title:'Bossen, natuur & dieren',desc:'Natuurbeheer los van energiebeleid',color:'#6d9d68',avg:5,source:'XIV',items:[
      ['bosbeheer','Onderhoud van bossen','Bosbeheer en bescherming'],
      ['bosaanplant','Nieuwe bossen aanplanten','Bossenstrategie en uitbreiding'],
      ['natuurherstel','Beschermde natuur herstellen','Herstel van natuurgebieden'],
      ['biodiversiteit','Meer planten en dieren beschermen','Biodiversiteit en leefgebieden'],
      ['dierenwelzijn','Dierenwelzijn','Bescherming en welzijn van dieren']]},
    {id:'energie',title:'Energievoorziening',desc:'Betrouwbare en betaalbare energie',color:'#c69d54',avg:5,source:'XXIII',items:[
      ['isolatie','Isolatie van woningen','Minder energie nodig in woningen'],
      ['stroomnet','Het stroomnet uitbreiden','Elektriciteitsnet en aansluitingen'],
      ['zonneenergie','Zonne-energie','Opwek van zonne-energie'],
      ['windenergie','Windenergie','Opwek van windenergie'],
      ['kernenergie','Kernenergie','Voorbereiding en ontwikkeling kernenergie']]},
    {id:'klimaat',title:'Klimaat & vervuiling',desc:'Uitstoot, vervuiling en verandering van klimaat',color:'#74a79e',avg:4,source:'XXIII',items:[
      ['co2','Uitstoot verminderen','Maatregelen voor minder broeikasgassen'],
      ['industrie','Vervuiling door industrie beperken','Aanpakken van uitstoot en vervuiling'],
      ['duurzamebedrijven','Schoner produceren','Verduurzaming van productie en industrie'],
      ['milieumetingen','Luchtkwaliteit meten','Meten van luchtkwaliteit en milieu']]},
    {id:'water',title:'Water, dijken & rivieren',desc:'Droge voeten en schoon water',color:'#4f9cb3',avg:5,source:'J',items:[
      ['dijken','Dijken versterken','Bescherming tegen overstromingen'],
      ['rivieren','Rivieren en waterafvoer','Ruimte voor en onderhoud aan waterwegen'],
      ['drinkwater','Schoon drinkwater','Bescherming van drinkwaterbronnen'],
      ['waterkwaliteit','Schoon water in sloten en rivieren','Verbeteren van waterkwaliteit']]},
    {id:'veiligheid',title:'Politie, brandweer & recht',desc:'Veiligheid en rechtsbescherming',color:'#b47d75',avg:6,source:'VI',items:[
      ['politie','Politie op straat','Politie en handhaving'],
      ['brandweer','Brandweer en hulpdiensten','Vaak gemeentelijke en regionale financiering'],
      ['rechtspraak','Rechtspraak','Rechters en rechtbanken'],
      ['slachtoffers','Slachtofferhulp','Hulp bij geweld en misdrijven']]},
    {id:'inkomen',title:'Pensioen, uitkeringen & hulp',desc:'Financiële zekerheid en ondersteuning',color:'#c58288',avg:6,source:'XV',items:[
      ['aow','AOW en ouderdomsvoorzieningen','Inkomen na de pensioenleeftijd'],
      ['arbeidsongeschikt','Hulp bij arbeidsongeschiktheid','Uitkeringen bij niet kunnen werken'],
      ['werkloos','Hulp bij werkloosheid','Werkloosheidsregelingen'],
      ['kindregelingen','Ondersteuning gezinnen','Kinderbijslag en kindregelingen'],
      ['schuldhulp','Schuldhulp en begeleiding','Hulp bij problematische schulden, vaak lokaal']]},
    {id:'gezinnen',title:'Kinderen, opvang & jeugdhulp',desc:'Hulp en voorzieningen voor kinderen en ouders',color:'#a68ec1',avg:3,source:'XVI',items:[
      ['kinderopvang','Kinderopvang','Opvang en betaalbaarheid, mede via toeslagen'],
      ['jeugdhulp','Jeugdzorg en jeugdhulp','Zorg en begeleiding voor jongeren'],
      ['kinderveiligheid','Bescherming van kinderen','Hulp bij onveiligheid thuis'],
      ['gezinsbegeleiding','Begeleiding van gezinnen','Steun bij opvoeden en ontwikkelen']]},
    {id:'landbouw',title:'Boeren, voedsel & visserij',desc:'Hoe we ons voedsel produceren',color:'#9caa63',avg:3,source:'XIV',items:[
      ['boeren','Hulp voor boeren','Begeleiding en regelingen voor de landbouw'],
      ['biologisch','Biologische landbouw','Overstappen naar biologische productie'],
      ['bodem','Gezonde landbouwgrond','Bodemkwaliteit en water rond boerderijen'],
      ['voedselveiligheid','Veilig voedsel','Toezicht op productie en kwaliteit'],
      ['visserij','Visserij en vissershavens','Visserijbeleid en verduurzaming']]},
    {id:'opvang',title:'Asiel, opvang & inburgering',desc:'Aanvragen, opvang en begeleiding',color:'#ae877b',avg:2,source:'XX',items:[
      ['asielopvang','Opvang van asielzoekers','Onderdak en eerste voorzieningen'],
      ['asielaanvragen','Asielaanvragen beoordelen','Afhandeling van asielprocedures'],
      ['inburgering','Nederlands leren en inburgeren','Begeleiding van nieuwkomers'],
      ['terugkeer','Terugkeer en vertrek','Begeleiding bij terugkeer']]},
    {id:'defensie',title:'Krijgsmacht & bescherming',desc:'Militairen, veiligheid en materieel',color:'#75889c',avg:7,source:'X',items:[
      ['defensiepersoneel','Militairen en trainingen','Personeel, opleiding en oefeningen'],
      ['defensiematerieel','Militair materieel','Materieel en onderhoud'],
      ['cyberdefensie','Digitale verdediging','Bescherming tegen cyberaanvallen'],
      ['missies','Militaire missies','Deelname aan internationale operaties'],
      ['veteranen','Hulp voor veteranen','Ondersteuning na militaire dienst']]},
    {id:'overig',title:'Overige publieke voorzieningen',desc:'Diensten en taken die ook geld kosten',color:'#9b93a6',avg:4,source:'VIII',items:[
      ['bibliotheken','Bibliotheken','Leesvoorzieningen, vaak gemeentelijk'],
      ['sport','Sportverenigingen en bewegen','Sport en sportvoorzieningen'],
      ['cultuur','Musea, kunst en cultuur','Culturele voorzieningen'],
      ['buitenland','Ontwikkelingssamenwerking','Internationale hulp en ontwikkeling'],
      ['rijk-uitvoering','Belastingdienst en overheidsuitvoering','Administratie en uitvoering van publieke taken']]}
  ];
  const SOURCES = {buitenland:'XVII', sport:'XVI', 'rijk-uitvoering':'IX', bibliotheken:'VIII'};
  const ALL_ITEMS = GROUPS.flatMap(g => g.items.map(([id,title,desc])=>({id,title,desc,group:g.id,source:SOURCES[id]||g.source})));
  const IDS = [...GROUPS.map(g=>'alg-'+g.id),...ALL_ITEMS.map(i=>i.id)];
  const ITEM_BY_ID = Object.fromEntries(ALL_ITEMS.map(x=>[x.id,x]));
  const SAMPLE = {
    'wegenonderhoud':8,'bruggen':4,'spooronderhoud':5,'stations':3,'huisartsen':6,'ziekenhuizen':8,
    'wijkzorg':4,'verpleeghuis':6,'basisschool':5,'leraren':4,'mbo':3,'betaalbaar':5,'nieuwbouw':4,
    'bosbeheer':2,'natuurherstel':3,'isolatie':3,'stroomnet':2,'co2':2,'industrie':2,
    'dijken':3,'waterkwaliteit':2,'politie':4,'rechtspraak':2,'aow':3,'kindregelingen':3,
    'bibliotheken':1,'sport':1,'rijk-uitvoering':1,'kinderopvang':3,'biologisch':2,'asielopvang':2,'defensiepersoneel':3
  };
  // Check total below; synthetic profile is never described as real respondents.
  const DEMO = normalize(SAMPLE);
  const PLANS = [
    {id:'p1',theme:'wijkzorg',title:'Meer wijkverpleegkundigen',desc:'Fictief voorbeeld: extra thuiszorgteams.',asked:25,covered:18},
    {id:'p2',theme:'schoolgebouwen',title:'Basisscholen opknappen',desc:'Fictief voorbeeld: ventilatie en herstel van scholen.',asked:18,covered:18},
    {id:'p3',theme:'betaalbaar',title:'Betaalbare huurwoningen',desc:'Fictief voorbeeld: extra sociale huurwoningen.',asked:40,covered:12},
    {id:'p4',theme:'bruggen',title:'Versleten brug vernieuwen',desc:'Fictief voorbeeld: een brug veilig vervangen.',asked:12,covered:7},
    {id:'p5',theme:'isolatie',title:'Isolatie voor huurwoningen',desc:'Fictief voorbeeld: oudere woningen isoleren.',asked:16,covered:6},
    {id:'p6',theme:'bosaanplant',title:'Nieuwe bossen planten',desc:'Fictief voorbeeld: uitbreiding van bosgebied.',asked:9,covered:3}
  ];
  const REASONS = [['basisvoorzieningen','Goede basisvoorzieningen'],['toekomst','Investeren in de toekomst'],['rechtvaardigheid','Een eerlijke verdeling'],['veiligheid','Veiligheid en zekerheid'],['keuzevrijheid','Meer individuele keuzevrijheid'],['liever-niet','Liever niet zeggen']];
  function normalize(raw) { const sum = Object.values(raw).reduce((a,b)=>a+b,0); return Object.fromEntries(Object.entries(raw).map(([k,v])=>[k, sum ? v*100/sum : 0])); }
  function zero() { return Object.fromEntries(IDS.map(id=>[id,0])); }
  function isValid(a) { return a && typeof a==='object' && IDS.every(id => Number.isInteger(a[id]) && a[id]>=0 && a[id]<=100) && total(a)<=100; }
  function total(a) { return IDS.reduce((n,id)=>n+(Number(a?.[id])||0),0); }
  function groupTotal(a,g) { return (a['alg-'+g.id]||0)+g.items.reduce((n,i)=>n+(a[i[0]]||0),0); }
  function groupDemo(g) { return (DEMO['alg-'+g.id]||0)+g.items.reduce((n,i)=>n+(DEMO[i[0]]||0),0); }
  function load() {try {return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{return {};}}
  const old = load();
  const state = {allocation:isValid(old.allocation)?old.allocation:zero(), vote:isValid(old.vote)&&total(old.vote)===100?old.vote:null, research:old.research||null, plans:Array.isArray(old.plans)?old.plans.filter(p=>p&&typeof p.title==='string'&&ITEM_BY_ID[p.theme]).slice(-10):[], endorsements:old.endorsements||{}, filter:'alle', formOpen:false, expanded:new Set(), search:'', resultMode:'groep'};
  const page=document.getElementById('inhoud');
  function esc(x) {return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function fmt(n) {return Number(n).toLocaleString('nl-NL',{maximumFractionDigits:1});}
  function save() {try {localStorage.setItem(STORE,JSON.stringify({allocation:state.allocation,vote:state.vote,research:state.research,plans:state.plans,endorsements:state.endorsements}));}catch{toast('Bewaren in deze browser is niet mogelijk.');}}
  function themeFor(id) {const i=ITEM_BY_ID[id];return GROUPS.find(g=>g.id===(i?.group||id))||GROUPS[0];}
  function sourceFor(id) { const item=ITEM_BY_ID[id];return ROOT+'/memorie-van-toelichting/2027/OWB/'+(item?.source||GROUPS.find(g=>g.id===id)?.source||'A'); }
  function sourceLink(id,txt='Officiële bron ↗') {return `<a class="official-link" target="_blank" rel="noopener noreferrer" href="${sourceFor(id)}">${txt}</a>`;}
  function route(){const r=location.hash.slice(1).split('?')[0];return ['verdelen','uitslagen','plannen','onderzoek'].includes(r)?r:'verdelen';}
  function donut(a,rest='#e6efec'){let pos=0;const parts=[];for(const g of GROUPS){const start=pos;pos+=groupTotal(a,g);parts.push(`${g.color} ${start}% ${pos}%`);}if(pos<100)parts.push(`${rest} ${pos}% 100%`);return `background:conic-gradient(${parts.join(',')})`;}
  function toast(message){const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>el.classList.remove('show'),2900);}
  function hero() {return `<section class="hero" aria-labelledby="hero-title"><div><div class="eyebrow">Zelf kiezen waar publiek geld naartoe gaat</div><h1 id="hero-title">Welk potje krijgt jouw <em>stem?</em></h1><p>Asfalt onderhouden? Meer huisartsen? Nieuwe bossen? Geef 100 punten aan dingen die je belangrijk vindt. Kies een heel onderwerp of ga helemaal naar de details.</p><div class="hero-actions"><a href="#budget" class="btn btn-main">Verdeel je punten <span class="arrow">↗</span></a><a href="#uitslagen" class="btn btn-alt">Bekijk de uitslag</a></div><span class="small-note">Burgerexperiment · geen bindende belastingstemming</span></div><div class="hero-visual"><div class="visual-top">JOUW STEM IN 100 PUNTEN</div><div class="donut" style="${donut(DEMO)}"><div class="donut-inner"><strong>100</strong><span>budgetpunten</span></div></div><div class="visual-bottom"><span>Grote onderwerpen<br><strong>of kleine potjes</strong></span><span class="visual-pill">Jij kiest</span></div></div></section>
  <section class="explain-strip"><div class="explain-item"><div class="round-icon">01</div><div><strong>Kies een onderwerp</strong><span>Bijvoorbeeld wegen en bruggen.</span></div></div><div class="explain-item"><div class="round-icon">02</div><div><strong>Maak het concreet</strong><span>Bijvoorbeeld bruggen onderhouden.</span></div></div><div class="explain-item"><div class="round-icon">03</div><div><strong>Vergelijk de keuzes</strong><span>Zie je eigen verdeling naast de demo.</span></div></div></section>`;}
  function stepper(id,title,v,left){const g=ITEM_BY_ID[id] ? themeFor(id):GROUPS.find(x=>id==='alg-'+x.id);const c=g?.color||'#1f847a';return `<div class="point-input"><div class="range-wrap"><input data-range="${id}" aria-label="Punten voor ${esc(title)}" class="range" type="range" min="0" max="${v+left}" step="1" value="${v}" style="--p:${v}%;--fill:${c}"></div><div class="stepper"><button type="button" data-dec="${id}" aria-label="Minder punten voor ${esc(title)}" ${v===0?'disabled':''}>−</button><button type="button" data-inc="${id}" aria-label="Meer punten voor ${esc(title)}" ${left===0?'disabled':''}>+</button></div></div>`;}
  function groupCard(g,left){const subTotal=groupTotal(state.allocation,g);const parentId='alg-'+g.id;const matches=state.search && (g.title+' '+g.desc+' '+g.items.map(i=>i[1]+' '+i[2]).join(' ')).toLowerCase().includes(state.search.toLowerCase());if(state.search && !matches)return '';
    const forcedOpen=!!state.search;const expanded=forcedOpen||state.expanded.has(g.id);
    const childRows=g.items.filter(i=>!state.search||(g.title+' '+g.desc).toLowerCase().includes(state.search.toLowerCase())||(i[1]+' '+i[2]).toLowerCase().includes(state.search.toLowerCase())).map(([id,title,desc])=>`<div class="sub-row"><div class="sub-head"><div><strong>${esc(title)}</strong><small>${esc(desc)}</small></div><b data-val="${id}">${state.allocation[id]} pt</b></div>${stepper(id,title,state.allocation[id],left)}</div>`).join('');
    return `<article class="panel group-card" style="--category:${g.color}"><div class="group-header"><button type="button" class="group-toggle" data-toggle="${g.id}" aria-expanded="${expanded}"><span class="group-bullet" style="background:${g.color}"></span><span class="group-names"><strong>${esc(g.title)}</strong><small>${esc(g.desc)}</small></span><span class="group-total" data-group-total="${g.id}">${subTotal} pt</span><span class="chevron">⌄</span></button></div>
    <div class="group-content" ${expanded?'':'hidden'}><p class="group-tip">Weet je nog niet welk onderdeel? Geef je punten aan de hele groep.</p><div class="sub-row general"><div class="sub-head"><div><strong>Algemeen voor ${esc(g.title.toLowerCase())}</strong><small>Je laat de precieze verdeling binnen dit onderwerp open</small></div><b data-val="${parentId}">${state.allocation[parentId]} pt</b></div>${stepper(parentId,'algemeen '+g.title,state.allocation[parentId],left)}</div><div class="sub-items">${childRows}</div><div class="group-source">Indeling in burgertaal · ${sourceLink(g.id,'Bekijk verwant begrotingshoofdstuk 2027 ↗')}</div></div></article>`;}
  function budgetView(){const assigned=total(state.allocation),left=100-assigned;const visible=GROUPS.map(g=>groupCard(g,left)).filter(Boolean).join('');return `${hero()}<section id="budget" class="section-head"><div><div class="section-kicker">01 — Verdeel zelf het budget</div><h2>Van onderwerp tot concreet potje</h2><p>Je kunt een heel onderwerp steunen, of het openklappen en op specifieke onderdelen stemmen. Alle punten samen tellen tot 100.</p></div></section>
   <div class="civic-search"><label for="potje-search">Zoek een potje</label><input id="potje-search" type="search" placeholder="Bijv. wegenonderhoud, bos, isolatie…" value="${esc(state.search)}"/><span>${GROUPS.length} onderwerpen · ${ALL_ITEMS.length} concrete potjes</span></div>
   <div class="allocation-layout"><div class="group-list"><div class="group-help"><span>Druk op een onderwerp om de potjes te zien</span><div><button id="openall" class="text-control">Alles openen</button><button id="closeall" class="text-control">Alles sluiten</button></div></div>${visible||'<div class="panel empty-state">Geen potjes gevonden. Probeer een andere zoekterm.</div>'}</div>
   <aside class="panel balance-card budget-sidebar"><div class="label">Nog te verdelen</div><div class="balance-num" id="remaining">${left}<small> / 100 punten</small></div><div class="track"><span id="progress" style="width:${assigned}%"></span></div><p class="balance-msg" id="balance-message">${left===0?'Je hebt alles verdeeld.':`Je kunt nog ${left} punten verdelen.`}</p><button id="vote" class="btn btn-main full" ${left!==0?'disabled':''}>${state.vote?'Mijn stem wijzigen':'Mijn verdeling vastleggen'} →</button>${state.vote?'<p class="success-msg">Er staat al een demostem op dit apparaat.</p>':''}
   <div class="sidebar-actions"><button id="clear" class="btn btn-ghost btn-sm">Wis alles</button><button id="sample" class="btn btn-ghost btn-sm">Probeer voorbeeld</button></div><hr><h3>Jouw verdeling</h3><div id="mini-allocation">${miniAllocation()}</div><hr><p>De stemmen blijven op dit apparaat. We tonen alleen fictieve voorbeeldresultaten.</p></aside></div>
   <div class="demodata"><strong>Transparantie:</strong> de potjes zijn begrijpelijke omschrijvingen, geen letterlijke begrotingsregels. Bekijk de <a href="${DATA_URL}" target="_blank" rel="noopener">open begrotingsdata 2027</a>. Een exacte koppeling aan bedragen per subpotje wordt nog ontwikkeld. De huidige punten zijn niet gekoppeld aan euro's.</div>`;}
  function miniAllocation(){const selected=GROUPS.map(g=>({g,n:groupTotal(state.allocation,g)})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);return selected.length?selected.map(({g,n})=>`<div class="mini-row"><span><i style="background:${g.color}"></i>${esc(g.title)}</span><b>${n} pt</b></div>`).join(''):'<p class="empty-hint">Nog geen potjes gekozen.</p>';}
  function refreshBudget(){const left=100-total(state.allocation);page.querySelectorAll('[data-range]').forEach(el=>{const v=state.allocation[el.dataset.range];el.max=v+left;el.value=v;el.style.setProperty('--p',v+'%');});page.querySelectorAll('[data-dec]').forEach(b=>b.disabled=state.allocation[b.dataset.dec]===0);page.querySelectorAll('[data-inc]').forEach(b=>b.disabled=left===0);page.querySelectorAll('[data-val]').forEach(el=>el.textContent=state.allocation[el.dataset.val]+' pt');page.querySelectorAll('[data-group-total]').forEach(el=>el.textContent=groupTotal(state.allocation,GROUPS.find(g=>g.id===el.dataset.groupTotal))+' pt');document.getElementById('remaining').innerHTML=left+'<small> / 100 punten</small>';document.getElementById('progress').style.width=(100-left)+'%';document.getElementById('balance-message').textContent=left===0?'Je hebt alles verdeeld.':`Je kunt nog ${left} punten verdelen.`;document.getElementById('vote').disabled=left!==0;document.getElementById('mini-allocation').innerHTML=miniAllocation();save();}
  function setPoints(id,n){if(!IDS.includes(id))return;const old=state.allocation[id],free=100-total(state.allocation);state.allocation[id]=Math.max(0,Math.min(100,Math.trunc(Number(n)||0),old+free));refreshBudget();}
  function bindBudget(){page.addEventListener('input',e=>{if(e.target.matches('[data-range]'))setPoints(e.target.dataset.range,e.target.value);});page.addEventListener('click',e=>{let b=e.target.closest('[data-inc],[data-dec],[data-toggle]');if(!b)return;if(b.dataset.inc){setPoints(b.dataset.inc,state.allocation[b.dataset.inc]+1);return;}if(b.dataset.dec){setPoints(b.dataset.dec,state.allocation[b.dataset.dec]-1);return;}if(b.dataset.toggle){const g=b.dataset.toggle;state.expanded.has(g)?state.expanded.delete(g):state.expanded.add(g);const el=b.closest('.group-card').querySelector('.group-content');el.hidden=!el.hidden;b.setAttribute('aria-expanded',String(!el.hidden));}});
    document.getElementById('potje-search').addEventListener('input',e=>{const val=e.target.value;state.search=val; // preserve focus/caret by updating only list
      const list=page.querySelector('.group-list');const cur=GROUPS.map(g=>groupCard(g,100-total(state.allocation))).filter(Boolean).join('');list.innerHTML=`<div class="group-help"><span>Druk op een onderwerp om de potjes te zien</span><div><button id="openall" class="text-control">Alles openen</button><button id="closeall" class="text-control">Alles sluiten</button></div></div>${cur||'<div class="panel empty-state">Geen potjes gevonden.</div>'}`;
    });
    page.addEventListener('click',e=>{if(e.target.id==='openall'||e.target.id==='closeall'){const shouldOpen=e.target.id==='openall';state.expanded=new Set(shouldOpen?GROUPS.map(g=>g.id):[]);page.querySelectorAll('.group-card').forEach(el=>{el.querySelector('.group-content').hidden=!shouldOpen;el.querySelector('.group-toggle').setAttribute('aria-expanded',String(shouldOpen));});}});
    document.getElementById('clear').addEventListener('click',()=>{state.allocation=zero();refreshBudget();toast('Alles gewist.');});
    document.getElementById('sample').addEventListener('click',()=>{const picks=Object.entries(DEMO).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);state.allocation=zero();let used=0;for(const [id,value] of picks){const n=Math.floor(value);state.allocation[id]=n;used+=n;}const remainders=picks.map(([id,value])=>({id,part:value-Math.floor(value)})).sort((a,b)=>b.part-a.part);for(let n=0;n<100-used;n++)state.allocation[remainders[n].id]++;state.search='';state.expanded=new Set(GROUPS.map(g=>g.id));render();toast('Voorbeeldverdeling ingevuld.');});
    document.getElementById('vote').addEventListener('click',()=>{if(total(state.allocation)!==100)return;state.vote={...state.allocation};save();location.hash='#uitslagen';toast('Jouw demostem is lokaal opgeslagen.');});
  }
  function resultsView(){const selected=state.vote||state.allocation;const isGroup=state.resultMode==='groep';const rows=isGroup?GROUPS.map(g=>({id:g.id,title:g.title,color:g.color,v:groupDemo(g),you:groupTotal(selected,g)})):[...ALL_ITEMS.map(i=>({id:i.id,title:i.title,color:themeFor(i.id).color,v:DEMO[i.id]||0,you:selected[i.id]||0})),...GROUPS.map(g=>({id:'alg-'+g.id,title:'Algemeen: '+g.title,color:g.color,v:DEMO['alg-'+g.id]||0,you:selected['alg-'+g.id]||0}))].filter(x=>x.v||x.you);
  rows.sort((a,b)=>b.v-a.v||a.title.localeCompare(b.title,'nl'));
  return `<section class="section-top"><div class="section-kicker">02 — Vergelijk de verdeling</div><h1>Waar gaan de punten naartoe?</h1><p class="lead">Bekijk de verdeling per onderwerp of zoom in op de concrete potjes.</p></section><div class="data-notice"><strong>Demonstratie, geen uitslag van echte burgers.</strong> De voorbeeldcijfers vormen één fictief profiel. Jouw punten worden niet naar een server gestuurd en beïnvloeden geen openbare telling.</div>
  <div class="summary-grid"><div class="panel metric"><span class="metric-name">Vergelijking</span><strong>1 demo</strong><small>Fictieve voorbeeldverdeling</small></div><div class="panel metric"><span class="metric-name">Te verdelen</span><strong>100 pt</strong><small>Per persoon evenveel</small></div><div class="panel metric"><span class="metric-name">Concrete potjes</span><strong>${ALL_ITEMS.length}</strong><small>Onder ${GROUPS.length} onderwerpen</small></div></div>
  <div class="result-switch" role="group" aria-label="Detailniveau uitslagen"><button data-result-mode="groep" class="${isGroup?'active':''}">Onderwerpen</button><button data-result-mode="detail" class="${!isGroup?'active':''}">Concrete potjes</button></div>
  <div class="results-layout"><div class="panel result-panel"><h3>Fictieve verdeling</h3><p>Donkere balk: demo. Lichte balk: jouw ${state.vote?'vastgelegde':'huidige'} verdeling.</p><div class="legend"><span><i></i>Demo</span><span><i class="yours"></i>Jij</span></div>${rows.map(r=>`<div class="result-row"><div class="result-title"><span>${esc(r.title)}</span><span>${fmt(r.v)}%</span></div><div class="result-track"><span style="width:${r.v}%"></span></div><div class="result-track mine"><span style="width:${r.you}%"></span></div><div class="compare">Jij: ${fmt(r.you)} punten</div></div>`).join('')||'<p>Er zijn nog geen gegevens.</p>'}</div>
  <aside class="panel right-panel"><h3>Jouw budget</h3><p>${total(selected)} van de 100 punten verdeeld</p><div class="donut" style="${donut(selected)}"><div class="donut-inner"><strong>${total(selected)}</strong><span>punten</span></div></div><div class="key-list">${GROUPS.filter(g=>groupTotal(selected,g)>0).map(g=>`<div class="key-item"><span><i class="cat-dot" style="background:${g.color}"></i>${esc(g.title)}</span><b>${groupTotal(selected,g)} pt</b></div>`).join('')||'<p>Geen punten verdeeld.</p>'}</div><hr class="soft-divider"><a href="#verdelen" class="btn btn-alt full">${state.vote?'Wijzig mijn verdeling':'Verdeel punten'}</a></aside></div>`;}
  function planCard(p){const g=themeFor(p.theme),covered=Number(p.covered)||0,gap=Math.max(0,p.asked-covered);return `<article class="panel plan-card"><div class="plan-top"><span class="plan-cat"><i class="cat-dot" style="background:${g.color}"></i>${esc(ITEM_BY_ID[p.theme]?.title||g.title)}</span><span class="plan-state ${gap===0?'covered':''}">${gap===0?'Fictief gedekt':'Fictief tekort'}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><div class="plan-moneys"><div><span>Gevraagd (voorbeeld)</span><b>€ ${fmt(p.asked)} mln</b></div><div><span>Beschikbaar (voorbeeld)</span><b>€ ${fmt(covered)} mln</b></div></div><div class="coverage-bar"><span style="width:${Math.min(100,100*covered/p.asked)}%"></span></div><div class="plan-bottom"><small>${gap===0?'Gedekt in dit voorbeeld':`Voorbeeldtekort: € ${fmt(gap)} mln`}</small><button data-support="${esc(p.id)}" class="btn btn-alt btn-sm">${state.endorsements[p.id]?'Steun opgeslagen':'Ik steun dit'}</button></div></article>`;}
  function plansView(){const all=[...PLANS,...state.plans],shown=state.filter==='alle'?all:all.filter(p=>p.theme===state.filter||themeFor(p.theme).id===state.filter);return `<section class="section-top"><div class="section-kicker">03 — Concrete voorstellen</div><h1>Wat kost een plan?</h1><p class="lead">Van een brug opknappen tot nieuwe bossen aanplanten. Kijk naar het bedrag dat een voorstel nodig heeft.</p></section><div class="data-notice"><strong>Fictieve scenario's.</strong> De bedragen, dekkingen en voorstellen hieronder zijn niet afkomstig uit de overheidsbegroting en zijn geen echte projecten.</div><div class="section-head" style="margin-top:33px"><div><h2>Plannen en potjes</h2><p>Ook een eigen voorstel kan aan een concreet potje worden gekoppeld.</p></div><div class="add-plan"><select id="plan-filter" aria-label="Filter op potje"><option value="alle">Alle potjes</option>${GROUPS.map(g=>`<option value="${g.id}" ${g.id===state.filter?'selected':''}>${esc(g.title)}</option>`).join('')}</select><button id="toggle-plan" class="btn btn-main btn-sm">${state.formOpen?'Sluiten':'+ Nieuw plan'}</button></div></div>
  ${state.formOpen?`<form id="new-plan" class="panel form-panel"><h3>Voeg een voorbeeldvoorstel toe</h3><p>Je eigen plan blijft uitsluitend op dit apparaat staan.</p><div class="field-group"><div class="field"><label for="new-title">Naam van het plan</label><input id="new-title" name="title" maxlength="85" required placeholder="Bijv. Brug herstellen"></div><div class="field"><label for="new-theme">Concreet potje</label><select id="new-theme" name="theme">${GROUPS.map(g=>`<optgroup label="${esc(g.title)}">${g.items.map(([id,title])=>`<option value="${id}">${esc(title)}</option>`).join('')}</optgroup>`).join('')}</select></div></div><div class="field"><label for="new-desc">Wat verandert er?</label><textarea id="new-desc" name="desc" maxlength="250" required></textarea></div><div class="field"><label for="new-asked">Gevraagd budget in miljoenen euro's (schatting)</label><input type="number" id="new-asked" name="asked" min="0.1" max="10000" step="0.1" value="1" required></div><button type="submit" class="btn btn-main">Plan lokaal toevoegen</button></form>`:''}
  <div class="plan-grid">${shown.length?shown.map(planCard).join(''):'<p class="empty-state">Voor dit onderwerp zijn nog geen voorbeeldplannen.</p>'}</div><div class="demodata">Voor echte plannen zijn een begrotingsbron, uitgavenplanning, juridische verplichtingen en onafhankelijke controle nodig.</div>`;}
  function researchView(){const yes=!!state.research?.consent;const ages=[['','Maak een keuze'],['18-24','18–24 jaar'],['25-34','25–34 jaar'],['35-49','35–49 jaar'],['50-64','50–64 jaar'],['65+','65 jaar of ouder'],['liever-niet','Liever niet zeggen']];return `<section class="section-top"><div class="section-kicker">04 — Vrijwillig onderzoek</div><h1>Waarom kiezen mensen voor bepaalde potjes?</h1><p class="lead">Onderzoek kan inzichten geven, mits deelname vrijwillig is en kleine groepen niet herkenbaar worden gepubliceerd.</p></section><div class="research-layout"><div class="panel research-card"><span class="mini-tag">Vrijwillig en los van je stem</span><h3>Help het onderzoek</h3><p>Je naam, adres en BSN worden niet gevraagd. Deze demo stuurt geen antwoorden weg.</p><form id="research-form"><label class="consent-line"><input type="checkbox" name="consent" id="consent" ${yes?'checked':''}><span>Ik wil vrijwillig meedoen. Mijn keuzes worden alleen op dit apparaat opgeslagen.</span></label><div class="field"><label for="age">Leeftijdsgroep</label><select id="age" ${yes?'':'disabled'}>${ages.map(([v,l])=>`<option value="${v}" ${state.research?.age===v?'selected':''}>${esc(l)}</option>`).join('')}</select></div><div class="field"><label for="value">Wat weegt voor jou het zwaarst?</label><select id="value" ${yes?'':'disabled'}><option value="">Maak een keuze</option>${REASONS.map(([v,l])=>`<option value="${v}" ${state.research?.value===v?'selected':''}>${esc(l)}</option>`).join('')}</select></div><button class="btn btn-main full" type="submit">Onderzoekskeuzes lokaal opslaan</button><button id="remove-research" type="button" class="btn btn-ghost btn-sm">Onderzoeksgegevens verwijderen</button></form></div><aside class="panel research-card"><h3>Wat gebeurt er met je gegevens?</h3><div class="privacy-list"><div><div class="privacy-number">01</div><div><strong>Geen persoonsgegevens gevraagd</strong><p>Alleen leeftijdsgroep en een reden, als je wilt.</p></div></div><div><div class="privacy-number">02</div><div><strong>Gescheiden van je stem</strong><p>Geen openbaar individueel stemprofiel.</p></div></div><div><div class="privacy-number">03</div><div><strong>Geen live verzending</strong><p>Je browser houdt de gegevens zelf bij.</p></div></div><div><div class="privacy-number">04</div><div><strong>Geen claim op representativiteit</strong><p>Zelfselectie is geen afspiegeling van Nederland.</p></div></div></div></aside></div>`;}
  function bindPlans(){document.getElementById('plan-filter').addEventListener('change',e=>{state.filter=e.target.value;render();});document.getElementById('toggle-plan').addEventListener('click',()=>{state.formOpen=!state.formOpen;render();document.getElementById('new-title')?.focus();});page.querySelectorAll('[data-support]').forEach(b=>b.addEventListener('click',()=>{state.endorsements[b.dataset.support]=true;save();b.textContent='Steun opgeslagen';toast('Steun lokaal bewaard.');}));document.getElementById('new-plan')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const title=String(fd.get('title')||'').trim(),desc=String(fd.get('desc')||'').trim(),theme=String(fd.get('theme')||''),asked=Number(fd.get('asked'));if(!title||!desc||!ITEM_BY_ID[theme]||!Number.isFinite(asked)||asked<=0||asked>10000)return toast('Controleer het formulier.');state.plans.push({id:'local-'+Date.now(),title:title.slice(0,85),desc:desc.slice(0,250),theme,asked,covered:0});state.plans=state.plans.slice(-10);state.formOpen=false;state.filter='alle';save();render();toast('Plan toegevoegd aan je lokale demo.');});}
  function bindResearch(){const consent=document.getElementById('consent');consent.addEventListener('change',()=>{document.getElementById('age').disabled=!consent.checked;document.getElementById('value').disabled=!consent.checked;});document.getElementById('research-form').addEventListener('submit',e=>{e.preventDefault();if(!consent.checked)return toast('Geef eerst toestemming.');const age=document.getElementById('age').value,value=document.getElementById('value').value;if(!age||!value)return toast('Vul beide vragen in of kies liever niet zeggen.');state.research={consent:true,age,value};save();toast('Onderzoekskeuzes lokaal bewaard.');});document.getElementById('remove-research').addEventListener('click',()=>{state.research=null;save();render();toast('Gegevens verwijderd.');});}
  function render(){const view=route();page.innerHTML=({verdelen:budgetView,uitslagen:resultsView,plannen:plansView,onderzoek:researchView})[view]();document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===view);if(a.dataset.nav===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});if(view==='verdelen')bindBudget();if(view==='plannen')bindPlans();if(view==='onderzoek')bindResearch();if(view==='uitslagen')page.querySelectorAll('[data-result-mode]').forEach(b=>b.addEventListener('click',()=>{state.resultMode=b.dataset.resultMode;render();}));}
  window.addEventListener('hashchange',()=>{render();if(location.hash==='#budget')requestAnimationFrame(()=>document.getElementById('budget')?.scrollIntoView({behavior:'smooth',block:'start'}));else window.scrollTo(0,0);});
  window.addEventListener('storage',e=>{if(e.key===STORE)location.reload();});render();
  if('serviceWorker' in navigator && location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
