export default function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
  <div
    className="spinner-border text-primary"
    role="status"
    style={{ width: "4rem", height: "4rem", borderWidth: "0.45em" }}
  >
    <span className="visually-hidden">Loading...</span>
  </div>
</div>
    );
}