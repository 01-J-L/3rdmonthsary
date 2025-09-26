var settings = {
  particles: {
    // Increased particle count for a fuller effect
    length: 1000,
    duration: 2.5, // Slightly longer duration
    velocity: 100,
    effect: -0.75,
    size: 30,
  },
};

/*
 * Request Animation Frame Polyfill
 */
(function () {
  let b = 0;
  let c = ["ms", "moz", "webkit", "o"];
  for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
    window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[c[a] + "CancelAnimationFrame"] ||
      window[c[a] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (h, e) {
      let d = new Date().getTime();
      let f = Math.max(0, 16 - (d - b));
      let g = window.setTimeout(function () {
        h(d + f);
      }, f);
      b = d + f;
      return g;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (d) {
      clearTimeout(d);
    };
  }
})();

/*
 * Point class
 */
var Point = (function () {
  function Point(x, y) {
    this.x = typeof x !== "undefined" ? x : 0;
    this.y = typeof y !== "undefined" ? y : 0;
  }
  Point.prototype.clone = function () {
    return new Point(this.x, this.y);
  };
  Point.prototype.length = function (length) {
    if (typeof length == "undefined")
      return Math.sqrt(this.x * this.x + this.y * this.y);
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  };
  Point.prototype.normalize = function () {
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  };
  return Point;
})();

/*
 * Particle class
 */
var Particle = (function () {
  function Particle() {
    this.position = new Point();
    this.velocity = new Point();
    this.acceleration = new Point();
    this.age = 0;
  }
  Particle.prototype.initialize = function (x, y, dx, dy) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * settings.particles.effect;
    this.acceleration.y = dy * settings.particles.effect;
    this.age = 0;
  };
  Particle.prototype.update = function (deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  };
  Particle.prototype.draw = function (context, image) {
    function ease(t) {
      return --t * t * t + 1;
    }
    var size = image.width * ease(this.age / settings.particles.duration);
    context.globalAlpha = 1 - this.age / settings.particles.duration;
    context.drawImage(
      image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    );
  };
  return Particle;
})();

/*
 * ParticlePool class
 */
var ParticlePool = (function () {
  var particles,
    firstActive = 0,
    firstFree = 0,
    duration = settings.particles.duration;

  function ParticlePool(length) {
    particles = new Array(length);
    for (var i = 0; i < particles.length; i++) particles[i] = new Particle();
  }
  ParticlePool.prototype.add = function (x, y, dx, dy) {
    particles[firstFree].initialize(x, y, dx, dy);
    firstFree++;
    if (firstFree == particles.length) firstFree = 0;
    if (firstActive == firstFree) firstActive++;
    if (firstActive == particles.length) firstActive = 0;
  };
  ParticlePool.prototype.update = function (deltaTime) {
    var i;
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++) particles[i].update(deltaTime);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime);
      for (i = 0; i < firstFree; i++) particles[i].update(deltaTime);
    }
    while (particles[firstActive].age >= duration && firstActive != firstFree) {
      firstActive++;
      if (firstActive == particles.length) firstActive = 0;
    }
  };
  ParticlePool.prototype.draw = function (context, image) {
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].draw(context, image);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].draw(context, image);
      for (i = 0; i < firstFree; i++) particles[i].draw(context, image);
    }
  };
  return ParticlePool;
})();

/*
 * Main Execution
 */
(function (canvas) {
  var context = canvas.getContext("2d"),
    particles = new ParticlePool(settings.particles.length),
    particleRate = settings.particles.length / settings.particles.duration,
    time,
    // NEW: Get the audio element
    myAudio = document.getElementById("background-music"),
    // NEW: A scale factor for responsiveness
    scale = 1;

  // MODIFIED: The heart shape function now uses the scale factor
  function pointOnHeart(t) {
    const s_t = Math.sin(t);
    const c_t = Math.cos(t);
    const c_2t = Math.cos(2 * t);
    const c_3t = Math.cos(3 * t);
    const c_4t = Math.cos(4 * t);

    return new Point(
      scale * 160 * Math.pow(s_t, 3),
      scale * (130 * c_t - 50 * c_2t - 20 * c_3t - 10 * c_4t + 25)
    );
  }

  // Particle image creation (unchanged, as it's a static sprite)
  var image = (function () {
    var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;
    function to(t) {
      var point = new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) -
          50 * Math.cos(2 * t) -
          20 * Math.cos(3 * t) -
          10 * Math.cos(4 * t) +
          25
      );
      point.x =
        settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
      point.y =
        settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
      return point;
    }
    context.beginPath();
    var t = -Math.PI;
    var point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
      t += 0.01;
      point = to(t);
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    context.fillStyle = "#ea80b0";
    context.fill();
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  })();

  // NEW: Function to create a particle burst at a specific point
  function createBurst(x, y) {
    const count = 100; // Create 100 particles on click
    for (var i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = settings.particles.velocity * (0.5 + Math.random() * 0.5);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      particles.add(x, y, dx, dy);
    }
  }

  function render() {
    requestAnimationFrame(render);
    var newTime = new Date().getTime() / 1000,
      deltaTime = newTime - (time || newTime);
    time = newTime;

    context.clearRect(0, 0, canvas.width, canvas.height);

    var amount = particleRate * deltaTime;
    for (var i = 0; i < amount; i++) {
      var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      var dir = pos.clone().length(settings.particles.velocity);
      particles.add(
        canvas.width / 2 + pos.x,
        canvas.height / 2 - pos.y,
        dir.x,
        -dir.y
      );
    }

    particles.update(deltaTime);
    particles.draw(context, image);
  }

  // MODIFIED: onResize now calculates the scale factor
  function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Set scale based on the smaller of the two dimensions, with some padding
    scale = Math.min(canvas.width, canvas.height) / 450;
  }
  window.onresize = onResize;

  // NEW: Add event listeners for interactive burst
  canvas.addEventListener("mousedown", function (e) {
    createBurst(e.clientX, e.clientY);
  });
  canvas.addEventListener("touchstart", function (e) {
    // Prevent the mousedown event from firing as well
    e.preventDefault();
    // Use the first touch point
    if (e.touches.length > 0) {
      createBurst(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  // Initial setup
  setTimeout(function () {
    onResize();
    render();

    // NEW: Attempt to play music when the animation starts
    var promise = myAudio.play();
    if (promise !== undefined) {
      promise.catch(error => {
        // Autoplay was prevented. User will need to click/tap to start audio.
        console.warn("Autoplay was prevented by the browser.");
        // We'll try to play again on the first user interaction
        function playAudioOnInteraction() {
            myAudio.play();
            // Remove the listener so it doesn't fire again
            document.body.removeEventListener('mousedown', playAudioOnInteraction);
            document.body.removeEventListener('touchstart', playAudioOnInteraction);
        }
        document.body.addEventListener('mousedown', playAudioOnInteraction);
        document.body.addEventListener('touchstart', playAudioOnInteraction);
      });
    }
  }, 10);
})(document.getElementById("pinkboard"));