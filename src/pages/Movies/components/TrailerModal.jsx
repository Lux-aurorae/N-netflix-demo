import { useEffect } from "react";

function TrailerModal({ video, onClose }) {
  useEffect(() => {
    if (!video) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeWithEscape = (event) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose, video]);

  if (!video) return null;

  return (
    <div className="trailer-modal" role="dialog" aria-modal="true" aria-label={`${video.name} 예고편`}>
      <button className="trailer-modal__backdrop" type="button" onClick={onClose} aria-label="예고편 닫기" />
      <div className="trailer-modal__panel">
        <div className="trailer-modal__head">
          <p>{video.name}</p>
          <button type="button" onClick={onClose} aria-label="닫기">×</button>
        </div>
        <div className="trailer-modal__frame">
          <iframe src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`} title={video.name} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
