const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageFile = document.getElementById('image');

const crop = document.getElementById('crop')
const startDraw = document.getElementById('draw')
const rotate = document.getElementById('rotate')

const degree = document.getElementById('degree')

const theme = document.getElementById('theme')
const color = document.getElementById('color')


let iscrop = false


let image = new Image();
let isSelecting = false;
let lastX = 0;
let lastY = 0;

let cropX = 0
let cropY = 0

let cropWidth  = 0
let cropHeight = 0

imageFile.addEventListener('change', function (e) {
    let file = e.target.files[0];
    if (file) {
        let read = new FileReader();
        read.onload = function (e) {
            image.src = e.target.result;
        };
        read.readAsDataURL(file);
    }
});

image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function draw(e) {
    isSelecting = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
};

canvas.addEventListener('mousedown', draw)

canvas.addEventListener('mousemove', drawing)

function drawing(e) {
    if (isSelecting) {
        let x = e.offsetX;
        let y = e.offsetY;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }
};

function removedraw () {
    isSelecting = false;
}

canvas.addEventListener('mouseup', removedraw);

crop.addEventListener('click', function() {
    
    canvas.removeEventListener('mousedown', draw)
    canvas.removeEventListener('mousemove', drawing)
    canvas.removeEventListener('mouseup', removedraw)
    canvas.addEventListener('mousedown', startcrop)
    canvas.addEventListener('mousemove', cropping)
    canvas.addEventListener('mouseup' , cropped)

})

startDraw.addEventListener('click', function() {
    
    canvas.removeEventListener('mousedown', startcrop)
    canvas.removeEventListener('mousemove', cropping)
    canvas.removeEventListener('mouseup' , cropped)
    canvas.addEventListener('mousedown', draw)
    canvas.addEventListener('mousemove', drawing)
    canvas.addEventListener('mouseup', removedraw)

})

function startcrop(e) {
    iscrop = true
    cropX = e.offsetX
    cropY = e.offsetY
}

function cropping(e) {

    if (iscrop) {
        cropWidth = e.offsetX - cropX;
        cropHeight = e.offsetY - cropY;
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(cropX, cropY, cropWidth, cropHeight);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }
}

function cropped() {
    iscrop = false;
    const imageData = ctx.getImageData(cropX, cropY, cropWidth, cropHeight)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 50, 50); 
}

canvas.addEventListener('mousedown', startcrop)
canvas.addEventListener('mousemove', cropping)
canvas.addEventListener('mouseup' , cropped)


function rotateImage(degree) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const radians = degree * (Math.PI / 180);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate(radians);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

rotate.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', draw)
    canvas.removeEventListener('mousemove', drawing)
    canvas.removeEventListener('mouseup', removedraw)
    canvas.removeEventListener('mousedown', startcrop)
    canvas.removeEventListener('mousemove', cropping)
    canvas.removeEventListener('mouseup' , cropped)
    const selectedDegree = parseInt(degree.value);
    rotateImage(selectedDegree);
})

color.addEventListener('click', function() {
    function changeTheme(theme) {
        switch (theme) {
          case 'sepia':
            ctx.filter = 'sepia(1)';
            break;
          case 'grayscale':
            ctx.filter = 'grayscale(1)';
            break;
          case 'blur':
            ctx.filter = 'hue-rotate(180deg)';
            break;
          default:
            ctx.filter = 'none';
            break;
        }
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    
        changeTheme(theme.value);

})


