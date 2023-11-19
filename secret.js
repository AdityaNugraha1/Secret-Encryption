document.addEventListener("DOMContentLoaded", function() {
  const encryptButton = document.getElementById("encryptButton");
  const decryptButton = document.getElementById("decryptButton");
  const imageLoader = document.getElementById("imageLoader");
  const imageLoader2 = document.getElementById("imageLoader2");
  // Encryption Handler
  encryptButton.addEventListener("click", function() {
    const formData = new FormData();
    formData.append("sessionId", getSessionId());
    formData.append("imageLoader", imageLoader.files[0]);

    fetch('http://localhost:9000/api/user/sendToServer', { // Adjust this endpoint to match your server route
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("Server response:", data);
      if (data.message) {
        handleImage();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      displayResult("An error occurred while trying to encrypt the image.");
    });
  });

  decryptButton.addEventListener("click", function() {
    const formData = new FormData();
    formData.append("sessionId", getSessionId());
    formData.append("imageLoader2", imageLoader2.files[0]);

    fetch('http://localhost:9000/api/user/sendToServer2', { // Adjust this endpoint to match your server route
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("Server response:", data);
      if (data.message) {
        handleImage2();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      displayResult("An error occurred while trying to encrypt the image.");
    });
  });
});




var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var messageInput = document.getElementById('message');

var textCanvas = document.getElementById('textCanvas');
var tctx = textCanvas.getContext('2d');

//handle decoding
var decodeCanvas = document.getElementById('imageCanvas2');
var dctx = decodeCanvas.getContext('2d');
var imageLoader = document.getElementById('imageLoader');
var imageLoader2 = document.getElementById('imageLoader2');

// Remove the event listeners that were causing the functions to be called on file selection
// imageLoader.addEventListener('change', handleImage, false);
// imageLoader2.addEventListener('change', handleImage2, false);

function handleImage() {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      textCanvas.width = img.width;
      textCanvas.height = img.height;
      tctx.font = "30px Arial";
      var messageText = (messageInput.value.length) ? messageInput.value : 'Hello';
      tctx.fillText(messageText, 10, 50);
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var textData = tctx.getImageData(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < textData.data.length; i += 4) {
        if (textData.data[i + 3] !== 0) {
          imgData.data[i + 1] = (imgData.data[i + 1] - imgData.data[i + 1] % 10) + (imgData.data[i + 1] % 10 === 7 ? 0 : 7);
        } else {
          imgData.data[i + 1] = (imgData.data[i + 1] - imgData.data[i + 1] % 10) + (imgData.data[i + 1] % 10 === 7 ? -1 : 0);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(imageLoader.files[0]);
}

function handleImage2() {
  var reader2 = new FileReader();
  reader2.onload = function (event) {
    var img2 = new Image();
    img2.onload = function () {
      decodeCanvas.width = img2.width;
      decodeCanvas.height = img2.height;
      dctx.drawImage(img2, 0, 0);
      var decodeData = dctx.getImageData(0, 0, decodeCanvas.width, decodeCanvas.height);
      for (var i = 0; i < decodeData.data.length; i += 4) {
        if (decodeData.data[i + 1] % 10 === 7) {
          decodeData.data[i] = 0;
          decodeData.data[i + 1] = 0;
          decodeData.data[i + 2] = 0;
          decodeData.data[i + 3] = 255;
        } else {
          decodeData.data[i + 3] = 0;
        }
      }
      dctx.putImageData(decodeData, 0, 0);
    };
    img2.src = event.target.result;
  };
  reader2.readAsDataURL(imageLoader2.files[0]);
}
document.getElementById('downloadEncrypted').addEventListener('click', function() {
    var canvas = document.getElementById('imageCanvas');
    var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    var link = document.createElement('a');
    link.download = 'encrypted_image.png';
    link.href = image;
    link.click();
});

document.getElementById('downloadDecrypted').addEventListener('click', function() {
    var canvas = document.getElementById('imageCanvas2');
    var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    var link = document.createElement('a');
    link.download = 'decrypted_image.png';
    link.href = image;
    link.click();
});