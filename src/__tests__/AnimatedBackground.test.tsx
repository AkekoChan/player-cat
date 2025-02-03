import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AnimatedBackground from '../components/animated-background/AnimatedBackground';

describe('AnimatedBackground', () => {
  it('should render canvas correctly', () => {
    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#F06292', lineWidth: 6, lineColor: '#FEFEFE' }}
      />
    );
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have correct dimensions', () => {
    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#F06292', lineWidth: 6, lineColor: '#FEFEFE' }}
      />
    );
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveStyle('width: 500px');
    expect(canvas).toHaveStyle('height: 300px');
  });

  it('should get 2D context', () => {
    const contextMock = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      scale: vi.fn(),
      canvas: {
        width: 500,
        height: 300,
      },
    } as unknown as CanvasRenderingContext2D;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => contextMock
    );

    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#F06292', lineWidth: 6, lineColor: '#FEFEFE' }}
      />
    );
    expect(contextMock.fillRect).toHaveBeenCalled();
  });

  it('should draw on the canvas', () => {
    const contextMock = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      scale: vi.fn(),
      canvas: {
        width: 500,
        height: 300,
      },
    } as unknown as CanvasRenderingContext2D;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => contextMock
    );

    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#F06292', lineWidth: 6, lineColor: '#FEFEFE' }}
      />
    );

    expect(contextMock.fillRect).toHaveBeenCalled();
  });

  it('should request animation frame', () => {
    const mockCallback = vi.fn();

    const requestAnimationFrameMock = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementationOnce(mockCallback);

    render(
      <AnimatedBackground
        width={500}
        height={300}
        properties={{ bgColor: '#F06292', lineWidth: 6, lineColor: '#FEFEFE' }}
      />
    );

    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
