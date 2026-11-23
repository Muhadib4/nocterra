import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AmbientAudioProps = {
  isPaused: boolean;
};

function AmbientAudio({ isPaused }: AmbientAudioProps) {
  const rainRef = useRef<HTMLAudioElement>(null);
  const thunderRef = useRef<HTMLAudioElement>(null);
  const isMutedRef = useRef(false);
  const thunderVolumeRef = useRef(0.24);
  const isPausedRef = useRef(isPaused);
  const isAudioEnabledRef = useRef(false);
  const audioRequestRef = useRef(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.42);
  const [thunderVolume, setThunderVolume] = useState(0.24);
  const [message, setMessage] = useState("");

  isMutedRef.current = isMuted;
  thunderVolumeRef.current = thunderVolume;
  isPausedRef.current = isPaused;
  isAudioEnabledRef.current = isAudioEnabled;

  useEffect(() => {
    if (rainRef.current) {
      rainRef.current.volume = isMuted ? 0 : rainVolume;
    }

    if (thunderRef.current) {
      thunderRef.current.volume = isMuted ? 0 : thunderVolume;
    }
  }, [isMuted, rainVolume, thunderVolume]);

  useEffect(() => {
    const rain = rainRef.current;
    const thunder = thunderRef.current;

    if (!rain || !thunder || !isAudioEnabled || isPaused) {
      rain?.pause();
      thunder?.pause();
      return;
    }

    let thunderTimeout = 0;

    function scheduleThunder() {
      thunderTimeout = window.setTimeout(
        async () => {
          const currentThunder = thunderRef.current;

          if (
            currentThunder &&
            !currentThunder.error &&
            !isMutedRef.current &&
            thunderVolumeRef.current > 0
          ) {
            currentThunder.currentTime = 0;

            try {
              await currentThunder.play();
            } catch {
              setMessage(
                "Suara petir tidak dapat diputar. Hujan tetap berjalan.",
              );
            }
          }

          scheduleThunder();
        },
        45000 + Math.random() * 45000,
      );
    }

    void rain.play().catch(() => {
      if (isPausedRef.current || !isAudioEnabledRef.current) {
        return;
      }

      setMessage(
        "Suara hujan tidak dapat diputar. Periksa file atau pengaturan browser.",
      );
      isAudioEnabledRef.current = false;
      setIsAudioEnabled(false);
    });
    scheduleThunder();

    return () => {
      window.clearTimeout(thunderTimeout);
      rain.pause();
      thunder.pause();
    };
  }, [isAudioEnabled, isPaused]);

  async function toggleAudio() {
    if (isAudioEnabled) {
      audioRequestRef.current += 1;
      isAudioEnabledRef.current = false;
      setIsAudioEnabled(false);
      rainRef.current?.pause();
      thunderRef.current?.pause();
      return;
    }

    setMessage("");

    if (isPaused) {
      isAudioEnabledRef.current = true;
      setIsAudioEnabled(true);
      return;
    }

    const rain = rainRef.current;

    if (!rain) {
      setMessage("Pemutar hujan tidak tersedia.");
      return;
    }

    rain.volume = isMuted ? 0 : rainVolume;
    const requestId = audioRequestRef.current + 1;
    audioRequestRef.current = requestId;
    isAudioEnabledRef.current = true;
    setIsAudioEnabled(true);
    setMessage("Memuat suara hujan.");

    try {
      await rain.play();
      if (audioRequestRef.current === requestId) {
        setMessage("");
      }
    } catch {
      if (
        audioRequestRef.current === requestId &&
        !isPausedRef.current &&
        isAudioEnabledRef.current
      ) {
        isAudioEnabledRef.current = false;
        setIsAudioEnabled(false);
        setMessage(
          "Suara hujan tidak dapat diputar. Periksa file atau pengaturan browser.",
        );
      }
    }
  }

  return (
    <>
      <button
        className="control-button"
        type="button"
        aria-pressed={isAudioEnabled}
        onClick={toggleAudio}
      >
        <Volume2 aria-hidden="true" size={18} />
        <span>{isAudioEnabled ? "Matikan suara" : "Aktifkan suara"}</span>
      </button>

      {isAudioEnabled && (
        <button
          className="control-button"
          type="button"
          aria-pressed={isMuted}
          onClick={() => setIsMuted((muted) => !muted)}
        >
          {isMuted ? (
            <VolumeX aria-hidden="true" size={18} />
          ) : (
            <Volume2 aria-hidden="true" size={18} />
          )}
          <span>{isMuted ? "Pulihkan suara" : "Bisukan suara"}</span>
        </button>
      )}

      <details className="sound-settings">
        <summary>Atur volume</summary>
        <div className="sound-settings__panel">
          <label htmlFor="rain-volume">
            Volume hujan <span>{Math.round(rainVolume * 100)}%</span>
          </label>
          <input
            id="rain-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={rainVolume}
            onChange={(event) =>
              setRainVolume(Number(event.currentTarget.value))
            }
          />
          <label htmlFor="thunder-volume">
            Volume petir <span>{Math.round(thunderVolume * 100)}%</span>
          </label>
          <input
            id="thunder-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={thunderVolume}
            onChange={(event) =>
              setThunderVolume(Number(event.currentTarget.value))
            }
          />
        </div>
      </details>

      {message && (
        <p className="ambient__notice" role="status">
          {message}
        </p>
      )}

      <audio
        ref={rainRef}
        src="/media/rain-loop.mp3"
        preload="none"
        loop
        onError={() => {
          isAudioEnabledRef.current = false;
          setIsAudioEnabled(false);
          setMessage(
            "Suara hujan tidak dapat dimuat. Adegan tetap berjalan tanpa audio.",
          );
        }}
        hidden
      />
      <audio
        ref={thunderRef}
        src="/media/thunder-dry.mp3"
        preload="metadata"
        onError={() =>
          setMessage("Suara petir tidak dapat dimuat. Hujan tetap berjalan.")
        }
        hidden
      />
    </>
  );
}

export default AmbientAudio;
