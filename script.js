const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(24px)';el.style.transition='opacity .8s ease,transform .8s ease';observer.observe(el)});
const style=document.createElement('style');style.textContent='.reveal.visible{opacity:1!important;transform:none!important}';document.head.appendChild(style);
document.getElementById('year').textContent=new Date().getFullYear();
