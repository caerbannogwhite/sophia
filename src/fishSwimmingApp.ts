import { ResponsiveCanvas, EventHandler } from './utils';
import { fishBonePath } from './elements';
import './style.css';


// Fish class to represent individual fish
class Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  direction: number; // 1 for right, -1 for left
  tailAngle: number;
  tailSpeed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 1;
    this.size = Math.random() * 20 + 15;
    this.color = `hsl(${Math.random() * 60 + 180}, 70%, 50%)`; // Blue-green colors
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.tailAngle = 0;
    this.tailSpeed = Math.random() * 0.2 + 0.1;
  }

  update(canvasWidth: number, canvasHeight: number) {
    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > canvasWidth) {
      this.vx *= -1;
      this.direction *= -1;
    }
    if (this.y < 0 || this.y > canvasHeight) {
      this.vy *= -1;
    }

    // Keep fish in bounds
    this.x = Math.max(0, Math.min(canvasWidth, this.x));
    this.y = Math.max(0, Math.min(canvasHeight, this.y));

    // Update tail animation
    this.tailAngle += this.tailSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.direction * this.size / 128, this.size / 128); // Scale relative to SVG viewbox

    // Draw fish using SVG path
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const path = new Path2D(fishBonePath);
    ctx.fill(path);

    // Add swimming animation by rotating slightly based on tail angle
    ctx.translate(256, 256); // Center of SVG viewbox
    ctx.rotate(Math.sin(this.tailAngle) * 0.1);
    ctx.translate(-256, -256);

    ctx.restore();
  }

  // Check if a point is inside the fish
  contains(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return dx * dx + dy * dy < this.size * this.size;
  }

  // Move fish to a new position
  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    // Add some random velocity when moved
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 2;
  }
}

// Bubble class for underwater effect
class Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 4;
    this.speed = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update(canvasHeight: number) {
    this.y -= this.speed;
    if (this.y < -this.size) {
      this.y = canvasHeight + this.size;
      this.x = Math.random() * 1200;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Main fish swimming application class
export class FishSwimmingApp {
  private responsiveCanvas: ResponsiveCanvas;
  private fishes: Fish[];
  private bubbles: Bubble[];
  private isDragging: boolean = false;
  private draggedFish: Fish | null = null;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private eventHandler!: EventHandler;
  private animationId: number = 0;
  private lastFrameTime: number = 0;
  private targetFPS: number = 60;
  private isMobile: boolean = false;

  constructor() {
    this.responsiveCanvas = new ResponsiveCanvas('fishCanvas', 1200, 800);
    this.fishes = [];
    this.bubbles = [];

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

    // Create initial fishes (fewer on mobile for better performance)
    const fishCount = this.isMobile ? 10 : 15;
    for (let i = 0; i < fishCount; i++) {
      this.fishes.push(new Fish(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight
      ));
    }

    // Create bubbles (fewer on mobile for better performance)
    const bubbleCount = this.isMobile ? 16 : 24;
    for (let i = 0; i < bubbleCount; i++) {
      this.bubbles.push(new Bubble(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight
      ));
    }
  }

  setupEventListeners() {
    this.eventHandler = new EventHandler(
      this.responsiveCanvas.getCanvas(),
      (x, y) => this.handleMouseDown(x, y),
      (x, y) => this.handleMouseMove(x, y),
      () => this.handleMouseUp()
    );
  }

  handleMouseDown(x: number, y: number) {
    // Convert screen coordinates to canvas coordinates
    const coords = this.responsiveCanvas.screenToCanvas(x, y);

    // Check if clicking on a fish
    for (const fish of this.fishes) {
      if (fish.contains(coords.x, coords.y)) {
        this.isDragging = true;
        this.draggedFish = fish;
        this.mouseX = coords.x;
        this.mouseY = coords.y;
        break;
      }
    }
  }

  handleMouseMove(x: number, y: number) {
    // Convert screen coordinates to canvas coordinates
    const coords = this.responsiveCanvas.screenToCanvas(x, y);

    if (this.isDragging && this.draggedFish) {
      this.draggedFish.moveTo(coords.x, coords.y);
    }

    this.mouseX = coords.x;
    this.mouseY = coords.y;
  }

  handleMouseUp() {
    this.isDragging = false;
    this.draggedFish = null;
  }

  drawBackground() {
    const ctx = this.responsiveCanvas.getContext();
    const canvasWidth = this.responsiveCanvas.getBaseWidth();
    const canvasHeight = this.responsiveCanvas.getBaseHeight();

    // Create gradient background for underwater effect
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#006994');
    gradient.addColorStop(0.5, '#004d6b');
    gradient.addColorStop(1, '#00334a');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add some underwater light rays
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = (i + 1) * (canvasWidth / 6) + Math.sin(Date.now() * 0.001 + i) * 50;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 100, canvasHeight);
      ctx.stroke();
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

    // Update and draw bubbles
    for (const bubble of this.bubbles) {
      bubble.update(canvasHeight);
      bubble.draw(ctx);
    }

    // Update and draw fishes
    for (const fish of this.fishes) {
      fish.update(canvasWidth, canvasHeight);
      fish.draw(ctx);
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