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

  update() {
    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > 1200) {
      this.vx *= -1;
      this.direction *= -1;
    }
    if (this.y < 0 || this.y > 800) {
      this.vy *= -1;
    }

    // Keep fish in bounds
    this.x = Math.max(0, Math.min(1200, this.x));
    this.y = Math.max(0, Math.min(800, this.y));

    // Update tail animation
    this.tailAngle += this.tailSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.direction, 1);

    // Draw fish body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw fish tail
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.8, 0);
    ctx.lineTo(-this.size * 1.5, -this.size * 0.3 * Math.sin(this.tailAngle));
    ctx.lineTo(-this.size * 1.5, this.size * 0.3 * Math.sin(this.tailAngle));
    ctx.closePath();
    ctx.fill();

    // Draw fish eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.size * 0.3, -this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.size * 0.35, -this.size * 0.2, this.size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Draw fish fin
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 0.4);
    ctx.lineTo(-this.size * 0.3, -this.size * 0.6);
    ctx.lineTo(-this.size * 0.1, -this.size * 0.4);
    ctx.closePath();
    ctx.fill();

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

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > 1200) {
      this.vx *= -1;
    }
    if (this.y < 0 || this.y > 800) {
      this.vy *= -1;
    }

    // Keep butterfly in bounds
    this.x = Math.max(0, Math.min(1200, this.x));
    this.y = Math.max(0, Math.min(800, this.y));

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

  update() {
    this.y -= this.speed;
    if (this.y < -this.size) {
      this.y = 800 + this.size;
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
class FishSwimmingApp {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fishes: Fish[];
  bubbles: Bubble[];
  isDragging: boolean = false;
  draggedFish: Fish | null = null;
  mouseX: number = 0;
  mouseY: number = 0;

  constructor() {
    this.canvas = document.getElementById('fishCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.fishes = [];
    this.bubbles = [];

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    // Create initial fishes
    for (let i = 0; i < 8; i++) {
      this.fishes.push(new Fish(
        Math.random() * 1200,
        Math.random() * 800
      ));
    }

    // Create bubbles
    for (let i = 0; i < 20; i++) {
      this.bubbles.push(new Bubble(
        Math.random() * 1200,
        Math.random() * 800
      ));
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
  }

  handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a fish
    for (const fish of this.fishes) {
      if (fish.contains(x, y)) {
        this.isDragging = true;
        this.draggedFish = fish;
        this.mouseX = x;
        this.mouseY = y;
        break;
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.isDragging && this.draggedFish) {
      this.draggedFish.moveTo(x, y);
    }

    this.mouseX = x;
    this.mouseY = y;
  }

  handleMouseUp() {
    this.isDragging = false;
    this.draggedFish = null;
  }

  drawBackground() {
    // Create gradient background for underwater effect
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, '#006994');
    gradient.addColorStop(0.5, '#004d6b');
    gradient.addColorStop(1, '#00334a');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, 1200, 800);

    // Add some underwater light rays
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = (i + 1) * 200 + Math.sin(Date.now() * 0.001 + i) * 50;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + 100, 800);
      this.ctx.stroke();
    }
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, 1200, 800);

    // Draw background
    this.drawBackground();

    // Update and draw bubbles
    for (const bubble of this.bubbles) {
      bubble.update();
      bubble.draw(this.ctx);
    }

    // Update and draw fishes
    for (const fish of this.fishes) {
      fish.update();
      fish.draw(this.ctx);
    }

    // Draw cursor indicator when dragging
    if (this.isDragging) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, 30, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Flower field application class
class FlowerFieldApp {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  flowers: Flower[];
  butterflies: Butterfly[];
  isDragging: boolean = false;
  draggedFlower: Flower | null = null;
  mouseX: number = 0;
  mouseY: number = 0;

  constructor() {
    this.canvas = document.getElementById('flowerCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.flowers = [];
    this.butterflies = [];

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    // Create initial flowers
    for (let i = 0; i < 25; i++) {
      this.flowers.push(new Flower(
        Math.random() * 1200,
        Math.random() * 800
      ));
    }

    // Create butterflies
    for (let i = 0; i < 5; i++) {
      this.butterflies.push(new Butterfly(
        Math.random() * 1200,
        Math.random() * 800
      ));
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
  }

  handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a flower
    for (const flower of this.flowers) {
      if (flower.contains(x, y)) {
        this.isDragging = true;
        this.draggedFlower = flower;
        this.mouseX = x;
        this.mouseY = y;
        break;
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.isDragging && this.draggedFlower) {
      this.draggedFlower.moveTo(x, y);
    }

    this.mouseX = x;
    this.mouseY = y;
  }

  handleMouseUp() {
    this.isDragging = false;
    this.draggedFlower = null;
  }

  drawBackground() {
    // Create gradient background for flower field
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#90EE90'); // Light green

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, 1200, 800);

    // Add some clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 3; i++) {
      const x = (i * 400) + Math.sin(Date.now() * 0.0005 + i) * 50;
      const y = 100 + Math.sin(Date.now() * 0.0003 + i) * 30;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 40, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y, 35, 0, Math.PI * 2);
      this.ctx.arc(x + 60, y, 40, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y - 20, 30, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, 1200, 800);

    // Draw background
    this.drawBackground();

    // Update and draw flowers
    for (const flower of this.flowers) {
      flower.update();
      flower.draw(this.ctx);
    }

    // Update and draw butterflies
    for (const butterfly of this.butterflies) {
      butterfly.update();
      butterfly.draw(this.ctx);
    }

    // Draw cursor indicator when dragging
    if (this.isDragging) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, 30, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Simple tab switching function
function setupTabs() {
  const fishButton = document.querySelector('[data-tab="fish"]') as HTMLButtonElement;
  const flowerButton = document.querySelector('[data-tab="flowers"]') as HTMLButtonElement;
  const fishScene = document.getElementById('fish-scene') as HTMLElement;
  const flowerScene = document.getElementById('flower-scene') as HTMLElement;

  console.log('Setting up tabs...');
  console.log('Fish button:', fishButton);
  console.log('Flower button:', flowerButton);
  console.log('Fish scene:', fishScene);
  console.log('Flower scene:', flowerScene);

  function showFishScene() {
    console.log('Showing fish scene');
    fishButton.classList.add('active');
    flowerButton.classList.remove('active');
    fishScene.style.display = 'block';
    flowerScene.style.display = 'none';
  }

  function showFlowerScene() {
    console.log('Showing flower scene');
    flowerButton.classList.add('active');
    fishButton.classList.remove('active');
    flowerScene.style.display = 'block';
    fishScene.style.display = 'none';
  }

  if (fishButton && flowerButton && fishScene && flowerScene) {
    fishButton.addEventListener('click', showFishScene);
    flowerButton.addEventListener('click', showFlowerScene);
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
  }, 500);
});
