import { useCallback, useEffect, useRef, useState } from 'react';

interface Circle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

const AnimatedBackground = () => {
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const circleCount = 4;
  const circleRadius = 120;
  const gridSize = 5;
  const threshold = 0.1;
  const dpr = window.devicePixelRatio;

  const updateCircles = useCallback(() => {
    circlesRef.current = circlesRef.current.map((circle) => {
      const newX = circle.x + circle.vx;
      const newY = circle.y + circle.vy;

      const nextVx =
        newX - circle.r < 0 || newX + circle.r > canvasWidth
          ? -circle.vx
          : circle.vx;
      const nextVy =
        newY - circle.r < 0 || newY + circle.r > canvasHeight
          ? -circle.vy
          : circle.vy;

      return {
        ...circle,
        x: newX,
        y: newY,
        vx: nextVx,
        vy: nextVy,
      };
    });
  }, [canvasHeight, canvasWidth]);

  const generateCircle = useCallback((): Circle => {
    const adjusted_r = (circleRadius * canvasWidth) / 1000;
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      r: adjusted_r + adjusted_r * Math.random(),
      vx: 2 * Math.random() - 1,
      vy: 2 * Math.random() - 1,
    };
  }, [canvasHeight, canvasWidth]);

  const generateCircles = useCallback(() => {
    circlesRef.current = Array.from({ length: circleCount }, generateCircle);
  }, [generateCircle]);

  const calculateScalarField = (cols: number, rows: number): number[][] => {
    const field: number[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(0)
    );

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const posX = x * gridSize;
        const posY = y * gridSize;

        field[y][x] = circlesRef.current.reduce((sum, circle) => {
          const dist = Math.sqrt(
            (circle.x - posX) ** 2 + (circle.y - posY) ** 2
          );
          return sum + Math.max(0, 1 - dist / circle.r);
        }, 0);
      }
    }

    return field;
  };

  const interpolate = (
    p1: [number, number],
    p2: [number, number],
    v1: number,
    v2: number,
    threshold: number
  ): [number, number] => {
    const t = (threshold - v1) / (v2 - v1);
    return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
  };

  const drawMarchingSquare = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      caseIndex: number,
      values: number[],
      threshold: number
    ) => {
      const topLeft: [number, number] = [x, y];
      const topRight: [number, number] = [x + size, y];
      const bottomRight: [number, number] = [x + size, y + size];
      const bottomLeft: [number, number] = [x, y + size];

      const top = interpolate(
        topLeft,
        topRight,
        values[0],
        values[1],
        threshold
      );
      const right = interpolate(
        topRight,
        bottomRight,
        values[1],
        values[2],
        threshold
      );
      const bottom = interpolate(
        bottomLeft,
        bottomRight,
        values[3],
        values[2],
        threshold
      );
      const left = interpolate(
        topLeft,
        bottomLeft,
        values[0],
        values[3],
        threshold
      );

      ctx.beginPath();

      switch (caseIndex) {
        case 1:
          ctx.moveTo(...bottom);
          ctx.lineTo(...left);
          break;
        case 2:
          ctx.moveTo(...right);
          ctx.lineTo(...bottom);
          break;
        case 3:
          ctx.moveTo(...right);
          ctx.lineTo(...left);
          break;
        case 4:
          ctx.moveTo(...top);
          ctx.lineTo(...right);
          break;
        case 5:
          ctx.moveTo(...top);
          ctx.lineTo(...right);
          ctx.lineTo(...bottom);
          ctx.lineTo(...left);
          break;
        case 6:
          ctx.moveTo(...top);
          ctx.lineTo(...bottom);
          break;
        case 7:
          ctx.moveTo(...top);
          ctx.lineTo(...left);
          break;
        case 8:
          ctx.moveTo(...top);
          ctx.lineTo(...left);
          break;
        case 9:
          ctx.moveTo(...top);
          ctx.lineTo(...bottom);
          break;
        case 10:
          ctx.moveTo(...top);
          ctx.lineTo(...right);
          ctx.lineTo(...bottom);
          ctx.lineTo(...left);
          break;
        case 11:
          ctx.moveTo(...top);
          ctx.lineTo(...right);
          break;
        case 12:
          ctx.moveTo(...right);
          ctx.lineTo(...left);
          break;
        case 13:
          ctx.moveTo(...bottom);
          ctx.lineTo(...left);
          break;
        case 14:
          ctx.moveTo(...top);
          ctx.lineTo(...right);
          break;
        case 15:
          ctx.moveTo(...topLeft);
          ctx.lineTo(...topRight);
          ctx.lineTo(...bottomRight);
          ctx.lineTo(...bottomLeft);
          break;
        default:
          return;
      }

      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 100, 255, 0.6)';
      ctx.fill();
    },
    []
  );

  const marchingSquares = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const cols = Math.floor(canvasWidth / gridSize);
      const rows = Math.floor(canvasHeight / gridSize);
      const scalarField = calculateScalarField(cols, rows);

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const topLeft = scalarField[y][x];
          const topRight = scalarField[y][x + 1];
          const bottomRight = scalarField[y + 1][x + 1];
          const bottomLeft = scalarField[y + 1][x];

          const caseIndex =
            (topLeft > threshold ? 1 : 0) |
            (topRight > threshold ? 2 : 0) |
            (bottomRight > threshold ? 4 : 0) |
            (bottomLeft > threshold ? 8 : 0);

          drawMarchingSquare(
            ctx,
            x * gridSize,
            y * gridSize,
            gridSize,
            caseIndex,
            [topLeft, topRight, bottomRight, bottomLeft],
            threshold
          );
        }
      }
    },
    [canvasWidth, canvasHeight, drawMarchingSquare]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const resizeCanvas = () => {
      canvas.width = rect.width * dpr;
      setCanvasWidth(rect.width * dpr);
      canvas.height = rect.height * dpr;
      setCanvasHeight(rect.height * dpr);
      generateCircles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      marchingSquares(ctx);
      updateCircles();
      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [generateCircles, marchingSquares, updateCircles, dpr]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth as number}
      height={window.innerHeight as number}
    ></canvas>
  );
};

export default AnimatedBackground;
