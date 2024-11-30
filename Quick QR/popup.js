// Function to generate the QR code for the current page URL
function generateQRCode() {
  // Query the active tab to get the current URL of the page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var url = tabs[0]?.url || ''; // Retrieve the URL or an empty string if it's undefined

    var qrContainer = document.getElementById('qrcode');
    var saveButton = document.getElementById('save');

    // If the URL is invalid (not starting with "http"), show an error image and hide the save button
    if (!url.startsWith('http')) {
      qrContainer.innerHTML = '<img src="img/empty_page.png" alt="Empty page" style="max-width: 100%; max-height: 100%; transform: scale(1);">';
      saveButton.style.display = 'none';
      return;
    }

    // Generate the QR code using the third-party API (the URL is dynamically created with the current page's URL)
    var qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(url)}&color=0d1e44`;
    qrContainer.innerHTML = `<img src="${qrCodeUrl}" style="width: 100%; height: 100%; object-fit: contain;">`;
    saveButton.style.display = 'block';
  });
}

// Function to save the generated QR code as an image file
function saveQRCode() {
  var qrContainer = document.getElementById('qrcode'); // Get the QR code container
  var img = qrContainer.querySelector('img'); // Get the image element inside the container

  // If no image is found, log an error and return
  if (!img || !img.src) {
    console.error('QR code image not found.');
    return;
  }

  // Create a canvas element to draw the image on
  var canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;

  var ctx = canvas.getContext('2d');
  var imgObj = new Image();
  imgObj.crossOrigin = 'Anonymous';

  // When the image is loaded, draw it onto the canvas
  imgObj.onload = function () {
    ctx.drawImage(imgObj, 0, 0, 1000, 1000);

    // Convert the canvas content to a Blob and download it as a PNG file
    canvas.toBlob(function (blob) {
      var date = new Date().toISOString().replace(/[:.]/g, '-');
      var filename = `QR_Code_${date}.png`;

      // Trigger the download using the Chrome downloads API
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: filename,
      });
    });
  };

  // Set the source of the image object to the QR code's image source
  imgObj.src = img.src;
}

// Event listener to run the QR code generation when the popup is loaded
document.addEventListener('DOMContentLoaded', function () {
  generateQRCode();
  document.getElementById('save').addEventListener('click', saveQRCode);
});