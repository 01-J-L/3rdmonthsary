document.addEventListener("DOMContentLoaded", function () {
  const speedSlider = document.getElementById("speed-slider");
  const colorPicker = document.getElementById("color-picker");
  const root = document.documentElement;

  // --- HELPER FUNCTION to convert Hex color to RGB ---
  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // --- UPDATE FUNCTIONS ---

  // Function to update the swing speed
  function updateSpeed() {
    // Use the slider's value to set the --swing-duration CSS variable
    root.style.setProperty("--swing-duration", `${speedSlider.value}s`);
  }

  // Function to update the light color
  function updateColor() {
    const hexColor = colorPicker.value;
    const rgbColor = hexToRgb(hexColor);

    if (rgbColor) {
      // Set the main lamp and bulb colors
      root.style.setProperty("--lamp-color", hexColor);
      root.style.setProperty("--lamp-glow-color", hexColor);

      // Set the R, G, B components for the light cone and glow effects
      root.style.setProperty("--light-cone-r", rgbColor.r);
      root.style.setProperty("--light-cone-g", rgbColor.g);
      root.style.setProperty("--light-cone-b", rgbColor.b);
    }
  }

  // --- EVENT LISTENERS ---

  // Listen for changes on the speed slider
  speedSlider.addEventListener("input", updateSpeed);

  // Listen for changes on the color picker
  colorPicker.addEventListener("input", updateColor);

  // --- INITIAL SETUP ---
  // Run the update functions once on page load to sync with initial values
  updateSpeed();
  updateColor();
});

document.addEventListener("DOMContentLoaded", function () {
  const speedSlider = document.getElementById("speed-slider");
  const colorPicker = document.getElementById("color-picker");
  const root = document.documentElement;

  // --- HELPER FUNCTION to convert Hex color to RGB ---
  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // --- UPDATE FUNCTIONS ---

  // Function to update the swing speed
  function updateSpeed() {
    // Use the slider's value to set the --swing-duration CSS variable
    root.style.setProperty("--swing-duration", `${speedSlider.value}s`);
  }

  // Function to update the light color
  function updateColor() {
    const hexColor = colorPicker.value;
    const rgbColor = hexToRgb(hexColor);

    if (rgbColor) {
      // Set the main lamp and bulb colors
      root.style.setProperty("--lamp-color", hexColor);
      root.style.setProperty("--lamp-glow-color", hexColor);

      // Set the R, G, B components for the light cone and glow effects
      root.style.setProperty("--light-cone-r", rgbColor.r);
      root.style.setProperty("--light-cone-g", rgbColor.g);
      root.style.setProperty("--light-cone-b", rgbColor.b);
    }
  }

  // --- EVENT LISTENERS ---

  // Listen for changes on the speed slider
  speedSlider.addEventListener("input", updateSpeed);

  // Listen for changes on the color picker
  colorPicker.addEventListener("input", updateColor);

  // --- INITIAL SETUP ---
  // Run the update functions once on page load to sync with initial values
  updateSpeed();
  updateColor();

  // --- NEW: MUSIC PLAYER LOGIC ---
  const myAudio = document.getElementById("background-music");
  const promise = myAudio.play();

  if (promise !== undefined) {
    promise.catch((error) => {
      // Autoplay was prevented. We'll play on the first user interaction.
      console.warn(
        "Autoplay was prevented. Music will start on the first click/tap."
      );
      const playOnInteraction = () => {
        myAudio.play();
        // Remove the listeners after the first interaction
        document.body.removeEventListener("click", playOnInteraction);
        document.body.removeEventListener("touchstart", playOnInteraction);
      };
      document.body.addEventListener("click", playOnInteraction);
      document.body.addEventListener("touchstart", playOnInteraction);
    });
  }
});