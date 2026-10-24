interface PaginationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}

export function PaginationControls({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: PaginationControlsProps) {
  return (
    <div className="pagination-container">
      <button className="btn-secondary" onClick={onPrev} disabled={disablePrev}>
        Poprzednia
      </button>
      <button className="btn-secondary" onClick={onNext} disabled={disableNext}>
        Następna
      </button>
    </div>
  );
}
