// Elements
const nameInput = document.getElementById('nameInput');
const wishBtn = document.getElementById('wishBtn');
const wishArea = document.getElementById('wishArea');
const wishText = document.getElementById('wishText');
const againBtn = document.getElementById('againBtn');
const toggleMusic = document.getElementById('toggleMusic');
const bgMusic = document.getElementById('bgMusic');

const wishes = [
  name => `Chúc ${name} một ngày 20/10 thật rực rỡ và ngọt ngào như chính nụ cười của bạn.\n\nMong rằng hôm nay và mỗi ngày sau đều tràn ngập niềm vui, hạnh phúc và những điều bình dị nhưng ấm áp.\n\nCảm ơn vì bạn luôn tỏa sáng, luôn là nguồn cảm hứng và là bông hoa xinh đẹp trong cuộc sống này.\n\nHãy luôn tự tin, yêu đời và mỉm cười thật nhiều nhé! 💐💖`,
  name => `Gửi ${name} — bông hoa đáng yêu:\n\nChúc bạn 20/10 nhận được thật nhiều yêu thương, những cái ôm ấm áp và những nụ cười không tắt.\n\nDù cuộc sống có bộn bề, vẫn luôn có những điều bình dị để ta trân trọng.\n\nChúc bạn luôn mạnh mẽ, rạng rỡ và hạnh phúc theo cách riêng của mình.`,
  name => `${name} ơi, hôm nay là ngày của bạn —\n\nChúc bạn những phút giây ngọt ngào, những tin nhắn bất ngờ và cả những khoảnh khắc nhỏ bé nhưng ấm áp.\n\nMỗi ngày đều xứng đáng để tỏa sáng. Chúc bạn 20/10 thật ý nghĩa!`
];

function getRandomWish(name){
  const fn = wishes[Math.floor(Math.random()*wishes.length)];
  return fn(name);
}

wishBtn.addEventListener('click', () => {
  let name = nameInput.value.trim();
  if(!name) { alert('Hãy nhập tên của bạn nhé 💐'); return; }
  const text = getRandomWish(name);
  wishText.textContent = text;
  wishArea.classList.remove('hidden');
  // try to play music (may be blocked by browser until user interacts)
  bgMusic.play().catch(()=>{});
  toggleMusic.textContent = '🔇 Tắt nhạc';
  // create effects
  spawnHeartsAndFlowers();
});

againBtn.addEventListener('click', () => {
  const name = nameInput.value.trim() || 'Bạn';
  wishText.textContent = getRandomWish(name);
  spawnHeartsAndFlowers();
});

toggleMusic.addEventListener('click', () => {
  if(bgMusic.paused){
    bgMusic.play();
    toggleMusic.textContent = '🔇 Tắt nhạc';
  } else {
    bgMusic.pause();
    toggleMusic.textContent = '🔈 Bật nhạc';
  }
});

// Canvas falling hearts & flowers
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let items = [];
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

function spawnHeartsAndFlowers(){
  for(let i=0;i<30;i++){
    items.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*200,
      vy: 1 + Math.random()*2,
      size: 16 + Math.random()*18,
      type: Math.random() > 0.5 ? 'heart' : 'flower',
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*0.02
    });
  }
}

function drawHeart(x,y,s){
  ctx.save();
  ctx.translate(x,y); ctx.scale(1,-1);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(-s/2,-s/2,-s,s/3,0,s);
  ctx.bezierCurveTo(s,s/3,s/2,-s/2,0,0);
  ctx.fill();
  ctx.restore();
}

function drawFlower(x,y,s){
  ctx.save();
  ctx.translate(x,y);
  for(let i=0;i<5;i++){
    ctx.rotate((Math.PI*2)/5);
    ctx.beginPath();
    ctx.ellipse(0, s*0.5, s*0.22, s*0.6, 0, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=items.length-1;i>=0;i--){
    const it = items[i];
    it.y += it.vy;
    it.x += Math.sin(it.y*0.01)*0.5;
    it.rot += it.vr;
    // gradient color pinks
    if(it.type==='heart') ctx.fillStyle = `rgba(255,92,138,0.95)`;
    else ctx.fillStyle = `rgba(255,150,190,0.95)`;
    if(it.type==='heart') drawHeart(it.x,it.y,it.size);
    else drawFlower(it.x,it.y,it.size);
    if(it.y > canvas.height+40) items.splice(i,1);
  }
  requestAnimationFrame(animate);
}
animate();