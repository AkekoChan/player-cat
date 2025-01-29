import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import AnimatedBackground from '../components/animated-background/AnimatedBackground';

test('Le canvas exite.', () => {
  render(<AnimatedBackground width={500} height={300} />);
  const canvas = screen.getByTestId('canvas');
  expect(canvas).toBeInTheDocument();
});

test('Le canvas prend sa hauteur et sa largeur par ses props.', () => {
  render(<AnimatedBackground width={500} height={300} />);
  const canvas = screen.getByTestId('canvas');
  expect(canvas).toHaveStyle('width: 500px');
  expect(canvas).toHaveStyle('height: 300px');
});

// test('Le canvas est initialisé avec les bonnes méthodes du contexte', async () => {
//   const mockFillRect = vi.fn();

//   const mockGetContext = vi.fn().mockReturnValue({
//     fillRect: mockFillRect,
//     fillStyle: vi.fn(),
//     beginPath: vi.fn(),
//     moveTo: vi.fn(),
//     lineTo: vi.fn(),
//     stroke: vi.fn(),
//     scale: vi.fn(),
//     canvas: { width: 800, height: 600 } as HTMLCanvasElement,
//   });
//   HTMLCanvasElement.prototype.getContext = mockGetContext;

//   render(<AnimatedBackground width={800} height={600} />);

//   expect(mockFillRect).toHaveBeenCalledWith(0, 0, 800, 600);
// });
