import { memo, useCallback, useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

type AnimatedBackgroundProps = {
  width: number;
  height: number;
};

type VectorType = {
  x: number;
  y: number;
};

/**
 * Découverte de l'algo Marching Squares
 * https://www.youtube.com/watch?v=0ZONMNUKTfU
 * https://thecodingtrain.com/challenges/c5-marching-squares
 */

const AnimatedBackground = memo(
  ({ width, height }: AnimatedBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cols = useRef<number>(0);
    const rows = useRef<number>(0);
    const rez = 10;
    const fieldRef = useRef<number[][]>([]);
    const noise = createNoise3D();
    const increment = 0.1;
    const zoff = useRef<number>(0);

    const lerp = (a: number, b: number, t: number) => {
      return a + t * (b - a);
    };

    const line = (
      v1: VectorType,
      v2: VectorType,
      ctx: CanvasRenderingContext2D
    ) => {
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.stroke();

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
    };

    // Fonction pour initialiser le canevas et calculer les dimensions
    const setupCanvas = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D
    ) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Calculer les dimensions des colonnes et des lignes
      const numCols = Math.floor(2 + rect.width / rez);
      const numRows = Math.floor(2 + rect.height / rez);

      return { cols: numCols, rows: numRows };
    };

    // Fonction pour dessiner les élements du canvas
    const draw = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        cols: number,
        rows: number,
        rez: number
      ) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Création du bruit de Perlin
        let xoff = 0;
        fieldRef.current = [];
        for (let x = 0; x < cols; x++) {
          fieldRef.current[x] = [];
          xoff += increment;
          let yoff = 0;
          for (let y = 0; y < rows; y++) {
            fieldRef.current[x][y] = noise(xoff, yoff, zoff.current);
            yoff += increment;
          }
        }
        zoff.current += 0.001;

        // Dessiner les points
        // for (let x = 0; x < cols; x++) {
        //   for (let y = 0; y < rows; y++) {
        //     ctx.beginPath();
        //     ctx.arc(x * rez, y * rez, 2, 0, Math.PI * 2);
        //     ctx.fillStyle = 'black';
        //     ctx.fill();
        //   }
        // }

        // Dessiner les lignes
        for (let i = 0; i < cols - 1; i++) {
          for (let j = 0; j < rows - 1; j++) {
            const x = i * rez;
            const y = j * rez;

            const v1 = Math.ceil(fieldRef.current[i][j]);
            const v2 = Math.ceil(fieldRef.current[i + 1][j]);
            const v3 = Math.ceil(fieldRef.current[i + 1][j + 1]);
            const v4 = Math.ceil(fieldRef.current[i][j + 1]);

            const state = getState(v1, v2, v3, v4);

            const aVal = fieldRef.current[i][j] + 1;
            const bVal = fieldRef.current[i + 1][j] + 1;
            const cVal = fieldRef.current[i + 1][j + 1] + 1;
            const dVal = fieldRef.current[i][j + 1] + 1;

            const a = { x: 0, y: 0 };
            let t = (1 - aVal) / (bVal - aVal);
            a.x = lerp(x, x + rez, t);
            a.y = y;
            const b = { x: 0, y: 0 };
            t = (1 - bVal) / (cVal - bVal);
            b.x = x + rez;
            b.y = lerp(y, y + rez, t);
            const c = { x: 0, y: 0 };
            t = (1 - dVal) / (cVal - dVal);
            c.x = lerp(x, x + rez, t);
            c.y = y + rez;
            const d = { x: 0, y: 0 };
            t = (1 - aVal) / (dVal - aVal);
            d.x = x;
            d.y = lerp(y, y + rez, t);

            switch (state) {
              case 1:
                line(c, d, ctx);
                break;
              case 2:
                line(b, c, ctx);
                break;
              case 3:
                line(b, d, ctx);
                break;
              case 4:
                line(a, b, ctx);
                break;
              case 5:
                line(a, d, ctx);
                line(b, c, ctx);
                break;
              case 6:
                line(a, c, ctx);
                break;
              case 7:
                line(a, d, ctx);
                break;
              case 8:
                line(a, d, ctx);
                break;
              case 9:
                line(a, c, ctx);
                break;
              case 10:
                line(a, b, ctx);
                line(c, d, ctx);
                break;
              case 11:
                line(a, b, ctx);
                break;
              case 12:
                line(b, d, ctx);
                break;
              case 13:
                line(b, c, ctx);
                break;
              case 14:
                line(c, d, ctx);
                break;
            }
          }
        }
      },
      [noise]
    );

    const getState = (a: number, b: number, c: number, d: number) => {
      return a * 8 + b * 4 + c * 2 + d * 1;
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        const { cols: c, rows: r } = setupCanvas(canvas, ctx);
        cols.current = c;
        rows.current = r;
      };

      const render = () => {
        draw(ctx, cols.current, rows.current, rez);
        requestAnimationFrame(render);
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      render();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [draw]);

    return <canvas ref={canvasRef} style={{ width, height }}></canvas>;
  }
);

export default AnimatedBackground;
