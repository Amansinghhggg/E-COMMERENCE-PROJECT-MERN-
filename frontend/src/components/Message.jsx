export default function Message({ variant, children }) {
  return (
    <div className={`alert alert-${variant}`}>
      {children}
    </div>
  );
}