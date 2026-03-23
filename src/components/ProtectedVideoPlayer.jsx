import { useEffect, useRef, useState } from "react";

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

export default function ProtectedVideoPlayer({ src, title, watermark }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    setIsReady(false);
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    function handleLoadedMetadata() {
      setDuration(video.duration || 0);
      setIsReady(true);
      setIsLoading(false);
    }

    function handleTimeUpdate() {
      setCurrentTime(video.currentTime || 0);
    }

    function handlePlay() {
      setIsPlaying(true);
      setIsLoading(false);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleWaiting() {
      setIsLoading(true);
    }

    function handlePlaying() {
      setIsLoading(false);
    }

    function handleVolumeChange() {
      setVolume(video.volume);
      setIsMuted(video.muted || video.volume === 0);
    }

    function handleRateChange() {
      setPlaybackRate(video.playbackRate);
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("ratechange", handleRateChange);
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("ratechange", handleRateChange);
    };
  }, [src]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  }

  function seekTo(nextTime) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(nextTime)) {
      return;
    }

    video.currentTime = Math.max(0, Math.min(nextTime, duration || 0));
  }

  function handleProgressChange(event) {
    seekTo(Number(event.target.value));
  }

  function handleVolumeChange(event) {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const nextVolume = Number(event.target.value);
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function handlePlaybackRateChange(event) {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const nextRate = Number(event.target.value);
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }

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

  return (
    <div
      ref={wrapperRef}
      className="education-video-player"
      onContextMenu={(event) => event.preventDefault()}
      role="presentation"
    >
      <video
        ref={videoRef}
        className="education-video-element"
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onClick={togglePlay}
        playsInline
        preload="metadata"
        src={src}
      />

      <div className="education-video-gradient" />

      <div className="education-video-topbar">
        <div className="education-video-title-group">
          <span className="education-video-badge">Protected lesson</span>
          <strong>{title}</strong>
        </div>
        {watermark ? <span className="education-player-watermark">{watermark}</span> : null}
      </div>

      {!isReady || isLoading ? (
        <div className="education-video-loading">
          <span className="education-video-spinner" aria-hidden="true" />
          <span>Loading secure stream...</span>
        </div>
      ) : null}

      <button
        aria-label={isPlaying ? "Pause video" : "Play video"}
        className={`education-video-center-toggle ${isPlaying ? "is-hidden" : ""}`}
        onClick={togglePlay}
        type="button"
      >
        <span>{isPlaying ? "Pause" : "Play"}</span>
      </button>

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
              max="1"
              min="0"
              onChange={handleVolumeChange}
              step="0.05"
              type="range"
              value={isMuted ? 0 : volume}
            />
          </div>

          <div className="education-video-button-group">
            <label className="education-video-rate">
              <span>Speed</span>
              <select onChange={handlePlaybackRateChange} value={playbackRate}>
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
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
    </div>
  );
}
