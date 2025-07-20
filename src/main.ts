import { ResponsiveCanvas, extractPathsAndFill } from './utils';
import { FishSwimmingApp } from './fishSwimmingApp';
import './style.css';
import { crocodileSvg } from './elements';

// Flower class to represent individual flowers
class Flower {
  x: number;
  y: number;
  size: number;
  color: string;
  petalCount: number;
  rotation: number;
  swayAngle: number;
  swaySpeed: number;
  stemHeight: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 15 + 10;
    this.color = this.getRandomFlowerColor();
    this.petalCount = Math.floor(Math.random() * 6) + 5; // 5-10 petals
    this.rotation = Math.random() * Math.PI * 2;
    this.swayAngle = Math.random() * Math.PI * 2;
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.stemHeight = Math.random() * 40 + 30;
  }

  getRandomFlowerColor(): string {
    const colors = [
      '#FF6B9D', // Pink
      '#FFB6C1', // Light pink
      '#FF69B4', // Hot pink
      '#FF1493', // Deep pink
      '#FF4500', // Orange red
      '#FF6347', // Tomato
      '#FFD700', // Gold
      '#FFFF00', // Yellow
      '#98FB98', // Pale green
      '#87CEEB', // Sky blue
      '#DDA0DD', // Plum
      '#F0E68C', // Khaki
      '#FFA07A', // Light salmon
      '#E6E6FA', // Lavender
      '#FFE4E1'  // Misty rose
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.swayAngle += this.swaySpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Add gentle swaying motion
    const sway = Math.sin(this.swayAngle) * 2;
    ctx.rotate(sway * 0.02);

    // Draw stem
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.stemHeight);
    ctx.stroke();

    // Draw leaves
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.ellipse(-5, -this.stemHeight * 0.3, 8, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, -this.stemHeight * 0.7, 8, 4, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw flower petals
    ctx.translate(0, -this.stemHeight);
    ctx.rotate(this.rotation);

    for (let i = 0; i < this.petalCount; i++) {
      const angle = (i / this.petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);

      // Draw petal
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(this.size * 0.8, 0, this.size, this.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Draw flower center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Check if a point is inside the flower
  contains(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - (this.y - this.stemHeight);
    return dx * dx + dy * dy < this.size * this.size * 2;
  }

  // Move flower to a new position
  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// Butterfly class for the flower field
class Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wingAngle: number;
  wingSpeed: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 2;
    this.size = Math.random() * 8 + 6;
    this.wingAngle = 0;
    this.wingSpeed = Math.random() * 0.3 + 0.2;
    this.color = `hsl(${Math.random() * 60 + 300}, 70%, 60%)`; // Purple/pink colors
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > canvasWidth) {
      this.vx *= -1;
    }
    if (this.y < 0 || this.y > canvasHeight) {
      this.vy *= -1;
    }

    // Keep butterfly in bounds
    this.x = Math.max(0, Math.min(canvasWidth, this.x));
    this.y = Math.max(0, Math.min(canvasHeight, this.y));

    // Update wing animation
    this.wingAngle += this.wingSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw butterfly body
    ctx.fillStyle = '#333';
    ctx.fillRect(-1, -this.size * 0.3, 2, this.size * 0.6);

    // Draw wings
    ctx.fillStyle = this.color;
    const wingFlap = Math.sin(this.wingAngle) * 0.3;

    // Left wing
    ctx.save();
    ctx.rotate(-0.5 + wingFlap);
    ctx.beginPath();
    ctx.ellipse(-this.size * 0.8, 0, this.size * 0.6, this.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.rotate(0.5 - wingFlap);
    ctx.beginPath();
    ctx.ellipse(this.size * 0.8, 0, this.size * 0.6, this.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
}

// Gentle Crocodile class
class Crocodile {
  x: number;
  y: number;
  size: number;
  mouthOpen: number = 0; // 0 = closed, 1 = fully open
  mouthTarget: number = 0;
  mouthSpeed: number = 0.05;
  eyeBlink: number = 0;
  blinkTimer: number = 0;
  tailWag: number = 0;
  tailSpeed: number = 0.02;
  isInteracting: boolean = false;
  interactionTimer: number = 0;

  private paths: string[] = [];
  private fills: string[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = 120;

    const { paths, fills } = extractPathsAndFill(crocodileSvg);
    this.paths = paths;
    this.fills = fills;
  }

  update() {
    // Update mouth animation
    this.mouthOpen += (this.mouthTarget - this.mouthOpen) * this.mouthSpeed;

    // Update eye blinking
    this.blinkTimer += 0.02;
    if (this.blinkTimer > 3) {
      this.eyeBlink = 1;
      if (this.blinkTimer > 3.2) {
        this.eyeBlink = 0;
        this.blinkTimer = 0;
      }
    }

    // Update tail wagging
    this.tailWag += this.tailSpeed;

    // Update interaction timer
    if (this.isInteracting) {
      this.interactionTimer += 0.1;
      if (this.interactionTimer > 2) {
        this.isInteracting = false;
        this.interactionTimer = 0;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // ctx.translate(this.x, this.y);
    ctx.scale(this.size / 128, this.size / 128); // Scale relative to SVG viewbox

    for (let i = 0; i < this.paths.length; i++) {
      ctx.fillStyle = this.fills[i];
      ctx.beginPath();
      const path = new Path2D(this.paths[i]);
      ctx.fill(path);
    }

    ctx.restore();
  }

  // Check if a point is inside the mouth (interactive area)
  contains(x: number, y: number): boolean {
    const dx = x - (this.x + this.size * 1.3);
    const dy = y - this.y;
    const mouthRadius = this.size * 0.3;
    return dx * dx + dy * dy < mouthRadius * mouthRadius;
  }

  // Interact with the crocodile
  interact() {
    this.isInteracting = true;
    this.interactionTimer = 0;
    this.mouthTarget = 1;

    // Close mouth after a delay
    setTimeout(() => {
      this.mouthTarget = 0;
    }, 1000);
  }
}

// Crocodile application class
class CrocodileApp {
  private responsiveCanvas: ResponsiveCanvas;
  private crocodile: Crocodile;
  // private eventHandler!: EventHandler;
  private animationId: number = 0;
  private lastFrameTime: number = 0;
  private targetFPS: number = 60;
  private isMobile: boolean = false;

  constructor() {
    this.responsiveCanvas = new ResponsiveCanvas('crocodileCanvas', 1200, 800);
    this.crocodile = new Crocodile(600, 400);

    // Detect mobile device for performance optimization
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.isMobile) {
      this.targetFPS = 30; // Lower FPS for mobile devices
    }

    this.setupEventListeners();
    this.animate();
  }

  setupEventListeners() {
    // this.eventHandler = new EventHandler(
    //   this.responsiveCanvas.getCanvas(),
    //   (x, y) => this.handleMouseDown(x, y),
    //   (x, y) => this.handleMouseMove(x, y),
    //   () => this.handleMouseUp()
    // );
  }

  handleMouseDown(x: number, y: number) {
    // Convert screen coordinates to canvas coordinates
    const coords = this.responsiveCanvas.screenToCanvas(x, y);

    // Check if clicking on the crocodile's mouth
    if (this.crocodile.contains(coords.x, coords.y)) {
      this.crocodile.interact();
    }
  }

  // handleMouseMove(x: number, y: number) {
  // Convert screen coordinates to canvas coordinates
  // const coords = this.responsiveCanvas.screenToCanvas(x, y);

  // Optional: Add hover effects here
  // }

  handleMouseUp() {
    // No dragging needed for crocodile
  }

  drawBackground() {
    const ctx = this.responsiveCanvas.getContext();
    const canvasWidth = this.responsiveCanvas.getBaseWidth();
    const canvasHeight = this.responsiveCanvas.getBaseHeight();

    // Create gradient background for river/swamp scene
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.4, '#98FB98'); // Pale green
    gradient.addColorStop(0.7, '#8FBC8F'); // Dark sea green
    gradient.addColorStop(1, '#556B2F'); // Dark olive green

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add some lily pads
    ctx.fillStyle = 'rgba(34, 139, 34, 0.7)';
    for (let i = 0; i < 8; i++) {
      const x = (i * canvasWidth / 8) + Math.sin(Date.now() * 0.001 + i) * 30;
      const y = canvasHeight * 0.8 + Math.sin(Date.now() * 0.0008 + i) * 20;

      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();

      // Add lily pad center
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(34, 139, 34, 0.7)';
    }

    // Add some floating leaves
    ctx.fillStyle = 'rgba(85, 107, 47, 0.6)';
    for (let i = 0; i < 5; i++) {
      const x = (i * canvasWidth / 5) + Math.sin(Date.now() * 0.0005 + i) * 50;
      const y = canvasHeight * 0.9 + Math.sin(Date.now() * 0.0003 + i) * 15;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(Date.now() * 0.001 + i) * 0.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, 25, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  animate(currentTime: number = 0) {
    // Frame rate limiting for mobile performance
    if (currentTime - this.lastFrameTime < 1000 / this.targetFPS) {
      this.animationId = requestAnimationFrame((time) => this.animate(time));
      return;
    }
    this.lastFrameTime = currentTime;

    const ctx = this.responsiveCanvas.getContext();
    const canvasWidth = this.responsiveCanvas.getBaseWidth();
    const canvasHeight = this.responsiveCanvas.getBaseHeight();

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    this.drawBackground();

    // Update and draw crocodile
    this.crocodile.update();
    this.crocodile.draw(ctx);

    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Flower field application class
class FlowerFieldApp {
  private responsiveCanvas: ResponsiveCanvas;
  private flowers: Flower[];
  private butterflies: Butterfly[];
  private isDragging: boolean = false;
  private draggedFlower: Flower | null = null;
  private mouseX: number = 0;
  private mouseY: number = 0;
  // private eventHandler!: EventHandler;
  private animationId: number = 0;
  private lastFrameTime: number = 0;
  private targetFPS: number = 60;
  private isMobile: boolean = false;

  constructor() {
    this.responsiveCanvas = new ResponsiveCanvas('flowerCanvas', 1200, 800);
    this.flowers = [];
    this.butterflies = [];

    // Detect mobile device for performance optimization
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.isMobile) {
      this.targetFPS = 30; // Lower FPS for mobile devices
    }

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    const canvasWidth = this.responsiveCanvas.getBaseWidth();
    const canvasHeight = this.responsiveCanvas.getBaseHeight();

    // Create initial flowers (fewer on mobile for better performance)
    const flowerCount = this.isMobile ? 15 : 25;
    for (let i = 0; i < flowerCount; i++) {
      this.flowers.push(new Flower(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight
      ));
    }

    // Create butterflies (fewer on mobile for better performance)
    const butterflyCount = this.isMobile ? 3 : 5;
    for (let i = 0; i < butterflyCount; i++) {
      this.butterflies.push(new Butterfly(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight
      ));
    }
  }

  setupEventListeners() {
    // this.eventHandler = new EventHandler(
    //   this.responsiveCanvas.getCanvas(),
    //   (x, y) => this.handleMouseDown(x, y),
    //   (x, y) => this.handleMouseMove(x, y),
    //   () => this.handleMouseUp()
    // );
  }

  handleMouseDown(x: number, y: number) {
    // Convert screen coordinates to canvas coordinates
    const coords = this.responsiveCanvas.screenToCanvas(x, y);

    // Check if clicking on a flower
    for (const flower of this.flowers) {
      if (flower.contains(coords.x, coords.y)) {
        this.isDragging = true;
        this.draggedFlower = flower;
        this.mouseX = coords.x;
        this.mouseY = coords.y;
        break;
      }
    }
  }

  handleMouseMove(x: number, y: number) {
    // Convert screen coordinates to canvas coordinates
    const coords = this.responsiveCanvas.screenToCanvas(x, y);

    if (this.isDragging && this.draggedFlower) {
      this.draggedFlower.moveTo(coords.x, coords.y);
    }

    this.mouseX = coords.x;
    this.mouseY = coords.y;
  }

  handleMouseUp() {
    this.isDragging = false;
    this.draggedFlower = null;
  }

  drawBackground() {
    const ctx = this.responsiveCanvas.getContext();
    const canvasWidth = this.responsiveCanvas.getBaseWidth();
    const canvasHeight = this.responsiveCanvas.getBaseHeight();

    // Create gradient background for flower field
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#90EE90'); // Light green

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add some clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 3; i++) {
      const x = (i * canvasWidth / 3) + Math.sin(Date.now() * 0.0005 + i) * 50;
      const y = 100 + Math.sin(Date.now() * 0.0003 + i) * 30;

      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 35, 0, Math.PI * 2);
      ctx.arc(x + 60, y, 40, 0, Math.PI * 2);
      ctx.arc(x + 30, y - 20, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  animate(currentTime: number = 0) {
    // Frame rate limiting for mobile performance
    if (currentTime - this.lastFrameTime < 1000 / this.targetFPS) {
      this.animationId = requestAnimationFrame((time) => this.animate(time));
      return;
    }
    this.lastFrameTime = currentTime;

    const ctx = this.responsiveCanvas.getContext();
    const canvasWidth = this.responsiveCanvas.getBaseWidth();
    const canvasHeight = this.responsiveCanvas.getBaseHeight();

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    this.drawBackground();

    // Update and draw flowers
    for (const flower of this.flowers) {
      flower.update();
      flower.draw(ctx);
    }

    // Update and draw butterflies
    for (const butterfly of this.butterflies) {
      butterfly.update(canvasWidth, canvasHeight);
      butterfly.draw(ctx);
    }

    // Draw cursor indicator when dragging
    if (this.isDragging) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(this.mouseX, this.mouseY, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Simple tab switching function
function setupTabs() {
  const fishButton = document.querySelector('[data-tab="fish"]') as HTMLButtonElement;
  const flowerButton = document.querySelector('[data-tab="flowers"]') as HTMLButtonElement;
  const crocodileButton = document.querySelector('[data-tab="crocodile"]') as HTMLButtonElement;
  const fishScene = document.getElementById('fish-scene') as HTMLElement;
  const flowerScene = document.getElementById('flower-scene') as HTMLElement;
  const crocodileScene = document.getElementById('crocodile-scene') as HTMLElement;

  console.log('Setting up tabs...');
  console.log('Fish button:', fishButton);
  console.log('Flower button:', flowerButton);
  console.log('Crocodile button:', crocodileButton);
  console.log('Fish scene:', fishScene);
  console.log('Flower scene:', flowerScene);
  console.log('Crocodile scene:', crocodileScene);

  function showFishScene() {
    console.log('Showing fish scene');
    fishButton.classList.add('active');
    flowerButton.classList.remove('active');
    crocodileButton.classList.remove('active');
    fishScene.style.display = 'block';
    flowerScene.style.display = 'none';
    crocodileScene.style.display = 'none';
  }

  function showFlowerScene() {
    console.log('Showing flower scene');
    flowerButton.classList.add('active');
    fishButton.classList.remove('active');
    crocodileButton.classList.remove('active');
    flowerScene.style.display = 'block';
    fishScene.style.display = 'none';
    crocodileScene.style.display = 'none';
  }

  function showCrocodileScene() {
    console.log('Showing crocodile scene');
    crocodileButton.classList.add('active');
    fishButton.classList.remove('active');
    flowerButton.classList.remove('active');
    crocodileScene.style.display = 'block';
    fishScene.style.display = 'none';
    flowerScene.style.display = 'none';
  }

  if (fishButton && flowerButton && crocodileButton && fishScene && flowerScene && crocodileScene) {
    fishButton.addEventListener('click', showFishScene);
    flowerButton.addEventListener('click', showFlowerScene);
    crocodileButton.addEventListener('click', showCrocodileScene);
    console.log('Tab event listeners added successfully');
  } else {
    console.error('Some elements not found for tab setup');
  }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing apps...');

  // Setup tabs first
  setupTabs();

  // Initialize apps with delay to ensure DOM is ready
  setTimeout(() => {
    try {
      console.log('Initializing fish app...');
      new FishSwimmingApp();
      console.log('Fish app initialized successfully');
    } catch (error) {
      console.error('Error initializing fish app:', error);
    }

    try {
      console.log('Initializing flower app...');
      new FlowerFieldApp();
      console.log('Flower app initialized successfully');
    } catch (error) {
      console.error('Error initializing flower app:', error);
    }

    try {
      console.log('Initializing crocodile app...');
      new CrocodileApp();
      console.log('Crocodile app initialized successfully');
    } catch (error) {
      console.error('Error initializing crocodile app:', error);
    }
  }, 500);
});

