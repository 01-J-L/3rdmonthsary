let self = window;

(function (self, time) {
  var canvas,
    context,
    box,
    particles = [],
    dirtyRegions = [],
    mouse = { x: -99999, y: -99999 },
    forceFactor = false,
    minForce = 0,
    maxForce = 500,
    colors = ["rgb(255, 255, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 0)"],
    lastWord = time,
    FPS = 60;

  // REMOVED: All dat.GUI and Settings-related code is gone.

  function init() {
    var body;
    body = document.querySelector("body");

    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = -1;
    canvas.style.background = "radial-gradient(rgb(0, 230, 0), rgb(0, 100, 0))";

    box = document.createElement("div");
    box.className = 'text-container';

    // REMOVED: Dynamic audio element creation is gone.

    body.appendChild(canvas);
    body.appendChild(box);

    if (!!capable()) {
      context = canvas.getContext("2d");

      if ("ontouchstart" in window) {
        document.addEventListener("touchstart", onTouchStart, false);
        document.addEventListener("touchend", onTouchEnd, false);
        document.addEventListener("touchmove", onTouchMove, false);
      } else {
        document.addEventListener("mousedown", onMouseDown, false);
        document.addEventListener("mouseup", onMouseUp, false);
        document.addEventListener("mousemove", onMouseMove, false);
      }

      window.onresize = onResize;

      onResize();
      pulse();
      
      // NEW: Play music automatically on load
      playMusic();

    } else {
      console.error("Please update your browser to see this animation.");
    }
  }
  
  // NEW: Function to handle playing audio
  function playMusic() {
    var audio = document.querySelector("#background-music");
    var promise = audio.play();

    if (promise !== undefined) {
      promise.catch(error => {
        // Autoplay was prevented. Play on first user interaction.
        console.warn("Autoplay was prevented. Music will start on first click/tap.");
        
        function playAudioOnInteraction(event) {
            // Don't play if the user is clicking the home button
            if (event.target.closest('.home-button')) return;
            
            audio.play();
            // Remove listeners so they don't fire again
            document.body.removeEventListener('mousedown', playAudioOnInteraction);
            document.body.removeEventListener('touchstart', playAudioOnInteraction);
        }

        document.body.addEventListener('mousedown', playAudioOnInteraction);
        document.body.addEventListener('touchstart', playAudioOnInteraction);
      });
    }
  }


  function capable() {
    return canvas.getContext && canvas.getContext("2d");
  }

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    dirtyRegions = [];
    createParticles();
  }

  function onMouseDown(event) { event.preventDefault(); forceFactor = true; }
  function onMouseUp(event) { event.preventDefault(); forceFactor = false; }
  function onMouseMove(event) {
    event.preventDefault();
    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;
  }

  function onTouchStart(event) {
    if (event.target.closest('.home-button')) return;
    event.preventDefault();
    forceFactor = true;
  }
  
  function onTouchEnd(event) {
    if (event.target.closest('.home-button')) return;
    event.preventDefault();
    forceFactor = false;
  }
  
  function onTouchMove(event) {
    if (event.target.closest('.home-button')) return;
    event.preventDefault();
    if (event.touches.length > 0) {
      mouse.x = event.touches[0].pageX - canvas.offsetLeft;
      mouse.y = event.touches[0].pageY - canvas.offsetTop;
    }
  }

  function createParticles() {
    const width = canvas.width;
    const height = canvas.height;
    for (var quantity = 0, len = 100; quantity < len; quantity++) {
      var x = 10 + (width / len) * quantity;
      var y = height / 2;
      var radius = ~~(Math.random() * 15);
      particles.push({
        x: x, y: y, goalX: x, goalY: y,
        top: 4 + Math.random() * -8,
        bottom: -15 + Math.random() * -20,
        left: -15 + Math.random() * -20,
        right: -5 + Math.random() * -10,
        radius: radius,
        color: colors[~~(Math.random() * colors.length)],
      });
      dirtyRegions.push({ x: x, y: y, radius: radius });
    }
  }

  function pulse() {
    var word = "Stop scrolling for a moment. ❤";
    if (+new Date().getTime() - lastWord > 7000) word = "Relax. ❤";
    if (+new Date().getTime() - lastWord > 14000) word = "Stop overthinking. ❤";
    if (+new Date().getTime() - lastWord > 21000) word = "Focus on the present. ❤";
    if (+new Date().getTime() - lastWord > 28000) word = "Don’t think about your problems for now. ❤";
    if (+new Date().getTime() - lastWord > 35000) word = "Everything will be okay ❤";
    if (+new Date().getTime() - lastWord > 42000) word = "I always gonna love you. ❤";
    if (+new Date().getTime() - lastWord > 49000) word = "Just be happy and have faith to God!. ❤";
    
    box.innerHTML = '<p>' + word + '</p>';

    clear();
    update();
    render();

    requestAnimFrame(pulse);
  }

  function checkBounds() {
    [].forEach.call(particles, function (particle) {
      if (particle.x > canvas.width + particle.radius * 2) { particle.goalX = -particle.radius; particle.x = -particle.radius; }
      if (particle.y > canvas.height + particle.radius * 2) { particle.goalY = -particle.radius; particle.y = -particle.radius; }
      if (particle.x < -particle.radius * 2) { particle.radius *= 4; particle.goalX = canvas.width + particle.radius; particle.x = canvas.width + particle.radius; }
      if (particle.y < -particle.radius * 2) { particle.radius *= 4; particle.goalY = canvas.height + particle.radius; particle.y = canvas.height + particle.radius; }
    });
  }

  function clear() {
    [].forEach.call(dirtyRegions, function (dirty) {
      var width = 2 * dirty.radius + 4;
      var height = width;
      var x = dirty.x - width / 2;
      var y = dirty.y - height / 2;
      context.clearRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
    });
  }

  function update() {
    particles.forEach(function (particle, index) {
      var angle, steps, center = {};
      angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
      steps = (Math.PI * 2 * index) / particles.length;
      center.x = canvas.width * 0.5;
      center.y = canvas.height * 0.5;
      particle.x += Math.cos(angle) * distanceTo(particle, mouse) + (particle.goalX - particle.x) * 0.08;
      particle.y += Math.sin(angle) * distanceTo(particle, mouse) + (particle.goalY - particle.y) * 0.08;
      if (!!forceFactor) minForce = Math.min(minForce + 5, 2000);
      else minForce = Math.max(minForce - 5, 0);
      particle.radius *= 0.96;
      if (particle.radius <= 2) particle.radius = ~~(Math.random() * 15);
      if (+new Date().getTime() - time > 3000 && +new Date().getTime() - time < 6000) {
        const heartScale = Math.min(canvas.width, canvas.height) / 1000;
        particle.goalX = center.x + (180 * Math.pow(Math.sin(index), 3)) * heartScale;
        particle.goalY = center.y + (10 * -(15 * Math.cos(index) - 5 * Math.cos(2 * index) - 2 * Math.cos(3 * index) - Math.cos(4 * index))) * heartScale;
      }
      if (+new Date().getTime() - time > 6000 && +new Date().getTime() - time < 15000) {
        maxForce = 3000;
        particle.goalX += particle.top;
        particle.goalY += particle.bottom;
        checkBounds();
      }
      if (+new Date().getTime() - time > 15000 && +new Date().getTime() - time < 18000) {
        maxForce = 500;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;
        particle.goalX = center.x + radius * Math.cos(steps);
        particle.goalY = center.y + radius * Math.sin(steps);
      }
      if (+new Date().getTime() - time > 18000 && +new Date().getTime() - time < 21000) {
        const radius = Math.min(canvas.width, canvas.height) * 0.03;
        const angle = index * 0.2;
        particle.goalX = center.x + angle * radius * Math.cos(angle);
        particle.goalY = center.y + angle * radius * Math.sin(angle);
      }
      if (+new Date().getTime() - time > 21000 && +new Date().getTime() - time < 30000) {
        maxForce = 3000;
        particle.goalX += particle.left;
        particle.goalY += particle.right;
        checkBounds();
      }
      if (+new Date().getTime() - time > 30000 && +new Date().getTime() - time < 33000) {
        maxForce = 500;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;
        particle.goalX = center.x + radius * Math.cos(steps);
        particle.goalY = center.y + radius * Math.tan(steps);
      }
      if (+new Date().getTime() - time > 33000 && +new Date().getTime() - time < 36000) {
        particle.goalX = 10 + (canvas.width / 100) * index;
        particle.goalY = canvas.height / 2;
      }
      if (+new Date().getTime() - time > 36000) time = +new Date().getTime();
    });
  }

  function render() {
    [].forEach.call(particles, function (particle, index) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.closePath();
      context.fill();
      context.restore();
      dirtyRegions[index].x = particle.x;
      dirtyRegions[index].y = particle.y;
      dirtyRegions[index].radius = particle.radius;
    });
  }

  function distanceTo(pointA, pointB) {
    var dx = Math.abs(pointA.x - pointB.x);
    var dy = Math.abs(pointA.y - pointB.y);
    return (minForce + maxForce) / Math.sqrt(dx * dx + dy * dy);
  }

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / FPS); }
    );
  })();

  window.addEventListener ? window.addEventListener("load", init, false) : (window.onload = init);
})(self, +new Date().getTime());