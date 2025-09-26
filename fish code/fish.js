// Wait until the entire page is loaded before trying to play music
window.onload = function () {
  const myAudio = document.getElementById("background-music");

  // Attempt to play the audio
  const promise = myAudio.play();

  if (promise !== undefined) {
    promise
      .catch((error) => {
        // Autoplay was prevented by the browser.
        // We'll set up an event listener to play the music on the first user interaction.
        console.warn(
          "Autoplay was prevented. Music will start on the first click/tap."
        );

        const playAudioOnInteraction = () => {
          myAudio.play();
          // Once the music starts, we don't need these listeners anymore.
          document.body.removeEventListener("click", playAudioOnInteraction);
          document.body.removeEventListener("touchstart", playAudioOnInteraction);
        };

        document.body.addEventListener("click", playAudioOnInteraction);
        document.body.addEventListener("touchstart", playAudioOnInteraction);
      })
      .then(() => {
        // Autoplay started successfully.
        console.log("Audio is playing.");
      });
  }
};