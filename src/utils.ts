// Utility class for handling responsive canvas sizing
export class ResponsiveCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private baseWidth: number;
  private baseHeight: number;
  private scaleX: number = 1;
  private scaleY: number = 1;

  constructor(canvasId: string, baseWidth: number, baseHeight: number) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.resize();
    this.setupResizeListener();
  }

  private resize() {
    const container = this.canvas.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    let maxWidth, maxHeight;

    if (isMobile) {
      // On mobile, make canvas cover most of the screen
      maxWidth = Math.min(window.innerWidth - 20, this.baseWidth);
      maxHeight = Math.min(window.innerHeight * 0.75, this.baseHeight);
    } else {
      // On desktop, use the original sizing
      maxWidth = Math.min(containerRect.width - 40, this.baseWidth);
      maxHeight = Math.min(window.innerHeight * 0.6, this.baseHeight);
    }

    // Calculate aspect ratio
    const aspectRatio = this.baseWidth / this.baseHeight;
    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
    }

    // Set canvas size
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;
    this.canvas.width = this.baseWidth;
    this.canvas.height = this.baseHeight;

    // Calculate scale factors
    this.scaleX = newWidth / this.baseWidth;
    this.scaleY = newHeight / this.baseHeight;
  }

  private setupResizeListener() {
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resize(), 100);
    });
  }

  getCanvas() { return this.canvas; }
  getContext() { return this.ctx; }
  getScaleX() { return this.scaleX; }
  getScaleY() { return this.scaleY; }
  getBaseWidth() { return this.baseWidth; }
  getBaseHeight() { return this.baseHeight; }

  // Convert screen coordinates to canvas coordinates
  screenToCanvas(screenX: number, screenY: number): { x: number, y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (screenX - rect.left) / this.scaleX,
      y: (screenY - rect.top) / this.scaleY
    };
  }
}

// Enhanced event handling for both mouse and touch
export class EventHandler {
  private canvas: HTMLCanvasElement;
  private onMouseDown: (x: number, y: number) => void;
  private onMouseMove: (x: number, y: number) => void;
  private onMouseUp: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    onMouseDown: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void,
    onMouseUp: () => void
  ) {
    this.canvas = canvas;
    this.onMouseDown = onMouseDown;
    this.onMouseMove = onMouseMove;
    this.onMouseUp = onMouseUp;
    this.setupEvents();
  }

  private setupEvents() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const coords = this.getEventCoordinates(e);
      this.onMouseDown(coords.x, coords.y);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      const coords = this.getEventCoordinates(e);
      this.onMouseMove(coords.x, coords.y);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.onMouseUp();
    });

    this.canvas.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      this.onMouseUp();
    });

    // Touch events with improved handling
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = this.getEventCoordinates(touch);
        this.onMouseDown(coords.x, coords.y);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = this.getEventCoordinates(touch);
        this.onMouseMove(coords.x, coords.y);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.onMouseUp();
    }, { passive: false });

    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.onMouseUp();
    }, { passive: false });

    // Prevent default touch behaviors on the canvas
    this.canvas.style.touchAction = 'none';
  }

  private getEventCoordinates(event: MouseEvent | Touch): { x: number, y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }
}

export function extractPathsAndFill(svgString: string) {
  const paths: string[] = [];
  const fills: string[] = [];

  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');

  const pathElements = svg.querySelectorAll('path');
  const fillElements = svg.querySelectorAll('fill');

  pathElements.forEach(path => {
    const pathData = path.getAttribute('d');
    if (pathData) {
      paths.push(pathData);
    }
  });

  fillElements.forEach(fill => {
    const fillData = fill.getAttribute('fill');
    if (fillData) {
      fills.push(fillData as string);
    }
  });

  return { paths, fills };
}