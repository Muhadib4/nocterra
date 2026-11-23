import { useEffect, useRef, useState } from "react";

type Scene = {
  key: string;
  label: string;
  source: string;
  poster: string;
};

const scenes: Scene[] = [
  {
    key: "rain",
    label: "hutan hujan",
    source: "/media/forest-rain.mp4",
    poster: "/media/forest-rain-poster.jpg",
  },
  {
    key: "castle",
    label: "kastil",
    source: "/media/castle-mountain.mp4",
    poster: "/media/castle-mountain-poster.jpg",
  },
  {
    key: "fog",
    label: "hutan berkabut",
    source: "/media/forest-fog.mp4",
    poster: "/media/forest-fog-poster.jpg",
  },
];

type ScenePanelProps = {
  scene: Scene;
  isPaused: boolean;
  reducedMotion: boolean;
  onVideoFallback: (message: string) => void;
};

function ScenePanel({
  scene,
  isPaused,
  reducedMotion,
  onVideoFallback,
}: ScenePanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasReportedFallback = useRef(false);
  const isNearLoopSeam = useRef(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function reportVideoFallback() {
    setVideoFailed(true);

    if (!hasReportedFallback.current) {
      hasReportedFallback.current = true;
      onVideoFallback(
        `Video ${scene.label} tidak dapat diputar. Gambar diam tetap ditampilkan.`,
      );
    }
  }

  useEffect(() => {
    const video = videoRef.current;

    if (!video || reducedMotion || videoFailed) {
      return;
    }

    if (isPaused) {
      video.pause();
      return;
    }

    void video.play().catch(reportVideoFallback);
  }, [isPaused, reducedMotion, videoFailed]);

  return (
    <div className={`scene-panel scene-panel--${scene.key}`}>
      <img
        className="scene-panel__poster"
        src={scene.poster}
        alt=""
        aria-hidden="true"
        width={1280}
        height={720}
        fetchPriority={scene.key === "castle" ? "high" : "auto"}
      />
      {!reducedMotion && !videoFailed && (
        <video
          ref={videoRef}
          className={`scene-panel__video${isTransitioning ? " is-transitioning" : ""}`}
          autoPlay={!isPaused}
          muted
          loop
          playsInline
          preload="metadata"
          poster={scene.poster}
          width={1280}
          height={720}
          aria-hidden="true"
          onError={reportVideoFallback}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            const nearSeam =
              video.duration > 0 &&
              (video.duration - video.currentTime < 0.75 ||
                video.currentTime < 0.75);

            if (nearSeam !== isNearLoopSeam.current) {
              isNearLoopSeam.current = nearSeam;
              setIsTransitioning(nearSeam);
            }
          }}
        >
          <source src={scene.source} type="video/mp4" />
        </video>
      )}
      {videoFailed && (
        <span className="sr-only" role="status">
          Video {scene.label} tidak dapat diputar; gambar diam ditampilkan.
        </span>
      )}
    </div>
  );
}

type AmbientSceneProps = {
  isPaused: boolean;
  reducedMotion: boolean;
  onVideoFallback: (message: string) => void;
};

function AmbientScene({
  isPaused,
  reducedMotion,
  onVideoFallback,
}: AmbientSceneProps) {
  return (
    <div className="ambient-scene" aria-hidden="true">
      {scenes.map((scene) => (
        <ScenePanel
          key={scene.key}
          scene={scene}
          isPaused={isPaused}
          reducedMotion={reducedMotion}
          onVideoFallback={onVideoFallback}
        />
      ))}
    </div>
  );
}

export default AmbientScene;
