/* Original, dependency-free particle architecture. Every tile belongs to a 3D surface. */
(() => {
  'use strict';
  const W = 1600, H = 1050, DOT_SCALE = .7;
  const PALETTE = ['#f5f7fb', '#b8c4d4', '#646cff', '#39d6ff', '#a56cff', '#57dfa3'];
  const LABELS = { serious: 'Serious projects', fun: 'Just for fun', neuro: 'Neuroscience' };
  function createParticleRoom(holder, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    holder.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: false });
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const particles = [], wires = [], features = [], buttons = {}, dust = [], stars = [];
    let seed = 8726381;
    function rand() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; }
    const lerp = (a, b, t) => a + (b - a) * t;
    const point = (x, y, z) => ({ x, y, z });
    const add = (a,b) => point(a.x+b.x,a.y+b.y,a.z+b.z);
    const sub = (a,b) => point(a.x-b.x,a.y-b.y,a.z-b.z);
    const mul = (a,t) => point(a.x*t,a.y*t,a.z*t);
    const length = a => Math.hypot(a.x,a.y,a.z);
    const mix = (a,b,t) => add(a,mul(sub(b,a),t));
    let group = 'serious';
    function tile(x,y,z, brightness = .8, accent = null, size = 2.7) {
      const isBrain = accent === '#ffc0df' || accent === '#ddc6ff' || accent === '#fff0fa';
      if (!isBrain && rand() < .16) return;
      const c = accent || (rand() < .17 ? PALETTE[2 + Math.floor(rand()*4)] : PALETTE[rand() < .2 ? 1 : 0]);
      particles.push({ x,y,z, g:group, c, a:isBrain ? .76+rand()*.24 : brightness*(.43+rand()*.57), s:Math.max(3.8,size*1.62)*(.92+rand()*.16), flicker:rand()*6.28 });
    }
    function wire(points, color='#e5f5f4', opacity=.22, width=.65, front=false) {
      (front ? features : wires).push({ p:points, c:color, a:opacity, w:width, g:group });
    }
    function edge(a,b,accent=null,spacing=5.8) {
      const n=Math.max(1,Math.ceil(length(sub(b,a))/spacing));
      for(let i=0;i<=n;i++){ const p=mix(a,b,i/n); if(rand()>.12)tile(p.x,p.y,p.z,.82,accent,2.5); }
    }
    function plane(a,b,c,spacing=9.5,density=.67,bright=.56,accent=null) {
      const ab=sub(b,a), ac=sub(c,a), nx=Math.ceil(length(ab)/spacing), ny=Math.ceil(length(ac)/spacing);
      for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++){
        if(rand()>density)continue;
        const u=Math.min(1,Math.max(0,(i+(rand()-.5)*.055)/nx));
        const v=Math.min(1,Math.max(0,(j+(rand()-.5)*.055)/ny));
        const p=add(a,add(mul(ab,u),mul(ac,v)));
        const rim=i===0||j===0||i===nx||j===ny;
        tile(p.x,p.y,p.z,rim?.96:bright,accent,rim?2.8:2.6);
      }
    }
    function box(x0,y0,z0,x1,y1,z1, density=.7,accent=null) {
      // Only the three camera-facing surfaces are sampled: upward, front, right.
      plane(point(x0,y1,z0),point(x1,y1,z0),point(x0,y1,z1),9.6,density,.61,accent);
      plane(point(x0,y0,z1),point(x1,y0,z1),point(x0,y1,z1),10,density*.75,.29,accent);
      plane(point(x1,y0,z0),point(x1,y0,z1),point(x1,y1,z0),10,density*.72,.37,accent);
      [[point(x0,y1,z0),point(x1,y1,z0)],[point(x1,y1,z0),point(x1,y1,z1)],[point(x0,y1,z1),point(x1,y1,z1)], [point(x0,y0,z1),point(x0,y1,z1)],[point(x1,y0,z1),point(x1,y1,z1)]].forEach(e=>edge(...e,accent));
    }
    function cylinder(cx,y0,cz,r,height, density=.72,accent=null) {
      const rings=Math.ceil(height/8.5), count=Math.ceil(r*.82);
      for(let j=0;j<=rings;j++)for(let i=0;i<count;i++){
        const t=i/count*Math.PI*2;
        if(Math.sin(t)<-.15||rand()>density)continue;
        tile(cx+Math.cos(t)*r,y0+j/rings*height,cz+Math.sin(t)*r,.5+Math.max(0,Math.sin(t))*.25,accent,2.6);
      }
      for(let i=0;i<count*1.1;i++){const t=i/count*Math.PI*2;tile(cx+Math.cos(t)*r,y0+height,cz+Math.sin(t)*r,.95,accent,2.8);}
      for(let i=0;i<r*r/22;i++){const t=rand()*Math.PI*2,rr=Math.sqrt(rand())*r;tile(cx+Math.cos(t)*rr,y0+height,cz+Math.sin(t)*rr,.78,accent,2.5);}
    }
    function ellipsoid(cx,cy,cz,rx,ry,rz, density=.8,accent=null) {
      const area=4*Math.PI*((rx*ry+ry*rz+rx*rz)/3), n=Math.ceil(area/55*density);
      const golden=Math.PI*(3-Math.sqrt(5));
      for(let i=0;i<n;i++){
        const yy=1-2*(i+.5)/n, rr=Math.sqrt(1-yy*yy), t=i*golden;
        const xx=Math.cos(t)*rr, zz=Math.sin(t)*rr;
        if(yy*.72+zz*.59+xx*.12<-.05)continue;
        tile(cx+xx*rx,cy+yy*ry,cz+zz*rz,.45+Math.max(0,yy*.6+zz*.18)*.55,accent,2.5);
      }
    }
    function rod(a,b,r=3,accent=null) {
      const d=sub(b,a), n=Math.ceil(length(d)/5.6);
      for(let i=0;i<=n;i++){const p=mix(a,b,i/n);for(let j=0;j<3;j++){const t=j/3*6.28;tile(p.x+Math.cos(t)*r,p.y,p.z+Math.sin(t)*r,.72,accent,2.4);}}
    }
    function ring(cx,cy,cz,rx,ry,accent=null) {
      const ps=[];for(let t=0;t<=Math.PI*2+.04;t+=.105){const p=point(cx+Math.cos(t)*rx,cy+Math.sin(t)*ry,cz);ps.push(p);if(rand()>.1)tile(p.x,p.y,p.z,.9,accent,2.6);}wire(ps,accent||'#dae9ef',.32,.65);
    }
    // SERIOUS: desk, computer, keyboard, working lamp, chair and coffee.
    group='serious';
    box(-610,242,-100,-140,258,220,.75);
    [[-590,-82],[-171,-82],[-590,194],[-171,194]].forEach(([x,z])=>box(x,0,z,x+17,242,z+18,.65));
    box(-568,209,220,-188,237,232,.49);
    edge(point(-410,221,234),point(-350,221,234),'#b4dce6');
    box(-482,260,-2,-270,269,143,.7);
    const sa=point(-482,269,-5),sb=point(-270,269,-5),sc=point(-482,429,-43),sd=point(-270,429,-43);
    plane(sa,sb,sc,7.8,.66,.69); edge(sa,sb);edge(sa,sc);edge(sc,sd);edge(sb,sd);
    // A cloud of tiny 'code' rows and a discrete data curve across the screen.
    for(let row=0;row<7;row++){
      const yy=400-row*14, zz=-37+row*3.3;
      edge(point(-466,yy,zz),point(-445+(row%3)*18,yy,zz),'#bce7f1',3.7);
    }
    const graph=[];for(let i=0;i<38;i++){const x=-405+i*3.1,y=307+i*1.7+Math.sin(i*.55)*10;graph.push(point(x,y,-14-(y-269)*.237));}
    wire(graph,'#a3e8f0',.75,1);graph.forEach(p=>tile(p.x,p.y,p.z,.95,'#bbebf8',3));
    for(let x=-462;x<-286;x+=17)for(let z=25;z<100;z+=16)box(x,270,z,x+10,272,z+9,.72,rand()<.08?'#bcbef4':null);
    box(-417,270,112,-349,271,135,.58);
    // Reading light.
    cylinder(-554,259,-45,27,7,.8);rod(point(-554,268,-45),point(-557,374,-45),4);
    rod(point(-557,374,-45),point(-520,416,-45),4);
    for(let y=397;y<442;y+=5){const r=42-(y-397)*.47;for(let t=0;t<6.28;t+=.16)if(rand()<.83)tile(-518+Math.cos(t)*r,y,-44+Math.sin(t)*r,.8,null,2.8);}
    ring(-518,397,-44,42,14); // Thin rim and light speckles, never a filled cone.
    cylinder(-195,260,-45,15,34,.78);ring(-195,294,-45,15,5);
    const handle=[];for(let t=-1.5;t<1.6;t+=.15)handle.push(point(-176+Math.cos(t)*9,278+Math.sin(t)*12,-45));wire(handle,'#e6eef0',.45,.8);
    box(-575,260,120,-500,270,188,.72,'#d8c9fb');
    // Chair with four grounded legs and an upright back.
    [[-449,279],[-329,279],[-449,375],[-329,375]].forEach(([x,z])=>rod(point(x,0,z),point(x,115,z),4));
    box(-465,110,266,-313,126,387,.62);
    box(-463,128,376,-315,252,388,.64);edge(point(-456,193,390),point(-322,193,390),'#bdddd7');

    // FUN: a large night window with genuine four-pane negative space.
    group='fun';
    box(156,236,-264,175,650,-248,.88);box(637,236,-264,656,650,-248,.88);
    box(156,635,-264,656,652,-248,.88);box(156,235,-264,656,252,-248,.88);
    box(399,250,-261,411,637,-248,.82);box(174,434,-261,639,447,-248,.82);
    box(140,221,-278,674,239,-230,.74);
    // Interior stars behind the panes, a particle crescent and far-off city dust.
    for(let i=0;i<105;i++){let x=185+rand()*440,y=265+rand()*355;if(Math.abs(x-405)<17||Math.abs(y-440)<17)continue;tile(x,y,-270,.7+rand()*.3,rand()<.12?'#c0c7ff':null,rand()<.15?4.2:2);}
    for(let i=0;i<340;i++){const a=rand()*Math.PI*2,r=Math.sqrt(rand())*34,x=550+Math.cos(a)*r,y=564+Math.sin(a)*r;if((x-565)**2+(y-574)**2<32**2)continue;tile(x,y,-269,.95,rand()<.12?'#c1e6e4':null,2.7);}
    for(let i=0;i<160;i++)tile(185+rand()*440,263+rand()*18,-269,.2,null,1.7);
    // Cabinet and its four connecting feet, all on one ground plane.
    [[185,-209],[613,-209],[185,-39],[613,-39]].forEach(([x,z])=>box(x,0,z,x+20,29,z+20,.6));
    box(172,26,-222,652,176,-20,.64);box(162,176,-230,662,187,-10,.8);
    edge(point(409,30,-17),point(409,168,-17),null,3.8);
    rod(point(386,100,-14),point(386,127,-14),2.4);rod(point(430,100,-14),point(430,127,-14),2.4);
    // Chessboard, equal physical squares, seated on the cabinet top.
    box(346,188,-208,532,193,-22,.58);
    for(let i=0;i<8;i++)for(let j=0;j<8;j++){
      const x=349+i*22.6,z=-205+j*22.6;
      plane(point(x,194,z),point(x+21.5,194,z),point(x,194,z+21.5),8.2,(i+j)%2?.07:.76,(i+j)%2?.14:.70,(i+j)%2?'#869ba4':null);
    }
    [[376,-169],[442,-170],[485,-99],[396,-56],[462,-39]].forEach(([x,z],i)=>{
      cylinder(x,194,z,7,5,.8,i<2?'#8cd9e5':null);cylinder(x,199,z,3.5,19,.83,i<2?'#9bdce9':null);ellipsoid(x,223,z,6.5,6.5,6.5,.9,i<2?'#9bdce9':null);
    });
    // Cards in their small holder.
    box(220,188,-67,321,197,-43,.7);
    for(let i=0;i<3;i++){
      const x=227+i*29,z=-62+i*3;
      plane(point(x,197,z),point(x+40,197,z),point(x,270+i*3,z-6),7.3,.76,.77);
      edge(point(x,270+i*3,z-6),point(x+40,270+i*3,z-6));
      for(let k=0;k<28;k++){const t=k/28*6.28;const r=7;tile(x+20+Math.sin(t)*r,236+Math.cos(t)*r,z-4,1,'#d3c0fa',2.4);}
    }
    // Crock and recognisable cooking tools.
    cylinder(602,188,-134,25,57,.65);ring(602,245,-134,25,8);
    rod(point(590,240,-134),point(573,334,-134),3.5);ellipsoid(570,348,-134,9,19,5,.9);
    rod(point(605,243,-140),point(606,332,-140),3);box(595,326,-143,618,365,-137,.76);
    rod(point(617,240,-130),point(636,330,-130),3);
    for(let k=0;k<3;k++){const ps=[];for(let t=0;t<=6.3;t+=.14)ps.push(point(639+Math.cos(t)*(7+k*2),348+Math.sin(t)*22,-130+Math.cos(t)*k*2));wire(ps,'#d8e6f0',.5,.65);ps.filter((_,i)=>i%2===0).forEach(p=>tile(p.x,p.y,p.z,.8,null,2));}
    // Racket head above and its grip actually resting at y=0.
    const rc=point(705,267,36),grip=point(686,5,112);rod(point(701,201,52),grip,3.5);
    rod(point(690,62,96),grip,5,'#badde2');ring(rc.x,rc.y,rc.z,45,70);
    for(let x=-36;x<=36;x+=10){const r=Math.sqrt(1-(x/45)**2)*64;edge(point(rc.x+x,rc.y-r,rc.z),point(rc.x+x,rc.y+r,rc.z),'#9dbbc5',7);}
    for(let y=-55;y<=55;y+=11){const r=Math.sqrt(1-(y/70)**2)*40;edge(point(rc.x-r,rc.y+y,rc.z),point(rc.x+r,rc.y+y,rc.z),'#9dbbc5',7);}
    // A paired set of shoes on the floor beside the bed, no floating props.
    [[598,223],[652,268]].forEach(([x,z],i)=>{
      box(x-43,4,z-20,x+55,12,z+21,.8);
      ellipsoid(x+3,24,z,55,21,23,.86,i?'#c7d2ee':null);ellipsoid(x-25,37,z,20,25,21,.78);
      for(let j=0;j<5;j++)edge(point(x-12+j*8,44-j*2,z-11),point(x-12+j*8,44-j*2,z+11),'#e7f2f4',4);
    });

    // NEURO: a horizontal bed, and a person lying flat on their back, head to the right.
    group='neuro';
    [[-147,389],[442,389],[-147,685],[442,685]].forEach(([x,z])=>box(x,0,z,x+22,53,z+20,.7));
    box(-173,42,365,478,72,716,.74);box(-166,73,373,469,107,708,.78);
    box(472,39,363,487,143,718,.63);box(-181,40,363,-166,111,718,.65);
    // Pillow uses a densely sampled, softly rounded actual volume.
    ellipsoid(392,151,538,91,19,124,.50);
    // Body and matched upper arms are supine along the bed's long axis.
    ellipsoid(205,132,538,135,28,78,.68);
    ellipsoid(305,139,538,55,24,88,.76);
    ellipsoid(215,135,450,98,18,18,.67);ellipsoid(215,135,626,98,18,18,.67);
    ellipsoid(355,163,538,31,18,28,.72);
    // Head: the flat plane of the face points toward +Y, never a side profile.
    const headStart=particles.length;
    ellipsoid(410,193,538,65,38,56,.96);
    // A translucent scalp reveals the brain while preserving one connected head.
    for(let i=headStart;i<particles.length;i++){
      const p=particles[i];p.a*=p.x>416&&p.y>190?.14:.86;
    }
    // The skull silhouette encloses the face and the inset brain in the same volume.
    const view=point(.157036*65,.316264*38,.932756*56),n=mul(view,1/length(view));
    const u0=point(n.z,0,-n.x),u=mul(u0,1/length(u0));
    const v=point(n.y*u.z-n.z*u.y,n.z*u.x-n.x*u.z,n.x*u.y-n.y*u.x),skullRim=[];
    for(let t=0;t<=Math.PI*2+.04;t+=.06){
      const q=add(mul(u,Math.cos(t)),mul(v,Math.sin(t)));
      skullRim.push(point(410+65*q.x,193+38*q.y,538+56*q.z));
    }
    wire(skullRim,'#cbdde6',.5,.8,true);
    // Blanketed body. Vary the height continuously so the cloud reads as cloth.
    for(let x=-162;x<=272;x+=10.1)for(let z=382;z<=701;z+=10.1){if(rand()>.61)continue;const y=132+Math.sin((z-382)/319*Math.PI)*12+Math.sin((x+162)*.035)*2.7;tile(x,y,z,.49,null,2.9);}
    plane(point(-162,78,707),point(273,78,707),point(-162,132,707),9.8,.52,.24);
    plane(point(-163,80,382),point(-163,80,707),point(-163,133,382),9.8,.54,.28);
    // Fold across the chest, plus a few regular, unbroken longitudinal ridges.
    for(let z=382;z<=701;z+=6.2)tile(269,145+Math.sin((z-382)/319*Math.PI)*7,z,.95,rand()<.12?'#b9dfe1':null,2.7);
    for(let z=415;z<690;z+=53){const ps=[];for(let x=-150;x<250;x+=10)ps.push(point(x,146+Math.sin((x+162)*.035)*2.7,z));wire(ps,'#c4dde8',.18,.7);}
    // Two closed eyes, centered nose and mouth: symmetric top-facing facial features.
    for(const side of [-1,1]){
      const ps=[];for(let i=0;i<=16;i++){const t=-1+i/8;ps.push(point(407-5*(1-t*t),227,538+side*19+t*8.5));}
      wire(ps,'#02040a',1,5.8,true);wire(ps,'#c1e9f2',.8,.95,true);
    }
    wire([point(394,229,538),point(383,229,538),point(383,228,543)],'#b3d8e0',.8,.9,true);
    const mouth=[];for(let i=0;i<=12;i++){const t=-1+i/6;mouth.push(point(372-2.5*(1-t*t),224,538+t*10.5));}wire(mouth,'#03060a',1,3.2,true);wire(mouth,'#d8c4ee',.8,.75,true);
    // Two hemispheres sit inside the cranium, behind the sleeping face.
    const brainStart=particles.length;
    const brainColor=() => rand()<.48?'#ffc0df':rand()<.58?'#ddc6ff':'#fff0fa';
    for(let i=0;i<8;i++){
      const t=i/8*6.28;ellipsoid(432+Math.cos(t)*12,207+Math.sin(t)*2,538+Math.sin(t)*18,14,8,13,.88,brainColor());
    }
    ellipsoid(432,210,538,19,9,22,.8,'#fff0fa');
    // Suggest folds with shaded surface dots, sharing the brain's depth and motion.
    for(let i=brainStart;i<particles.length;i++){
      const p=particles[i];
      if(p.y<211)continue;
      let distance=Math.abs(p.z-538-Math.sin(p.x*.25));
      const sideDistance=Math.abs(p.z-538);
      if(sideDistance>=7&&sideDistance<=23){
        const t=(sideDistance-7)/8-1;
        for(let j=0;j<3;j++)distance=Math.min(distance,Math.abs(p.x-418-j*13-Math.sin(t*4+j)*3));
      }
      if(distance<2.1){p.c='#b794c9';p.a*=.72;p.s*=.9;}
    }

    // Deliberate, sparse debris and stars; black space remains the dominant background.
    for(let i=0;i<125;i++)stars.push({x:35+rand()*1530,y:25+rand()*980,s:rand()<.06?2:1,a:.1+rand()*.34,t:rand()*6.28});
    for(let i=0;i<260;i++){
      const p=particles[Math.floor(rand()*particles.length)];dust.push({x:p.x+(rand()-.5)*65,y:p.y+(rand()-.4)*40,z:p.z+(rand()-.5)*60,g:p.g,s:1+rand()*1.2,a:.13+rand()*.18,c:rand()<.2?'#9bcde3':'#e4edf1',t:rand()*6.28});
    }
    // Stable painter order makes the physical scene coherent while keeping each frame inexpensive.
    const deskYaw=28*Math.PI/180,deskCos=Math.cos(deskYaw),deskSin=Math.sin(deskYaw);
    function orient(p,g=p.g){
      if(g!=='serious')return p;
      const x=p.x+375,z=p.z-120;
      return point(-375+x*deskCos+z*deskSin,p.y,120-x*deskSin+z*deskCos);
    }
    function depth(p){const q=orient(p);return q.z*.92+q.y*.3+q.x*.12;}
    particles.sort((a,b)=>depth(a)-depth(b));
    const clusterRects={serious:[90,260,610,610],fun:[950,40,590,835],neuro:[500,635,820,380]};
    let width=0,height=0,dpr=1,fit=1,ox=0,oy=0,raf=0,disposed=false;
    let hover=null, active=null, transition=null, time0=performance.now(), last=0, lastPaint=0, driftTime=0;
    let pointer={x:0,y:0},parallax={x:0,y:0};
    const homeCamera={a:1,b:0,c:0,d:1,tx:-W/2,ty:-H/2,z:1};
    let camera={...homeCamera};
    function base(p,g=p.g){const q=orient(p,g);return{x:800+q.x*.986-q.z*.166,y:730+q.x*.052-q.y*.946+q.z*.312};}
    function objectBounds(key){
      // The window entry is the upper-right pane, with the crescent moon.
      const ranges=key==='serious'?[[-482,-270],[260,429],[-43,143]]:[[411,637],[447,635],[-270,-248]];
      const corners=[];
      for(const x of ranges[0])for(const y of ranges[1])for(const z of ranges[2])corners.push(base(point(x,y,z),key));
      const xs=corners.map(p=>p.x),ys=corners.map(p=>p.y);
      const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
      return{x:(left+right)/2,y:(top+bottom)/2,width:right-left,height:bottom-top};
    }
    function focusFor(key){
      let center,z,a=1,b=0,c=0,d=1;
      if(key==='neuro'){center=base(point(432,207,538),'neuro');z=12;}
      else {
        const bounds=objectBounds(key);
        center=bounds;
        const wholeObjectFit=Math.min(width/(bounds.width*fit),height/(bounds.height*fit))*.94;
        z=Math.min(22,wholeObjectFit*(key==='serious'?2.4:2.8));
        // Finish facing the selected entry plane directly.
        const origin=base(point(0,0,0),key),right=base(point(1,0,0),key);
        const down=base(point(0,-1,key==='serious'?38/160:0),key);
        const ux=right.x-origin.x,uy=right.y-origin.y,vx=down.x-origin.x,vy=down.y-origin.y;
        const determinant=ux*vy-uy*vx;
        a=vy/determinant;b=-vx/determinant;c=-uy/determinant;d=ux/determinant;
      }
      return{a:a*z,b:b*z,c:c*z,d:d*z,tx:-z*(a*center.x+b*center.y),ty:-z*(c*center.x+d*center.y),z};
    }
    function project(p,g=p.g){const q=base(p,g),depth=(orient(p,g).z+280)/900,x=q.x+parallax.x*depth,y=q.y+parallax.y*depth;return{x:ox+(W/2+camera.a*x+camera.b*y+camera.tx)*fit,y:oy+(H/2+camera.c*x+camera.d*y+camera.ty)*fit};}
    function resize(){const r=holder.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';fit=Math.min(width/W,height/H);ox=(width-W*fit)/2;oy=(height-H*fit)/2;positionButtons();}
    function positionButtons(){for(const key of Object.keys(buttons)){const [x,y,w,h]=clusterRects[key],b=buttons[key];b.style.left=(ox+x*fit)+'px';b.style.top=(oy+y*fit)+'px';b.style.width=w*fit+'px';b.style.height=h*fit+'px';b.style.pointerEvents=active?'none':'auto';}}
    for(const key of ['serious','fun','neuro']){
      const button=document.createElement('button');button.type='button';button.className='scene-hotspot';button.dataset.zone=key;button.setAttribute('aria-label',`Explore ${key==='fun'?'just-for-fun':key==='neuro'?'neuroscience':'serious'} projects`);
      const label=document.createElement('span');label.className='hotspot-label';label.textContent=LABELS[key];button.appendChild(label);
      if(key==='fun')button.style.clipPath='polygon(5% 0,90% 0,100% 76%,82% 100%,64% 92%,66% 70%,0 76%)';
      if(key==='serious')button.style.clipPath='polygon(0 10%,85% 0,100% 78%,82% 100%,10% 98%)';
      if(key==='neuro')button.style.clipPath='polygon(8% 16%,74% 0,93% 0,100% 40%,95% 88%,11% 100%,0 55%)';
      button.addEventListener('mouseenter',()=>setHover(key));button.addEventListener('mouseleave',()=>setHover(null));button.addEventListener('focus',()=>setHover(key));button.addEventListener('blur',()=>setHover(null));
      button.addEventListener('click',()=>{if(!active&&options.onSelect)options.onSelect(key,button);});
      holder.appendChild(button);buttons[key]=button;
    }
    function setHover(key){hover=LABELS[key]?key:null;holder.dataset.sceneHover=hover||'';}
    const onPointer=e=>{const r=holder.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*13;pointer.y=((e.clientY-r.top)/r.height-.5)*8;};
    const onLeave=()=>{pointer.x=0;pointer.y=0;};
    holder.addEventListener('pointermove',onPointer,{passive:true});holder.addEventListener('pointerleave',onLeave);
    const ro=new ResizeObserver(resize);ro.observe(holder);resize();
    function animateTo(target,duration=920){
      if(transition)transition.resolve();
      if(media.matches){camera={...target};return Promise.resolve();}
      return new Promise(resolve=>{transition={from:{...camera},to:target,start:performance.now(),duration,resolve};});
    }
    function enter(key){if(!LABELS[key])return Promise.resolve();active=key;hover=key;pointer={x:0,y:0};parallax={x:0,y:0};positionButtons();return animateTo(focusFor(key),1120);}
    function leave(){active=null;hover=null;pointer={x:0,y:0};parallax={x:0,y:0};const promise=animateTo({...homeCamera},900);promise.then(positionButtons);return promise;}
    function drawWire(w,boost=1){ctx.beginPath();w.p.forEach((p,i)=>{const q=project(p,w.g);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.strokeStyle=w.c;ctx.globalAlpha=w.a*boost;ctx.lineWidth=Math.max(.4,w.w*fit*Math.min(camera.z,3));ctx.stroke();}
    function drawDot(x,y,size){
      // Align to physical pixels so smaller dots stay crisp on high-density screens.
      const s=Math.max(.5/dpr,size*DOT_SCALE);
      ctx.fillRect(Math.round((x-s/2)*dpr)/dpr,Math.round((y-s/2)*dpr)/dpr,s,s);
    }
    function draw(now){
      if(disposed)return;raf=requestAnimationFrame(draw);if(!transition&&now-lastPaint<33.3)return;lastPaint=now;const elapsed=now-time0,dt=Math.min(50,now-last||16);last=now;
      if(!media.matches&&!active&&!transition)driftTime+=dt;
      parallax.x=lerp(parallax.x,media.matches||active?0:pointer.x,Math.min(1,dt*.006));parallax.y=lerp(parallax.y,media.matches||active?0:pointer.y,Math.min(1,dt*.006));
      if(transition){
        const t=Math.min(1,(now-transition.start)/transition.duration),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
        const from=transition.from,to=transition.to;
        // Interpolate the displayed affine transform, so every tile follows a straight path.
        camera=Object.fromEntries(Object.keys(homeCamera).map(key=>[key,lerp(from[key],to[key],e)]));
        if(t===1){const done=transition.resolve;transition=null;done();}
      }
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;ctx.fillStyle='#000000';ctx.fillRect(0,0,width,height);
      if(camera.z<1.6){
        for(const star of stars){const twinkle=media.matches?1:.8+.2*Math.sin(elapsed*.00035+star.t);ctx.globalAlpha=star.a*twinkle*(1-(camera.z-1)/.6);ctx.fillStyle='#d2e3ed';drawDot(ox+star.x*fit,oy+star.y*fit,star.s*fit);}
        // One thin, incomplete orbit, rather than a floor or walls full of points.
        ctx.globalAlpha=.16;ctx.strokeStyle='#7a9bb0';ctx.lineWidth=.55;ctx.beginPath();ctx.ellipse(ox+830*fit,oy+610*fit,665*fit,222*fit,-.19,Math.PI*.92,Math.PI*1.86);ctx.stroke();
      }
      for(const w of wires)drawWire(w,hover&&hover!==w.g?.5:1);
      let previousColor='';
      for(const p of particles){
        const q=project(p);
        if(!media.matches){
          const dx=Math.sin(driftTime*.00055+p.flicker)*2.4,dy=Math.cos(driftTime*.00043+p.flicker*1.7)*1.8;
          q.x+=(camera.a*dx+camera.b*dy)*fit;q.y+=(camera.c*dx+camera.d*dy)*fit;
        }
        if(q.x<-15||q.x>width+15||q.y<-15||q.y>height+15)continue;
        const s=p.s*fit*camera.z;const glow=hover===p.g?1.16:hover?.58:1;
        const flicker=media.matches?1:.96+.04*Math.sin(elapsed*.00042+p.flicker);
        ctx.globalAlpha=Math.min(1,p.a*glow*flicker);if(p.c!==previousColor){ctx.fillStyle=p.c;previousColor=p.c;}
        drawDot(q.x,q.y,s);
      }
      if(camera.z<2){for(const p of dust){const q=project(p),drift=media.matches?0:Math.sin(driftTime*.00017+p.t)*2;ctx.globalAlpha=p.a*(hover&&hover!==p.g?.45:1);ctx.fillStyle=p.c;drawDot(q.x+camera.b*drift*fit,q.y+camera.d*drift*fit,p.s*fit*camera.z);}}
      for(const w of features)drawWire(w,hover&&hover!==w.g?.6:1);
      ctx.globalAlpha=1;
    }
    raf=requestAnimationFrame(draw);
    return {enter,leave,setHover,dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();holder.removeEventListener('pointermove',onPointer);holder.removeEventListener('pointerleave',onLeave);canvas.remove();Object.values(buttons).forEach(b=>b.remove());if(transition)transition.resolve();},canvas,buttons,particleCount:particles.length};
  }
  window.createParticleRoom=createParticleRoom;
})();
