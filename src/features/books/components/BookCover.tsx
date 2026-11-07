import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Book } from '../types';

export const BookCover = memo(function BookCover({
  book,
  small = false,
}: Readonly<{ book: Book; small?: boolean }>) {
  const style = {
    '--cover-bg': book.cover.background,
    '--cover-fg': book.cover.foreground,
  } as CSSProperties;
  return (
    <div
      className={`book-cover motif-${book.cover.motif}${small ? ' book-cover-small' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <span className="cover-label">{book.cover.label}</span>
      <span className="cover-title">{book.cover.title}</span>
      <div className="cover-art">
        <svg viewBox="0 0 120 76" fill="none">
          {book.cover.motif === 'code' && (
            <>
              <path
                d="m42 20-21 18 21 18m36-36 21 18-21 18M69 12 52 64"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <path d="M15 70h90" stroke="currentColor" opacity=".35" />
            </>
          )}
          {book.cover.motif === 'rings' && (
            <>
              {[13, 21, 29, 37].map((r) => (
                <circle key={r} cx="60" cy="38" r={r} stroke="currentColor" strokeWidth="1" />
              ))}
              <path d="M18 38h84M60 0v76" stroke="currentColor" opacity=".3" />
            </>
          )}
          {book.cover.motif === 'type' && (
            <>
              <text x="16" y="60" fontFamily="Georgia, serif" fontSize="62" fill="currentColor">
                Aa
              </text>
              <path d="M15 71h92" stroke="currentColor" />
            </>
          )}
          {book.cover.motif === 'steps' && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d={`M${12 + i * 19} 70V${57 - i * 11}h19v${13 + i * 11}`}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              ))}
              <path d="m15 38 80-30m-12-2 13 1-7 11" stroke="currentColor" strokeWidth="1.4" />
            </>
          )}
          {book.cover.motif === 'grid' && (
            <>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={21 + i * 27} y="6" width="22" height="22" stroke="currentColor" />
                  <rect
                    x={21 + i * 27}
                    y="33"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    opacity={0.25 + i * 0.25}
                  />
                </g>
              ))}
              <path d="M21 65h76" stroke="currentColor" />
            </>
          )}
          {book.cover.motif === 'orbit' && (
            <>
              <ellipse
                cx="60"
                cy="38"
                rx="49"
                ry="21"
                stroke="currentColor"
                transform="rotate(-28 60 38)"
              />
              <ellipse
                cx="60"
                cy="38"
                rx="49"
                ry="21"
                stroke="currentColor"
                transform="rotate(28 60 38)"
              />
              <circle cx="60" cy="38" r="13" fill="currentColor" />
              <circle cx="103" cy="20" r="4" fill="currentColor" />
            </>
          )}
        </svg>
      </div>
      <span className="cover-author">{book.author}</span>
    </div>
  );
});
