import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import AnimatedBackground from '../../components/animated-background/AnimatedBackground';

describe('AnimatedBackground Component', () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () =>
        ({
          fillRect: vi.fn(),
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          stroke: vi.fn(),
          scale: vi.fn(),
          canvas: {
            width: 500,
            height: 300,
          },
        }) as unknown as CanvasRenderingContext2D
    );

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(cb, 16); // Simulates 60 FPS
      return 1;
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render the canvas with correct dimensions', () => {
    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#000000', lineWidth: 2, lineColor: '#FFFFFF' }}
      />
    );

    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle({ width: '500px', height: '300px' });
  });

  it('should maintain the canvas after window resize', () => {
    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#000000', lineWidth: 2, lineColor: '#FFFFFF' }}
      />
    );

    window.dispatchEvent(new Event('resize'));

    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have a 2D rendering context', () => {
    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#000000', lineWidth: 2, lineColor: '#FFFFFF' }}
      />
    );

    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    expect(ctx).not.toBeNull();
  });

  it('should call requestAnimationFrame for rendering loop', () => {
    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#000000', lineWidth: 2, lineColor: '#FFFFFF' }}
      />
    );

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });
});
