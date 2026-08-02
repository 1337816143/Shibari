export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="绳路 3D 绳艺学习">
      <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M15 39c0-15 7-25 17-25 11 0 17 9 17 20 0 10-5 16-13 16-8 0-13-6-13-13 0-7 4-12 10-12 5 0 9 4 9 9" />
        <circle cx="15" cy="39" r="4" />
      </svg>
      {!compact && (
        <span className="brand__text">
          <strong>绳路</strong>
          <small>3D ROPE LEARNING</small>
        </span>
      )}
    </span>
  )
}

