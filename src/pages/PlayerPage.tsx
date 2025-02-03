import AnimatedBackground from '../components/animated-background/AnimatedBackground';

const PlayerPage = () => {
  return (
    <>
      <AnimatedBackground
        width={800}
        height={800}
        properties={{ bgColor: '#263a7a', lineWidth: 3, lineColor: '#FEFEFE' }}
      />
    </>
  );
};

export default PlayerPage;
