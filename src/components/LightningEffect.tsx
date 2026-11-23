import { useEffect, useState } from "react";

type LightningEffectProps = {
  active: boolean;
};

function LightningEffect({ active }: LightningEffectProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsFlashing(false);
      return;
    }

    let flashTimeout = 0;
    let resetTimeout = 0;

    function scheduleFlash() {
      flashTimeout = window.setTimeout(
        () => {
          setIsFlashing(true);
          resetTimeout = window.setTimeout(() => {
            setIsFlashing(false);
            scheduleFlash();
          }, 1050);
        },
        28000 + Math.random() * 42000,
      );
    }

    scheduleFlash();

    return () => {
      window.clearTimeout(flashTimeout);
      window.clearTimeout(resetTimeout);
    };
  }, [active]);

  return (
    <div
      className={`lightning-effect${isFlashing ? " is-flashing" : ""}`}
      aria-hidden="true"
    />
  );
}

export default LightningEffect;
