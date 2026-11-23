import { Maximize, Minimize, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import AmbientAudio from "./components/AmbientAudio";
import AmbientScene from "./components/AmbientScene";
import FogEffect from "./components/FogEffect";
import LightningEffect from "./components/LightningEffect";
import RainEffect from "./components/RainEffect";
import WindowFrame from "./components/WindowFrame";

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState("");
  const [sceneMessage, setSceneMessage] = useState("");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateFullscreen = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", updateFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }

      setFullscreenMessage("");
    } catch {
      setFullscreenMessage("Mode layar penuh tidak tersedia di browser ini.");
    }
  }

  return (
    <>
      <a className="skip-link" href="#ambient-controls">
        Langsung ke kontrol ambience
      </a>

      <main
        className="ambient"
        id="main-content"
        aria-labelledby="ambient-title"
        aria-describedby="ambient-description"
      >
        <h1 className="ambient__title" id="ambient-title">
          NOCTERRA
        </h1>
        <p className="sr-only" id="ambient-description">
          Pemandangan kastil dan hutan bergerak di balik tiga lengkungan
          jendela gothic, dengan efek hujan dan kabut.
        </p>

        <AmbientScene
          isPaused={isPaused}
          reducedMotion={reducedMotion}
          onVideoFallback={setSceneMessage}
        />
        <FogEffect active={!isPaused && !reducedMotion} />
        <RainEffect active={!isPaused && !reducedMotion} />
        <LightningEffect active={!isPaused && !reducedMotion} />
        <WindowFrame />

        {reducedMotion && (
          <p className="ambient__motion-note">
            Gerakan dimatikan sesuai preferensi perangkat.
          </p>
        )}

        <div
          className="ambient-controls"
          id="ambient-controls"
          role="group"
          aria-label="Kontrol ambience"
        >
          <button
            className="control-button"
            type="button"
            aria-pressed={isPaused}
            onClick={() => setIsPaused((paused) => !paused)}
          >
            {isPaused ? (
              <Play aria-hidden="true" size={18} />
            ) : (
              <Pause aria-hidden="true" size={18} />
            )}
            <span>{isPaused ? "Lanjutkan ambience" : "Jeda ambience"}</span>
          </button>

          <AmbientAudio isPaused={isPaused} />

          <button
            className="control-button"
            type="button"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize aria-hidden="true" size={18} />
            ) : (
              <Maximize aria-hidden="true" size={18} />
            )}
            <span>{isFullscreen ? "Keluar layar penuh" : "Layar penuh"}</span>
          </button>
        </div>

        {(fullscreenMessage || sceneMessage) && (
          <div className="ambient__notices">
            {fullscreenMessage && (
              <p className="ambient__notice" role="status">
                {fullscreenMessage}
              </p>
            )}
            {sceneMessage && (
              <p className="ambient__notice" role="status">
                {sceneMessage}
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
