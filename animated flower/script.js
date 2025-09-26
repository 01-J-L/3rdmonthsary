document.addEventListener("DOMContentLoaded", () => {
  const flower = document.querySelector("#animation-flower");
  const word = document.querySelector("h1");
  const rainDrop = document.querySelector(".rain-drop");

  setTimeout(() => {
    flower.style.display = "inherit";
    word.style.display = "none";
  }, 2000);
});

function createRaindrop() {
  const body = document.querySelector("body");
  const xPosition = Math.random() * window.innerWidth;
  const delay = Math.random() * 5;
  const duration = Math.random() * 2 + 2;

  const rainDrop = document.createElement("div");
  rainDrop.className = "rain";
  rainDrop.style.left = `${xPosition}px`;
  rainDrop.style.animationDelay = `${delay}s`;
  rainDrop.style.animationDuration = `${duration}s`;
  rainDrop.style.display = "none";
  body.appendChild(rainDrop);

  setTimeout(() => {
    rainDrop.style.display = "inherit";
  }, 800);
}

setInterval(createRaindrop, 100);

document.addEventListener("DOMContentLoaded", () => {
  const flower = document.querySelector("#animation-flower");
  const word = document.querySelector("h1");
  const rainDrop = document.querySelector(".rain-drop");

  setTimeout(() => {
    flower.style.display = "inherit";
    word.style.display = "none";
  }, 2000);

  // --- NEW: MUSIC PLAYER LOGIC ---
  const myAudio = document.getElementById("background-music");
  const promise = myAudio.play();

  if (promise !== undefined) {
    promise.catch((error) => {
      // Autoplay was prevented. Music will start on the first user interaction.
      console.warn(
        "Autoplay was prevented. Music will start on the first click/tap."
      );
      const playOnInteraction = () => {
        myAudio.play();
        // Remove the listeners after the music starts
        document.body.removeEventListener("click", playOnInteraction);
        document.body.removeEventListener("touchstart", playOnInteraction);
      };
      document.body.addEventListener("click", playOnInteraction);
      document.body.addEventListener("touchstart", playOnInteraction);
    });
  }
});

function createRaindrop() {
  const body = document.querySelector("body");
  const xPosition = Math.random() * window.innerWidth;
  const delay = Math.random() * 5;
  const duration = Math.random() * 2 + 2;

  const rainDrop = document.createElement("div");
  rainDrop.className = "rain";
  rainDrop.style.left = `${xPosition}px`;
  rainDrop.style.animationDelay = `${delay}s`;
  rainDrop.style.animationDuration = `${duration}s`;
  rainDrop.style.display = "none";
  body.appendChild(rainDrop);

  setTimeout(() => {
    rainDrop.style.display = "inherit";
  }, 800);
}

setInterval(createRaindrop, 100);