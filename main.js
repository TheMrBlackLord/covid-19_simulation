const chartCnv = document.getElementById('chart');
const chartCtx = chartCnv.getContext('2d');

const cnv = document.getElementById('simulation');
const ctx = cnv.getContext('2d');

const w = window.innerWidth;
const h = window.innerHeight - 6;
const radius = 3;
const infectionRadius = 10;
const radiusInfeced = radius + infectionRadius;
const maxVelocity = 0.85;
const chance = 0.2;
const peopleNum = 100;
cnv.width = chartCnv.width = w;
cnv.height = chartCnv.height = h / 2;

let time = 5;
let infected = 0;

const chart = new Chart(chartCtx, {
   type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Infected',
            data: [],
            borderWidth: 2.5,
            fill: false,
            borderColor: 'rgba(219,11,11, .8)'
        }]
    },
   options: {
      responsive: false,
      scales: {
         xAxes: [{
            scaleLabel: {
               display: true,
               labelString: 'Time'
            },
         }],
         yAxes: [{
            scaleLabel: {
               display: true,
               labelString: 'People'
            }
         }]
      },
      tooltips: {
         mode: 'index',
         intersect: false,
         callbacks: {
            title: (tooltipItems, data) => tooltipItems[0].xLabel + ' days'
         }
      },
      elements: {
         point: {
            backgroundColor: 'rgba(219,11,11, .8)'
         },
      }
   }
});

class Man {
   constructor(x, y, isInfected=false) {
      this.x = x || Math.random() * w;
      this.y = y || Math.random() * (h/2);
      this.isInfected = isInfected;
      this.velX = Math.random() * (2 * maxVelocity) - maxVelocity;
      this.velY = Math.random() * (2 * maxVelocity) - maxVelocity;
      this.chance = Math.random();
      this.iter = 0;
   }
   draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#373737';
      ctx.fill();
      if (this.isInfected) {
         ctx.arc(this.x, this.y, radiusInfeced, 0, Math.PI * 2);
         ctx.fillStyle = 'rgba(208,31,31, 0.7)';
         ctx.fill();
      }
      ctx.closePath();
   }
   move() {
      if (this.x + this.velX > w && this.velX > 0 ||
         this.x + this.velX < 0 && this.velX < 0) this.velX *= -1;

      if (this.y + this.velY > h/2-1 && this.velY > 0 ||
         this.y + this.velY < 1 && this.velY < 0) this.velY *= -1;
      this.x += this.velX;
      this.y += this.velY;
   }
   reChance() {  
      this.chance = Math.random();
   }
}
const people = [new Man(w / 2, h * 0.25, true)];

for(let i = 1; i < peopleNum; ++i) {
   people.push(new Man);
}
setInterval(() => {
   people.forEach(man => {
      man.reChance();
   });
}, 3000);
function draw() {
   ctx.clearRect(0, 0, w, h/2);
   people.forEach(man => {
      man.move();
      man.draw();
   });
   for(let i = 0; i < people.length; ++i) {
      for(let j = i+1; j < people.length; ++j) {
         let manA = people[i];
         let manB = people[j];
         
         let dx = manB.x - manA.x;
         let dy = manB.y - manA.y;

         let dist = Math.hypot(dx, dy);

         if (dist <= radiusInfeced) {
            if (manA.isInfected && manB.chance < chance) 
                  manB.isInfected = true;
            if (manB.isInfected && manA.chance < chance)
                  manA.isInfected = true;
         }

      }
   }
   requestAnimationFrame(draw);
}
draw();

// update chart

setInterval(() => {
   if (infected < peopleNum) {
      infected = people.filter(man => man.isInfected).length;
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(infected);
      chart.update();
      time += 5;
   }
}, 5000);