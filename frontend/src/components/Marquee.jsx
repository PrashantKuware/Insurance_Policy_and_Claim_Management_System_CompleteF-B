import "./marquee.css";

export default function Marquee({ children, reverse, pauseOnHover }) {
  return (
    <div className="marquee-wrapper group">
      <div
        className="marquee-track"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
        {children} {/* 🔥 duplicate for smooth loop */}
      </div>
    </div>
  );
}