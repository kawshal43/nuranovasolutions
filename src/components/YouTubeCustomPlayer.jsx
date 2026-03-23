import { useEffect, useRef, useState } from "react";

let youtubeApiPromise = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube playback is only available in the browser."));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve, reject) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve(window.YT);
      };

      const existingScript = document.querySelector('script[data-education-youtube-api="true"]');
      if (existingScript) {
        existingScript.addEventListener("error", () => reject(new Error("YouTube player failed to load.")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.educationYoutubeApi = "true";
      script.onerror = () => reject(new Error("YouTube player failed to load."));
      document.body.appendChild(script);
    });
  }

  return youtubeApiPromise;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainingSeconds = wholeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function normalizeRates(rates) {
  const validRates = Array.isArray(rates) ? rates.filter((rate) => Number.isFinite(rate) && rate > 0) : [];
  return validRates.length ? validRates : [1];
}

export default function YouTubeCustomPlayer({ videoId, title, watermark }) {
  const wrapperRef = useRef(null);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availableRates, setAvailableRates] = useState([1]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    setIsReady(false);
    setIsLoading(true);
    setIsPlaying(false);
    setIsMuted(false);
    setVolume(100);
    setCurrentTime(0);
    setDuration(0);
    setPlaybackRate(1);
    setAvailableRates([1]);
    setErrorMessage("");

    async function setupPlayer() {
      try {
        const YT = await loadYouTubeApi();
        if (cancelled || !playerHostRef.current) {
          return;
        }

        playerHostRef.current.innerHTML = "";

        playerRef.current = new YT.Player(playerHostRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) {
                return;
              }

              const iframe = event.target.getIframe?.();
              if (iframe) {
                iframe.setAttribute("title", title || "Lesson video");
                iframe.setAttribute("tabindex", "-1");
              }

              setIsReady(true);
              setIsLoading(false);
              syncFromPlayer();
            },
            onStateChange: (event) => {
              if (cancelled) {
                return;
              }

              const nextState = event.data;
              if (nextState === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsLoading(false);
              } else if (nextState === YT.PlayerState.BUFFERING) {
                setIsLoading(true);
              } else if (nextState === YT.PlayerState.PAUSED || nextState === YT.PlayerState.ENDED || nextState === YT.PlayerState.CUED) {
                setIsPlaying(false);
                setIsLoading(false);
                syncFromPlayer();
              }
            },
            onError: () => {
              if (cancelled) {
                return;
              }

              setErrorMessage("This lesson video could not be loaded from YouTube.");
              setIsLoading(false);
              setIsPlaying(false);
            },
          },
        });

        syncIntervalRef.current = window.setInterval(syncFromPlayer, 250);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message || "YouTube player failed to initialize.");
          setIsLoading(false);
        }
      }
    }

    function syncFromPlayer() {
      const player = playerRef.current;
      if (!player?.getDuration) {
        return;
      }

      try {
        const nextDuration = player.getDuration() || 0;
        const nextCurrentTime = player.getCurrentTime() || 0;
        const nextPlaybackRate = player.getPlaybackRate?.() || 1;
        const nextRates = normalizeRates(player.getAvailablePlaybackRates?.());
        const nextMuted = player.isMuted?.() ?? false;
        const nextVolume = player.getVolume?.() ?? 100;

        setDuration(nextDuration);
        setCurrentTime(nextCurrentTime);
        setPlaybackRate(nextPlaybackRate);
        setAvailableRates(nextRates);
        setIsMuted(nextMuted || nextVolume === 0);
        setVolume(nextMuted ? 0 : nextVolume);
      } catch {
        // Ignore intermittent iframe API read errors while the player is initializing.
      }
    }

    setupPlayer();

    return () => {
      cancelled = true;

      if (syncIntervalRef.current) {
        window.clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = null;
    };
  }, [title, videoId]);

  async function toggleFullscreen() {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    if (document.fullscreenElement === wrapper) {
      await document.exitFullscreen();
      return;
    }

    await wrapper.requestFullscreen();
  }

  function togglePlay() {
    const player = playerRef.current;
    if (!player?.getPlayerState) {
      return;
    }

    const playerState = player.getPlayerState();
    if (playerState === window.YT?.PlayerState?.PLAYING) {
      player.pauseVideo();
      return;
    }

    player.playVideo();
  }

  function seekTo(nextTime) {
    const player = playerRef.current;
    if (!player?.seekTo || !Number.isFinite(nextTime)) {
      return;
    }

    player.seekTo(Math.max(0, Math.min(nextTime, duration || 0)), true);
  }

  function handleProgressChange(event) {
    seekTo(Number(event.target.value));
  }

  function handleVolumeChange(event) {
    const player = playerRef.current;
    if (!player?.setVolume) {
      return;
    }

    const nextVolume = Number(event.target.value);
    if (nextVolume <= 0) {
      player.mute?.();
      player.setVolume(0);
      setIsMuted(true);
      setVolume(0);
      return;
    }

    player.unMute?.();
    player.setVolume(nextVolume);
    setIsMuted(false);
    setVolume(nextVolume);
  }

  function toggleMute() {
    const player = playerRef.current;
    if (!player?.mute || !player?.unMute) {
      return;
    }

    if (player.isMuted?.() || volume === 0) {
      player.unMute();
      player.setVolume(volume > 0 ? volume : 100);
      setIsMuted(false);
      setVolume((currentVolume) => (currentVolume > 0 ? currentVolume : 100));
      return;
    }

    player.mute();
    setIsMuted(true);
  }

  function handlePlaybackRateChange(event) {
    const player = playerRef.current;
    if (!player?.setPlaybackRate) {
      return;
    }

    const nextRate = Number(event.target.value);
    player.setPlaybackRate(nextRate);
    setPlaybackRate(nextRate);
  }

  return (
    <div
      ref={wrapperRef}
      className="education-video-player"
      onContextMenu={(event) => event.preventDefault()}
      role="presentation"
    >
      <div className="education-youtube-viewport" onClick={togglePlay} ref={playerHostRef} />
      <div className="education-video-gradient" />

      <div className="education-video-topbar">
        <div className="education-video-title-group">
          <span className="education-video-badge">Lesson stream</span>
          <strong>{title}</strong>
        </div>
        {watermark ? <span className="education-player-watermark">{watermark}</span> : null}
      </div>

      {errorMessage ? (
        <div className="education-video-error">
          <strong>Playback unavailable</strong>
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {!errorMessage && (!isReady || isLoading) ? (
        <div className="education-video-loading">
          <span className="education-video-spinner" aria-hidden="true" />
          <span>Loading lesson video...</span>
        </div>
      ) : null}

      {!errorMessage ? (
        <button
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className={`education-video-center-toggle ${isPlaying ? "is-hidden" : ""}`}
          onClick={togglePlay}
          type="button"
        >
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
      ) : null}

      {!errorMessage ? (
        <div className="education-video-controls">
          <div className="education-video-progress">
            <input
              aria-label="Seek video"
              max={duration || 0}
              min="0"
              onChange={handleProgressChange}
              step="0.1"
              type="range"
              value={Math.min(currentTime, duration || 0)}
            />
          </div>

          <div className="education-video-control-row">
            <div className="education-video-button-group">
              <button className="education-video-control" onClick={togglePlay} type="button">
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button className="education-video-control" onClick={() => seekTo(currentTime - 10)} type="button">
                -10s
              </button>
              <button className="education-video-control" onClick={() => seekTo(currentTime + 10)} type="button">
                +10s
              </button>
              <button className="education-video-control" onClick={toggleMute} type="button">
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="education-video-volume">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <input
                aria-label="Video volume"
                max="100"
                min="0"
                onChange={handleVolumeChange}
                step="1"
                type="range"
                value={isMuted ? 0 : volume}
              />
            </div>

            <div className="education-video-button-group">
              <label className="education-video-rate">
                <span>Speed</span>
                <select onChange={handlePlaybackRateChange} value={playbackRate}>
                  {availableRates.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}x
                    </option>
                  ))}
                </select>
              </label>
              <button className="education-video-control" onClick={toggleFullscreen} type="button">
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
