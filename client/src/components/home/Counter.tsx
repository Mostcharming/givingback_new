// @ts-ignore

import CountUp from "react-countup";
import ReactVisibilitySensor from "react-visibility-sensor";

interface CounterProps {
  end?: number;
  decimals?: number;

}

const Counter = ({ end, decimals }: CounterProps) => {
  return (
    <CountUp
      end={end ? end : 100}
      duration={1}
      decimals={decimals ? decimals : 0}
    >
      {({ countUpRef, start }) => (
        <ReactVisibilitySensor onChange={start} delayedCall>
          <span className="count" data-to={end} ref={countUpRef}>
            {end}
          </span>
        </ReactVisibilitySensor>
      )}
    </CountUp>
  );
};

export default Counter;
