import { useState } from "react";

const PREVIEW_LENGTH = 360;

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const content = review.content?.trim() || "작성된 리뷰 내용이 없습니다.";
  const isLong = content.length > PREVIEW_LENGTH;
  const visibleContent = !expanded && isLong ? `${content.slice(0, PREVIEW_LENGTH).trim()}…` : content;
  const rating = review.author_details?.rating;
  const date = review.created_at
    ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(review.created_at))
    : null;

  return (
    <article className="review">
      <header className="review__head">
        <div className="review__avatar" aria-hidden="true">{(review.author || "U").slice(0, 1).toUpperCase()}</div>
        <div>
          <h3 className="review__author">{review.author || "익명 사용자"}</h3>
          <p className="review__meta">
            {date}
            {rating != null && <span className="review__rating">★ {rating}/10</span>}
          </p>
        </div>
      </header>
      <p className="review__content">{visibleContent}</p>
      {isLong && (
        <button className="review__toggle" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? "접기 ↑" : "더보기 ↓"}
        </button>
      )}
    </article>
  );
}

export default ReviewCard;
