(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>[...p.querySelectorAll(s)];

  addEventListener('load',()=>setTimeout(()=>$('.page-loader')?.classList.add('hide'),650));
  const year=$('#year'); if(year) year.textContent=new Date().getFullYear();

  const contactData=$('.contact-data');
  if(contactData&&!$('.contact-details-live')){
    const row=document.createElement('div'); row.className='contact-details-live';
    row.innerHTML='<a href="mailto:vk3789@srmist.edu.in">vk3789@srmist.edu.in</a><a href="tel:+917907808167">+91 7907808167</a>';
    contactData.appendChild(row);
  }

  const progress=$('.scroll-progress i');
  const progressUpdate=()=>{if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?(scrollY/max)*100:0}%`;};
  addEventListener('scroll',progressUpdate,{passive:true}); progressUpdate();

  const sectionObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)document.body.dataset.section=e.target.id||'hero';}),{threshold:.18,rootMargin:'-20% 0px -50% 0px'});
  $$('main > section[id]').forEach(s=>sectionObserver.observe(s));

  const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('visible');revealObserver.unobserve(e.target);}),{threshold:.08,rootMargin:'0px 0px -45px 0px'});
  $$('.reveal').forEach((el,i)=>{el.style.setProperty('--reveal-delay',`${(i%7)*45}ms`);revealObserver.observe(el);});

  const dot=$('.cursor-dot'), ring=$('.cursor-ring'); let px=innerWidth/2,py=innerHeight/2,rx=px,ry=py;
  if(!touch&&!reduced&&dot&&ring){
    addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;dot.style.left=`${px}px`;dot.style.top=`${py}px`;dot.style.opacity='1';ring.style.opacity='1';},{passive:true});
    const cursorLoop=()=>{rx+=(px-rx)*.14;ry+=(py-ry)*.14;ring.style.left=`${rx}px`;ring.style.top=`${ry}px`;requestAnimationFrame(cursorLoop);}; cursorLoop();
    $$('a,button,.project-tile,.featured-project,.tool-group h3,.language-pill').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('active'));el.addEventListener('mouseleave',()=>ring.classList.remove('active'));});
  }

  if(!touch&&!reduced){
    $$('.magnetic').forEach(btn=>{btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.11}px,${(e.clientY-(r.top+r.height/2))*.11}px)`;});btn.addEventListener('pointerleave',()=>btn.style.transform='translate(0,0)');});
    $$('.project-tile,.featured-project').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,ax=x/r.width-.5,ay=y/r.height-.5;card.style.transform=`perspective(1150px) rotateX(${ay*-3.5}deg) rotateY(${ax*4.5}deg) translateZ(5px)`;card.style.setProperty('--mx',`${x}px`);card.style.setProperty('--my',`${y}px`);});card.addEventListener('pointerleave',()=>{card.style.transform='';card.style.setProperty('--mx','50%');card.style.setProperty('--my','50%');});});
  }

  const animateNumber=(el,target,duration=1000,dec=0,suffix='')=>{if(!el||el.dataset.animated)return;el.dataset.animated='1';const start=performance.now();const ease=t=>1-Math.pow(1-t,4);const frame=now=>{const t=Math.min(1,(now-start)/duration);el.textContent=(target*ease(t)).toFixed(dec)+suffix;if(t<1)requestAnimationFrame(frame);};requestAnimationFrame(frame);};
  $$('.big-fact b').forEach(el=>{const obs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const label=$('span',el.parentElement)?.textContent||'';if(label.includes('CGPA'))animateNumber(el,8.40,1050,2);else if(label.includes('PROJECTS'))animateNumber(el,10,850,0,'+');else if(label.includes('RESEARCH'))animateNumber(el,1,750,0);else if(label.includes('FASTEST'))animateNumber(el,.144,1100,3);obs.unobserve(el);}),{threshold:.65});obs.observe(el);});
  const can=$('.can-number'); if(can){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;animateNumber(can,91.30,1100,2,'%');obs.unobserve(can);}),{threshold:.6});obs.observe(can);}

  const techMap={python:['botnet','can','pothole'],'c / c++':[],mysql:['diet'],'scikit-learn':['botnet','can'],'tensorflow / keras':['botnet'],tensorflow:['botnet'],xgboost:['botnet','can'],lightgbm:['botnet'],pandas:['botnet'],numpy:['botnet'],matplotlib:['botnet'],arduino:['pothole'],yolov8:['pothole'],iot:['botnet','pothole','lifi','hvac'],tinkercad:['hvac','gas'],keil:['alcohol'],proteus:['alcohol'],'mq-3':['alcohol'],'8051':['alcohol'],'power bi':['diet'],'verilog hdl':['gateway'],verilog:['gateway'],easyeda:[],matlab:[],autocad:[],ltspice:[],altium:[],jupyter:[]};
  const labels=$$('.tag-row span,.model-strip span,.tool-group h3'), cards=$$('.project-tile,.featured-project');
  const clear=()=>{labels.forEach(x=>x.classList.remove('selected-tech'));cards.forEach(x=>x.classList.remove('tech-highlight'));};
  labels.forEach(label=>{label.classList.add('interactive-tech');label.tabIndex=0;const activate=()=>{const k=label.textContent.trim().toLowerCase(),matches=techMap[k]||[];clear();label.classList.add('selected-tech');cards.forEach(c=>{if(matches.includes(c.dataset.project))c.classList.add('tech-highlight');});const first=cards.find(c=>matches.includes(c.dataset.project));if(first)first.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});};label.addEventListener('click',activate);label.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});});

  const projectData={
    botnet:{icon:'IoT',kicker:'Dec 2025 — Present · SRMIST · ML / Cybersecurity / IoT',title:'Lightweight IoT Botnet Detection System using ML and Deep Learning',body:'Developed a scalable IoT intrusion detection system to identify botnet attacks such as Mirai and Gafgyt using ML and deep learning models, with feature engineering, cross-device validation and optimisation for lightweight edge deployment.',details:[['Dataset','N-BaIoT'],['Models','Logistic Regression · Random Forest · XGBoost · LightGBM · MLP · CNN'],['Stack','Python · Scikit-learn · TensorFlow/Keras · XGBoost · LightGBM · Pandas · NumPy · Matplotlib'],['Deployment','TensorFlow Lite · real-time IoT security monitoring'],['Research result','90.46% accuracy · 50,000 parameters'],['Validation','9-fold Leave-One-Device-Out cross-validation']]},
    can:{icon:'CAN',kicker:'Jan — Mar 2026 · SRMIST · Automotive Cybersecurity',title:'CAN Bus Intrusion Detection System',body:'Developed an ML-based Intrusion Detection System for automotive CAN Bus networks using XGBoost, achieving high classification accuracy with ultra-low inference latency and validating the system across three benchmark datasets.',details:[['Model','XGBoost'],['Accuracy','91.30% classification accuracy'],['Latency','0.144 ms inference latency'],['Datasets','ROAD · OTIDS · SynCAN'],['Attacks','Fuzzy · Replay · Spoofing'],['Generalisation','Cross-dataset validation']]},
    pothole:{icon:'CV',kicker:'Jan — May 2025 · SRMIST · Embedded System',title:'Pothole Detection and Filling System',body:'Developed a YOLOv8-based system to detect potholes and control an Arduino-driven filling mechanism, with IoT integration for real-time reporting and location tracking.',details:[['Vision','YOLOv8'],['Controller','Arduino'],['Connectivity','IoT'],['Workflow','Detection → control → actuation'],['Reporting','Real-time reporting + location tracking'],['Domain','Embedded road infrastructure']]},
    lifi:{icon:'Li-Fi',kicker:'Jan — Apr 2025 · SRMIST · IoT',title:'Audio Transfer Using Li-Fi Technology',body:'Designed an LED–photodiode Li-Fi prototype to transmit audio signals wirelessly with high speed and zero interference.',details:[['Transmitter','LED'],['Receiver','Photodiode'],['Payload','Audio signals'],['Medium','Optical wireless communication'],['Design goal','High-speed transfer'],['CV result','Zero interference']]},
    hvac:{icon:'HVAC',kicker:'Nov — Dec 2024 · SRMIST · IoT',title:'Smart HVAC System with IoT Controls',body:'Created an IoT-enabled HVAC system with real-time monitoring, remote control and automated climate adjustment using TinkerCAD.',details:[['Platform','TinkerCAD'],['Monitoring','Real-time monitoring'],['Control','Remote control'],['Automation','Automated climate adjustment'],['Domain','IoT / smart building'],['Pattern','Connected control loop']]},
    alcohol:{icon:'8051',kicker:'Oct — Nov 2024 · SRMIST · Embedded System',title:'Alcohol Detection System',body:'Developed an MQ-3 sensor-based alcohol detection system using 8051 microcontroller simulation in Keil and Proteus.',details:[['Sensor','MQ-3'],['Controller','8051 microcontroller'],['Tools','Keil · Proteus'],['Domain','Embedded safety'],['Input','Gas concentration'],['Output','Detection / alert workflow']]},
    diet:{icon:'BI',kicker:'Oct — Nov 2024 · SRMIST · Database Design',title:'Diet Planner',body:'Built a database-driven diet planning tool with Power BI dashboards to track and visualise nutrition data.',details:[['Database','MySQL'],['Visualisation','Power BI'],['Data','Nutrition'],['Workflow','Store → analyse → visualise'],['Domain','Database / analytics'],['Output','Dashboard views']]},
    gateway:{icon:'VLSI',kicker:'Sep — Oct 2024 · SRMIST · VLSI',title:'Gateway System',body:'Designed and verified a Verilog-based gateway control system with optimised logic for VLSI applications.',details:[['HDL','Verilog HDL'],['Domain','VLSI'],['Process','Design + verification'],['Focus','Gateway control'],['Goal','Optimised logic'],['Tool family','Xilinx / Verilog workflow']]},
    gas:{icon:'MQ',kicker:'Nov — Dec 2023 · SRMIST · Electronics',title:'Gas Leakage Detection System',body:'Built a gas leak detection system using MQ-series sensors with audible alarm and indicator alerts; validated using TinkerCAD circuit simulation.',details:[['Sensors','MQ-series'],['Simulation','TinkerCAD'],['Alerts','Audible + indicator'],['Domain','Electronics safety'],['Detection','Gas leakage'],['Validation','Circuit simulation']]},
    piezo:{icon:'PZT',kicker:'Dec 2022 · SRMIST · IoT',title:'Piezoelectric Harvesting Shoes',body:'Developed footwear with piezoelectric modules to harvest walking energy and power portable devices.',details:[['Input','Walking motion'],['Technology','Piezoelectric modules'],['Output','Harvested energy'],['Use case','Portable device power'],['Domain','Energy harvesting'],['Date','Dec 2022']]}
  };

  const modal=$('#projectModal'), mi=$('#modalIcon'), mk=$('#modalKicker'), mt=$('#modalTitle'), mb=$('#modalBody'), md=$('#modalDetails');
  const openModal=k=>{const p=projectData[k];if(!p||!modal)return;mi.textContent=p.icon;mk.textContent=p.kicker;mt.textContent=p.title;mb.textContent=p.body;md.innerHTML=p.details.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('');modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');};
  const closeModal=()=>{modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  $$('[data-open]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openModal(b.dataset.open);}));
  $$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));
  $$('.project-tile,.featured-project').forEach(c=>c.addEventListener('click',e=>{if(!e.target.closest('a,button')&&c.dataset.project)openModal(c.dataset.project);}));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

  const canvas=$('#heroCanvas');
  if(canvas&&window.THREE&&!reduced){
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight,false);if('outputColorSpace' in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,100);camera.position.set(0,0,7.2);
    const rig=new THREE.Group();rig.position.set(innerWidth<900?.1:.65,.05,0);scene.add(rig);scene.add(new THREE.HemisphereLight(0x7bbab5,0x030405,1.15));
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,2),new THREE.MeshPhysicalMaterial({color:0x80c8c0,roughness:.3,metalness:.3,transparent:true,opacity:.66,emissive:0x173437,emissiveIntensity:.4,clearcoat:.6}));rig.add(core);
    const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(2.25,2),new THREE.MeshBasicMaterial({color:0x5eead4,wireframe:true,transparent:true,opacity:.22}));rig.add(shell);
    const rings=[];[[2.15,.01,0x95cfff,.25,.85,.15],[2.55,.008,0x5eead4,.18,-.5,.72],[1.95,.006,0xffffff,.12,.25,-.8]].forEach((r,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r[0],r[1],8,220),new THREE.MeshBasicMaterial({color:r[2],transparent:true,opacity:r[3]}));m.rotation.set(r[4],r[5],i*.2);rig.add(m);rings.push(m);});
    const nodes=new THREE.Group();rig.add(nodes);const ng=new THREE.SphereGeometry(.032,7,7), nm=new THREE.MeshBasicMaterial({color:0x8ce1d7});
    for(let i=0;i<52;i++){const n=new THREE.Mesh(ng,nm);n.position.copy(new THREE.Vector3().randomDirection().multiplyScalar(2.35+Math.random()*1.7));n.scale.setScalar(.5+Math.random()*1.7);nodes.add(n);}
    const lp=[];for(let i=0;i<nodes.children.length;i++)for(let j=i+1;j<nodes.children.length;j++){const a=nodes.children[i].position,b=nodes.children[j].position;if(a.distanceTo(b)<1.25)lp.push(a.x,a.y,a.z,b.x,b.y,b.z);}const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));rig.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x68ddd3,transparent:true,opacity:.075})));
    const pc=innerWidth<720?230:460, pp=new Float32Array(pc*3);for(let i=0;i<pc;i++){pp[i*3]=(Math.random()-.5)*17;pp[i*3+1]=(Math.random()-.5)*11;pp[i*3+2]=(Math.random()-.5)*12;}const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x8ad7d0,size:.017,transparent:true,opacity:.3}));scene.add(pts);
    let tx=0,ty=0,sx=0,sy=0;addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.72;ty=(e.clientY/innerHeight-.5)*.48;},{passive:true});
    const clock=new THREE.Clock();const render=()=>{const t=clock.getElapsedTime();sx+=(tx-sx)*.035;sy+=(ty-sy)*.035;core.rotation.y=t*.15+sx*.55;core.rotation.x=Math.sin(t*.25)*.07+sy*.2;shell.rotation.y=-t*.065+sx*.25;shell.rotation.x=t*.018;nodes.rotation.y=t*.045;nodes.rotation.x=t*.012;rings[0].rotation.z+=.001;rings[1].rotation.x-=.0007;rings[2].rotation.y+=.0005;pts.rotation.y=t*.008;renderer.render(scene,camera);requestAnimationFrame(render);};render();
    addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();rig.position.x=innerWidth<900?.1:.65;});
  }

  const dashboard=$('.hero-dashboard');
  if(dashboard&&!touch&&!reduced)addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*-7;dashboard.style.transform=`translate3d(${x}px,${y}px,0)`;},{passive:true});
})();
