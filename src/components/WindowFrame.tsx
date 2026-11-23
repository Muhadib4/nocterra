const arches = [
  "M 50 884 L 50 340 C 50 224 134 121 213 77 L 240 45 L 267 77 C 346 121 430 224 430 340 L 430 884 Z",
  "M 530 884 L 530 340 C 530 224 614 121 693 77 L 720 45 L 747 77 C 826 121 910 224 910 340 L 910 884 Z",
  "M 1010 884 L 1010 340 C 1010 224 1094 121 1173 77 L 1200 45 L 1227 77 C 1306 121 1390 224 1390 340 L 1390 884 Z",
];

function WindowFrame() {
  return (
    <svg
      className="window-frame"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask
          id="gothic-window-openings"
          x="0"
          y="0"
          width="1440"
          height="900"
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
        >
          <rect width="1440" height="900" fill="white" />
          {arches.map((arch) => (
            <path key={arch} d={arch} fill="black" />
          ))}
        </mask>
      </defs>
      <rect
        width="1440"
        height="900"
        fill="#000000"
        mask="url(#gothic-window-openings)"
      />
    </svg>
  );
}

export default WindowFrame;
