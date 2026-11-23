type FogEffectProps = {
  active: boolean;
};

function FogEffect({ active }: FogEffectProps) {
  return (
    <div
      className={`fog-effect${active ? " is-active" : " is-paused"}`}
      aria-hidden="true"
    >
      <span className="fog-effect__layer fog-effect__layer--near" />
      <span className="fog-effect__layer fog-effect__layer--far" />
    </div>
  );
}

export default FogEffect;
