// Generate a QR code for the current page
function generateQRCode() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;

    if (!url.startsWith('http')) { // If address doesn't start with "http"
      var qrContainer = document.getElementById('qrcode');
      qrContainer.innerHTML = '<img src="img/empty_page.png" alt="Empty page" style="max-width: 100%; max-height: 100%;  transform: scale(1);">';
      document.getElementById('save').style.display = 'none'; // Hide the "save" button
      return;
    }
    
    var qrCode = 'https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=' + encodeURIComponent(url) + '&chco=0D1E44';
    var qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '<img src="' + qrCode + '" style="width: 100%; height: 100%; object-fit: contain;">';
    document.getElementById('save').style.display = 'block'; // Show the "save" button
  });
}


// Add event handlers for buttons
function saveQRCode() {
  // Get the element with the QR code and create a new image element
  var qrContainer = document.getElementById('qrcode');
  var img = new Image();
  
  // Set the "crossOrigin" flag on the image to access the pixels of the QR code
  img.crossOrigin = "Anonymous";
  
// After loading the image
  img.onload = function() {
    // Create the canvas and adjust its dimensions
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    
    // Draw the image on the canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 500, 500);
      
    // Convert the canvas to a "blob" and load it as a PNG image
    canvas.toBlob(function(blob) {
      var date = new Date().toLocaleString().replace(/[.:]/g, '-').replace(/\s/g, '_'); // replace dots and colons with hyphens, replace spaces with underscores
      var url = new URL(img.src).searchParams.get('chl'); // Get URL encoded in QR code
      var hostname = new URL(url).hostname; // Extract the hostname from the URL
      var filename = hostname + '-' + date + '.png'; // Form the file name
      filename = filename.replace(/[^\w\s.-]/gi, '_'); // Replace forbidden characters with "_" sign
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: filename
      });
    });
  };
  
  // Download the image
  img.src = qrContainer.firstChild.src;
}


// Add event handlers for buttons
document.addEventListener('DOMContentLoaded', function() {
  generateQRCode();
  document.getElementById('save').addEventListener('click', saveQRCode);
});