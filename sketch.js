let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let stars = [];
let gravity = 0.3;
let isSmiling = false;
let smileStarted = false;
let maxStarsPerSmile = 50;
let initialMouthWidth = null;
let starImage;

function preload() {
  faceMesh = ml5.faceMesh(options);
  starImage = loadImage("star.png");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);

  if (faces.length > 0) {
    let face = faces[0];
    let leftMouth = face.keypoints[61];
    let rightMouth = face.keypoints[291];
    let mouthWidth = dist(leftMouth.x, leftMouth.y, rightMouth.x, rightMouth.y);

    if (initialMouthWidth === null) {
      initialMouthWidth = mouthWidth;
    }

    if (mouthWidth > initialMouthWidth * 1.1) {
      if (!smileStarted) {
        smileStarted = true;
        generateStars(maxStarsPerSmile);
      }
      isSmiling = true;
    } else {
      isSmiling = false;
      smileStarted = false;
    }
  }

  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }

  stars = stars.filter(star => star.y <= height);
}

function gotFaces(results) {
  faces = results;
}

function generateStars(num) {
  for (let i = 0; i < num; i++) {
    let delay = random(0, 800);
    setTimeout(() => {
      stars.push(new Star(random(width), 0));
    }, delay);
  }
}

class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 0;
  }

  update() {
    this.speed += gravity;
    this.y += this.speed;
  }

  show() {
    image(starImage, this.x, this.y, this.size, this.size);
  }
}
