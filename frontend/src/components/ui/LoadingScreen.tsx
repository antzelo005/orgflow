export function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="center-state">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
