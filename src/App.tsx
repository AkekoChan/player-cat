import AnimatedBackground from './components/animated-background/AnimatedBackground';

const App = () => {
  return (
    <div>
      <h1>App</h1>
      <AnimatedBackground
        width={800}
        height={800}
        properties={{ bgColor: '#F06292', lineWidth: 6, lineColor: '#FEFEFE' }}
      />
    </div>
  );
};

export default App;
