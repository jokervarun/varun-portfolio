(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;

  // ---------- Loader ----------
  window.addEventListener('load', () => {
    window.setTimeout(() => document.querySelector('.page-loader')?.classList.add('hide'), 700);
  });

  // ---------- Scroll progress ----------
  const progress = document.querySelector('.scroll-progress i');
  const updateProgress = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ---------- Mouse system ----------
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let pointerX = innerWidth / 2, pointerY = innerHeight / 2;
  let ringX = pointerX, ringY = pointerY;

  if (!isTouch && !prefersReducedMotion) {
    addEventListener('pointermove', e => {
      pointerX = e.clientX; pointerY = e.clientY;
      dot.style.opacity = '1'; ring.style.opacity = '1';
      dot.style.left = `${pointerX}px`; dot.style.top = `${pointerY}px`;
    }, { passive: true });
    const cursorLoop = () => {
      ringX += (pointerX - ringX) * 0.14;
      ringY += (pointerY - ringY) * 0.14;
      ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();

    document.querySelectorAll('a,button,.project-tile,.featured-project').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  // ---------- Reveal on scroll ----------
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ---------- Magnetic buttons ----------
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('pointermove', e => {
        const r = button.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.13;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.13;
        button.style.transform = `translate(${dx}px,${dy}px)`;
      });
      button.addEventListener('pointerleave', () => button.style.transform = 'translate(0,0)');
    });
  }

  // ---------- 3D project tilt ----------
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.project-tile,.featured-project').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -4.5;
        const ry = ((x / r.width) - 0.5) * 5.5;
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(5px)`;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });
      card.addEventListener('pointerleave', () => card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)');
    });
  }

  // ---------- Active nav ----------
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { threshold: 0, rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => navObserver.observe(section));

  // ---------- Project detail modal ----------
  const projectData = {
    botnet: {
      icon: 'IoT',
      kicker: 'Dec 2025 — Present · SRMIST · ML / Cybersecurity / IoT',
      title: 'Lightweight IoT Botnet Detection System using ML and Deep Learning',
      body: 'A scalable intrusion-detection workflow for IoT botnet attacks such as Mirai and Gafgyt. The project combines classical machine learning and deep learning, feature engineering, cross-device validation and optimisation for lightweight edge deployment.',
      details: [
        ['Dataset', 'N-BaIoT'],
        ['Models', 'Logistic Regression · Random Forest · XGBoost · LightGBM · MLP · CNN'],
        ['Stack', 'Python · Scikit-learn · TensorFlow/Keras · Pandas · NumPy · Matplotlib'],
        ['Deployment focus', 'TensorFlow Lite · real-time IoT security monitoring'],
        ['Research result', '90.46% accuracy · 50,000 parameters'],
        ['Validation', '9-fold Leave-One-Device-Out cross-validation']
      ]
    },
    can: {
      icon: 'CAN', kicker: 'Jan — Mar 2026 · SRMIST · Automotive Cybersecurity', title: 'CAN Bus Intrusion Detection System',
      body: 'An ML-based intrusion-detection system for automotive CAN Bus networks, developed with XGBoost and evaluated for real-time vehicle constraints. Validation covered three benchmark datasets and multiple attack types.',
      details: [['Model','XGBoost'],['Accuracy','91.30% classification accuracy'],['Inference','0.144 ms latency'],['Datasets','ROAD · OTIDS · SynCAN'],['Attacks','Fuzzy · Replay · Spoofing'],['Goal','Real-time in-vehicle intrusion detection']]
    },
    pothole: {
      icon: 'CV', kicker: 'Jan — May 2025 · SRMIST · Embedded System', title: 'Pothole Detection and Filling System',
      body: 'A computer-vision and embedded system that uses YOLOv8 to detect potholes, drives an Arduino-based filling mechanism, and integrates IoT features for real-time reporting and location tracking.',
      details: [['Vision','YOLOv8'],['Controller','Arduino'],['Connectivity','IoT'],['Core idea','Detect → decide → actuate'],['Output','Real-time report + location tracking'],['Domain','Road infrastructure automation']]
    },
    lifi: {
      icon: 'Li-Fi', kicker: 'Jan — Apr 2025 · SRMIST · IoT', title: 'Audio Transfer Using Li-Fi Technology',
      body: 'An LED–photodiode Li-Fi prototype designed to transmit audio signals wirelessly, exploring optical communication as a high-speed, interference-resistant alternative to conventional radio links.',
      details: [['Transmitter','LED'],['Receiver','Photodiode'],['Payload','Audio signal'],['Medium','Visible-light communication'],['Design goal','High-speed wireless transfer'],['Claim in CV','Zero interference']]
    },
    hvac: {
      icon: 'HVAC', kicker: 'Nov — Dec 2024 · SRMIST · IoT', title: 'Smart HVAC System with IoT Controls',
      body: 'An IoT-enabled HVAC concept with real-time monitoring, remote controls and automated climate adjustment, modelled using TinkerCAD.',
      details: [['Platform','TinkerCAD'],['Monitoring','Real-time climate state'],['Control','Remote IoT controls'],['Automation','Automatic climate adjustment'],['Domain','Smart building systems'],['Theme','Connected control loop']]
    },
    alcohol: {
      icon: '8051', kicker: 'Oct — Nov 2024 · SRMIST · Embedded System', title: 'Alcohol Detection System',
      body: 'An MQ-3 sensor-based alcohol detection system using an 8051 microcontroller simulation, developed and tested through Keil and Proteus.',
      details: [['Sensor','MQ-3'],['Controller','8051'],['Simulation','Keil · Proteus'],['Domain','Embedded safety system'],['Input','Gas concentration'],['Output','Detection / alert workflow']]
    },
    diet: {
      icon: 'BI', kicker: 'Oct — Nov 2024 · SRMIST · Database Design', title: 'Diet Planner',
      body: 'A database-driven nutrition planning tool paired with Power BI dashboards to track and visualise diet and nutrition information.',
      details: [['Database','MySQL'],['Visualisation','Power BI'],['Focus','Nutrition data'],['Workflow','Store → analyse → visualise'],['Domain','Data-driven planning'],['Output','Interactive dashboard views']]
    },
    gateway: {
      icon: 'VLSI', kicker: 'Sep — Oct 2024 · SRMIST · VLSI', title: 'Gateway System',
      body: 'A Verilog HDL gateway control system designed and verified with optimised logic for VLSI applications.',
      details: [['HDL','Verilog HDL'],['Domain','VLSI'],['Process','Design + verification'],['Focus','Gateway control logic'],['Goal','Optimised digital logic'],['Tool family','Xilinx / HDL workflow']]
    },
    gas: {
      icon: 'MQ', kicker: 'Nov — Dec 2023 · SRMIST · Electronics', title: 'Gas Leakage Detection System',
      body: 'A gas-leak detection circuit using MQ-series sensors, audible alarms and indicator alerts, validated using TinkerCAD circuit simulation.',
      details: [['Sensors','MQ-series'],['Simulation','TinkerCAD'],['Alerts','Audible + indicator'],['Domain','Electronics safety'],['Detection','Gas leakage'],['Validation','Circuit simulation']]
    },
    piezo: {
      icon: 'PZT', kicker: 'Dec 2022 · SRMIST · IoT / Energy', title: 'Piezoelectric Harvesting Shoes',
      body: 'Footwear integrating piezoelectric modules to harvest energy generated while walking, with the goal of powering portable devices.',
      details: [['Material','Piezoelectric modules'],['Input','Walking motion'],['Output','Harvested electrical energy'],['Use case','Portable device power'],['Domain','Energy harvesting'],['Year','Dec 2022']]
    }
  };

  const modal = document.getElementById('projectModal');
  const modalIcon = document.getElementById('modalIcon');
  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalDetails = document.getElementById('modalDetails');

  const openModal = key => {
    const data = projectData[key];
    if (!data) return;
    modalIcon.textContent = data.icon;
    modalKicker.textContent = data.kicker;
    modalTitle.textContent = data.title;
    modalBody.textContent = data.body;
    modalDetails.innerHTML = data.details.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join('');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
  };
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); };
  document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.open)));
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ---------- Three.js hero ----------
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.THREE && !prefersReducedMotion) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const group = new THREE.Group();
    group.position.x = innerWidth < 1050 ? 0.25 : 0.6;
    group.position.y = 0.05;
    scene.add(group);

    const ambient = new THREE.HemisphereLight(0x496d72, 0x050708, 1.1);
    scene.add(ambient);

    const coreGeo = new THREE.IcosahedronGeometry(1.52, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x79bdb8, roughness: .27, metalness: .35, transparent: true, opacity: .62, emissive: 0x102b2d, emissiveIntensity: .45, clearcoat: .6 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const wireGeo = new THREE.IcosahedronGeometry(2.05, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x5eead4, wireframe: true, transparent: true, opacity: .20 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.15, .008, 6, 220), new THREE.MeshBasicMaterial({ color: 0x9bc7ff, transparent:true, opacity:.28 }));
    ring1.rotation.set(.9, .2, .35); group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.45, .006, 6, 220), new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent:true, opacity:.20 }));
    ring2.rotation.set(-.5, .7, .2); group.add(ring2);

    const nodeGeo = new THREE.SphereGeometry(.035, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x5eead4 });
    const nodeGroup = new THREE.Group(); group.add(nodeGroup);
    for (let i = 0; i < 42; i++) {
      const p = new THREE.Vector3().randomDirection().multiplyScalar(2.55 + Math.random() * 1.7);
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(p); node.scale.setScalar(.55 + Math.random() * 1.5); nodeGroup.add(node);
    }

    // Network lines
    const linePositions = [];
    for (let i = 0; i < nodeGroup.children.length; i++) {
      for (let j = i + 1; j < nodeGroup.children.length; j++) {
        const a = nodeGroup.children[i].position, b = nodeGroup.children[j].position;
        if (a.distanceTo(b) < 1.35) linePositions.push(a.x,a.y,a.z,b.x,b.y,b.z);
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions,3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x5eead4, transparent:true, opacity:.075 }));
    group.add(lines);

    // Deep particle field
    const count = innerWidth < 700 ? 280 : 520;
    const pts = new Float32Array(count * 3);
    for (let i=0;i<count;i++) {
      pts[i*3] = (Math.random()-.5)*15;
      pts[i*3+1] = (Math.random()-.5)*10;
      pts[i*3+2] = (Math.random()-.5)*11;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pts,3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:0x8edbd1, size:0.018, transparent:true, opacity:.35, sizeAttenuation:true }));
    scene.add(particles);

    let tx = 0, ty = 0, smx = 0, smy = 0;
    addEventListener('pointermove', e => {
      tx = (e.clientX / innerWidth - .5) * .75;
      ty = (e.clientY / innerHeight - .5) * .45;
    }, { passive:true });

    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      smx += (tx-smx)*.035; smy += (ty-smy)*.035;
      group.rotation.y += .0015;
      group.rotation.x = smy * .35 + Math.sin(t*.25)*.025;
      group.rotation.z = smx * .12;
      core.rotation.x += .0012; core.rotation.y -= .0014;
      wire.rotation.y += .0007; wire.rotation.z -= .0005;
      ring1.rotation.z += .0022; ring2.rotation.x -= .0017;
      particles.rotation.y += .00018; particles.rotation.x = Math.sin(t*.08)*.035;
      renderer.render(scene,camera);
      requestAnimationFrame(render);
    };
    render();

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
      group.position.x = innerWidth < 1050 ? 0.2 : 0.6;
      group.scale.setScalar(innerWidth < 700 ? .72 : innerWidth < 1050 ? .88 : 1);
    };
    addEventListener('resize', resize);
    resize();
  }

  // ---------- Footer year ----------
  document.getElementById('year').textContent = new Date().getFullYear();
})();
