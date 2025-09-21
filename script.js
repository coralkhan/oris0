document.addEventListener('DOMContentLoaded', () => {
    const idleContainer = document.getElementById('idle-container'), circleParts = {p1:document.getElementById('circle-part-1'),p2:document.getElementById('circle-part-2'),p3:document.getElementById('circle-part-3'),p4:document.getElementById('circle-part-4')}, idleEye = document.getElementById('idle-eye'), segments = {study:document.getElementById('segment-study'),research:document.getElementById('segment-research'),earning:document.getElementById('segment-earning')}, transitionBurst = document.getElementById('transition-burst'), overlays = {ironMan:document.getElementById('iron-man-overlay'),money:document.getElementById('money-overlay')}, dashboards = {study:document.getElementById('study-dashboard'),research:document.getElementById('research-dashboard'),earning:document.getElementById('earning-dashboard')}, sidebar = document.getElementById('left-sidebar'), sidebarHandle = document.getElementById('sidebar-handle'), infoBar = document.getElementById('info-bar'), clockEl = document.getElementById('clock'), greetingEl = document.getElementById('greeting');
    let inactivityTimerEye, inactivityTimerAuto, userHasInteracted = false;

    function setInactivityTimers() {
        if (userHasInteracted) return;
        inactivityTimerEye = setTimeout(() => { gsap.to(idleEye,{opacity:1,scale:1,duration:.5,ease:"power2.out"}); gsap.to(idleEye,{scale:1.2,repeat:-1,yoyo:!0,duration:3,ease:"sine.inOut"}); }, 10000);
        inactivityTimerAuto = setTimeout(() => startTransition('study'), 15000);
    }
    function clearInactivityTimers() { userHasInteracted = true; clearTimeout(inactivityTimerEye); clearTimeout(inactivityTimerAuto); }
    setInactivityTimers();

    function updateClockAndGreeting() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        clockEl.textContent = `${hours % 12 || 12}:${minutes}`;
        if (hours < 12) greetingEl.textContent = "Good Morning."; else if (hours < 18) greetingEl.textContent = "Good Afternoon."; else greetingEl.textContent = "Good Evening.";
    }
    updateClockAndGreeting(); setInterval(updateClockAndGreeting, 60000);

    idleContainer.addEventListener('mouseenter', () => {
        if (userHasInteracted) return;
        gsap.to(circleParts.p1,{x:10,y:-10,rotation:5,duration:.4,ease:"power2.out"}); gsap.to(circleParts.p2,{x:10,y:10,rotation:5,duration:.4,ease:"power2.out"}); gsap.to(circleParts.p3,{x:-10,y:10,rotation:-5,duration:.4,ease:"power2.out"}); gsap.to(circleParts.p4,{x:-10,y:-10,rotation:-5,duration:.4,ease:"power2.out"});
        gsap.to(segments.study,{opacity:1,y:-90,pointerEvents:"auto",duration:.4,ease:"back.out(1.7)",delay:.1}); gsap.to(segments.research,{opacity:1,x:-80,y:45,pointerEvents:"auto",duration:.4,ease:"back.out(1.7)",delay:.15}); gsap.to(segments.earning,{opacity:1,x:80,y:45,pointerEvents:"auto",duration:.4,ease:"back.out(1.7)",delay:.2});
    });
    idleContainer.addEventListener('mouseleave', () => {
        if(userHasInteracted) return;
        gsap.to(Object.values(circleParts),{x:0,y:0,rotation:0,duration:.3,ease:"power2.in"}); gsap.to(Object.values(segments),{opacity:0,x:0,y:0,pointerEvents:"none",duration:.3,ease:"power2.in"});
    });

    sidebarHandle.addEventListener('click', () => { sidebar.classList.toggle('visible'); sidebarHandle.classList.toggle('shifted'); });
    
    Object.values(segments).forEach(seg=>seg.addEventListener('click',() => { clearInactivityTimers(); startTransition(seg.id.split('-')[1]); }));
    
    function startTransition(type) {
        clearInactivityTimers();
        let color, nextAnimation;
        if (type === 'study') { color = '#10b981'; nextAnimation = playIronManAnimation; }
        else if (type === 'research') { color = '#3b82f6'; nextAnimation = playIronManAnimation; }
        else { color = '#f59e0b'; nextAnimation = playMoneyAnimation; }
        gsap.to(idleContainer, {opacity:0,pointerEvents:"none",duration:.5});
        transitionBurst.style.background = color;
        gsap.to(transitionBurst, {scale:1,duration:.8,ease:"expo.inOut",onComplete:()=>nextAnimation(type)});
    }

    function playIronManAnimation(dashboardType){
        overlays.ironMan.classList.remove("hidden");
        const tl = gsap.timeline({onComplete:()=>{gsap.to(overlays.ironMan,{opacity:0,duration:.5,onComplete:()=>overlays.ironMan.classList.add("hidden")});showDashboard(dashboardType)}});
        tl.fromTo("#iron-man-mask-svg .part",{opacity:0,scale:.5,x:()=>(Math.random()-.5)*200,y:()=>(Math.random()-.5)*200,rotation:()=>(Math.random()-.5)*360},{opacity:1,scale:1,x:0,y:0,rotation:0,duration:1,ease:"elastic.out(1, 0.5)",stagger:.1}).to("#iron-man-mask-svg .part",{stroke:"white",repeat:1,yoyo:!0,duration:.1,stagger:.05},"-=0.5");
    }

    function playMoneyAnimation(dashboardType){
        overlays.money.classList.remove("hidden");
        const tl=gsap.timeline({onComplete:()=>{gsap.to(overlays.money,{opacity:0,duration:.5,onComplete:()=>overlays.money.classList.add("hidden")});showDashboard(dashboardType)}});
        tl.to('#money-overlay .briefcase-top',{rotationX:-140,duration:1,ease:"power2.inOut"}).to({}, {duration:.2}).add(()=>{for(let i=0;i<10;i++){const icon=document.createElement("div");icon.className="money-icon";icon.innerText="💰";overlays.money.appendChild(icon);gsap.fromTo(icon,{x:"50vw",y:"50vh",opacity:1},{x:()=>Math.random()*window.innerWidth,y:()=>Math.random()*window.innerHeight,scale:()=>Math.random()*2+1,opacity:0,duration:1.5,ease:"power3.out",onComplete:()=>icon.remove()})}}).to('#money-overlay .briefcase-top',{rotationX:0,duration:.5,ease:"power2.in"},">1");
    }

    function showDashboard(type) {
        gsap.to(transitionBurst, { opacity: 0, duration: 0.5 });
        infoBar.classList.add('visible');
        gsap.to(dashboards[type], { opacity: 1, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out' });
        
        const currentDashboard = dashboards[type];
        const appsHandle = currentDashboard.querySelector('.apps-handle');
        const toolsHandle = currentDashboard.querySelector('.tools-handle');
        const appsPanel = currentDashboard.querySelector('.apps-panel');
        const toolsPanel = currentDashboard.querySelector('.tools-panel');
        const centralContent = currentDashboard.querySelector('.central-content');

        appsHandle.addEventListener('click', () => {
            const isOpen = appsPanel.classList.toggle('visible');
            toolsPanel.classList.remove('visible');
            gsap.to(centralContent, { x: isOpen ? '50%' : '0%', duration: 0.5, ease: 'power2.inOut' });
        });
        toolsHandle.addEventListener('click', () => {
            const isOpen = toolsPanel.classList.toggle('visible');
            appsPanel.classList.remove('visible');
            gsap.to(centralContent, { x: isOpen ? '-50%' : '0%', duration: 0.5, ease: 'power2.inOut' });
        });

        if (type === 'research') {
            gsap.fromTo("#jarvis-hologram .holo-part", {opacity:0,scale:.8,y:20}, {opacity:1,scale:1,y:0,duration:1,stagger:.1,ease:"back.out(1.7)"});
            gsap.to("#jarvis-hologram", {y:-10,repeat:-1,yoyo:!0,duration:4,ease:'sine.inOut'});
        }
    }
});
