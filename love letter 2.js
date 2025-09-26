$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");

  envelope.click(function () {
    open();
  });
  btn_open.click(function () {
    open();
  });
  btn_reset.click(function () {
    close();
  });

  function open() {
    envelope.addClass("open").removeClass("close");
  }
  function close() {
    envelope.addClass("close").removeClass("open");
  }
});

$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");
  var myAudio = $("#love-song")[0]; // Get the audio element

  envelope.click(function () {
    open();
  });
  btn_open.click(function () {
    open();
  });
  btn_reset.click(function () {
    close();
  });

  function open() {
    envelope.addClass("open").removeClass("close");
    // A check to ensure the user has interacted with the page before playing audio
    var promise = myAudio.play();
    if (promise !== undefined) {
      promise.catch(error => {
        // Autoplay was prevented.
        console.log("Autoplay prevented. User must interact with the page first.");
      });
    }
  }

  function close() {
    envelope.addClass("close").removeClass("open");
    myAudio.pause(); // Pause music on close
    myAudio.currentTime = 0; // Reset music to the beginning
  }
});