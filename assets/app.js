(()=>{var w=t=>[...document.querySelectorAll(t)],y=t=>{let a=document.querySelector(t.currentTarget.hash);a&&t.currentTarget.dataset.noscroll===void 0&&t.currentTarget.hash&&t.currentTarget.pathname===window.location.pathname&&!t.metaKey&&(t.preventDefault(),a.scrollIntoView({behavior:"smooth"}))},g=t=>new Promise(a=>{let i=document.createElement("img");i.onload=()=>a(i),i.src=t}),u=(t,a,i,f)=>{let l=a.width,e=a.height,s=t.canvas.width,o=t.canvas.height,n=s,d=o;if(i!=="stretch"){let h=1;i==="contain"&&(h=Math.min(s/l,o/e)),i==="cover"&&(h=Math.max(s/l,o/e)),i==="balance"&&(h=(s/l+o/e)*.5),n=Math.floor(l*h),d=Math.floor(e*h)}let r=f==="hoist"?0:(s-n)/2,c=(o-d)/2;t.drawImage(a,r,c,n,d),n<s&&(t.drawImage(a,0,0,1,e,0,c,r,d),t.drawImage(a,l-1,0,1,e,r+n,c,s-(n+r),d)),d<o&&(t.drawImage(a,0,0,l,1,r,0,n,c),t.drawImage(a,0,e-1,l,1,r,d+c,n,c)),t.restore()};w("a[href*='#']").forEach(t=>t.addEventListener("click",y));w("[data-component='image-diff'").forEach(async t=>{let a=t.querySelector("canvas"),i=t.querySelector(".status-count"),f=await g(t.dataset.a),l=await g(t.dataset.b),e=a.getContext("2d",{willReadFrequently:!0});a.width*=window.devicePixelRatio,a.height*=window.devicePixelRatio;let s=()=>{let o=t.resize.value,n=t.align.value,d=1.5,{width:r,height:c}=a;e.filter=`contrast(${d})`,e.globalCompositeOperation="source-over",u(e,f,o,n),e.globalCompositeOperation="difference",u(e,l,o,n);let{data:h}=e.getImageData(0,0,r,c);e.fillStyle="white",e.globalCompositeOperation="color",e.fillRect(0,0,r,c),e.globalCompositeOperation="difference",e.fillRect(0,0,r,c),e.fillStyle="#121e25",e.globalCompositeOperation="lighten",e.fillRect(0,0,r,c);let m=h.reduce((p,v,b)=>p+(b%4===3?0:v/255))/(h.length*.75);i.innerHTML=(m*100).toFixed(1)+"%"};t.addEventListener("submit",o=>{o.preventDefault()}),t.addEventListener("input",o=>{s()}),s()});})();
