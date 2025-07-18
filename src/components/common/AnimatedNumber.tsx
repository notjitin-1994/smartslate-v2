import { useSpring, animated } from '@react-spring/web';

interface AnimatedNumberProps {
  value: number;
  formatValue?: (value: number) => string;
}

export function AnimatedNumber({ value, formatValue = (val) => val.toString() }: AnimatedNumberProps) {
  const spring = useSpring({
    from: { val: 0 },
    to: { val: value },
    config: { tension: 80, friction: 10 },
  });

  return (
    <animated.span>
      {spring.val.to((val) => formatValue(val))}
    </animated.span>
  );
}
