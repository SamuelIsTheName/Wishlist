import { useState, useRef, useEffect } from "react";
import styles from "./styles";
import BookJournal from '../BookJournal/BookJournal';
import { login, logout } from "../../api/auth";

export default function BookLogin({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Enter your credentials to begin");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [settled, setSettled] = useState(false);

  // Runtime position of the spine — measured after zoom animation completes
  const [spineRight, setSpineRight] = useState(null);
  const spineRef = useRef(null);

  // Measure where the spine's right edge actually lands after zooming
  useEffect(() => {
    if (!settled || !spineRef.current) return;

    const measure = () => {
      const rect = spineRef.current.getBoundingClientRect();
      // spineRight = distance from spine's right edge to the right edge of the viewport
      setSpineRight(window.innerWidth - rect.right);
    };

    // Small delay to let any residual transition finish
    const timer = setTimeout(measure, 50);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [settled]);

  const switchTab = (tab) => {
    setMode(tab);
    setStatus(tab === "login" ? "Enter your credentials to begin" : "Create your account");
    setIsError(false);
  };

  const handleLogout = () => {
    logout();
    setSettled(false);
    setSpineRight(null);
    setTimeout(() => setZoomed(false), 50);
    setTimeout(() => setIsOpen(false), 800);
    setTimeout(() => {
      setUsername("");
      setPassword("");
      setEmail("");
      setMode("login");
      setStatus("Enter your credentials to begin");
      setIsError(false);
      setLoading(false);
    }, 2400);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setStatus("Please fill in all fields.");
      setIsError(true);
      return;
    }
    if (mode === "signup" && !username.trim()) {
      setStatus("Please enter a username.");
      setIsError(true);
      return;
    }

    setIsError(false);
    setLoading(true);
    setStatus(mode === "login" ? "Opening your wishlist…" : "Creating your account…");

    try {
      if (mode === "login") {
        login(email, password);
      } else {
        await onSignup?.({ username, password, email });
      }

      setTimeout(() => setIsOpen(true), 400);
      setTimeout(() => setZoomed(true), 1800);
      setTimeout(() => setSettled(true), 3200);
    } catch (err) {
      setStatus(err?.message || "Something went wrong. Try again.");
      setIsError(true);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // Container stretches from left:0 to the spine's right edge.
  // Flexbox then centres the buttons within that exact region.
  const actionsStyle = spineRight !== null
    ? { right: `${spineRight}px` }
    : { visibility: "hidden" }; // hide until measured to avoid a flash

  return (
    <>
      <style>{styles}</style>

      <div className="book-root">
        <div className={`scene${zoomed ? " zoomed" : ""}`}>

          {/* Pages — always visible behind cover */}
          <div className="pages" />

          {/* Spine — ref so we can measure its real screen position */}
          <div className="spine" ref={spineRef} />

          {/* Cover — rotates from spine edge */}
          <div className={`cover${isOpen ? " open" : ""}`}>
            <div className="cover-front">
              <div className="book-title">My<br />WishList</div>
              <div className="ornament">✦ ✦ ✦</div>

              <div className="form-area" onClick={(e) => e.stopPropagation()}>
                <div className="tab-row">
                  <button
                    className={`tab-btn${mode === "login" ? " active" : ""}`}
                    onClick={() => switchTab("login")}
                  >
                    Sign in
                  </button>
                  <button
                    className={`tab-btn${mode === "signup" ? " active" : ""}`}
                    onClick={() => switchTab("signup")}
                  >
                    Sign up
                  </button>
                </div>

                <input
                  className="book-field"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                />
                <input
                  className="book-field"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                {mode === "signup" && (
                  <input
                    className="book-field"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="username"
                  />
                )}

                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {mode === "login" ? "Open the list" : "Begin your list"}
                </button>

                <div className={`status-msg${isError ? " error" : ""}`}>
                  {status}
                </div>
              </div>
            </div>

            {/* Inner face of cover — purely decorative when open */}
            <div className="cover-inner" />
          </div>

        </div>
      </div>

      {/*
        Action buttons — outside the 3D scene (crisp text, no blur).
        `right` inline style = measured spine position, so the container
        always fills exactly the inner-cover dark area at any viewport size.
      */}
      {settled && (
        <div className="inner-cover-actions" style={actionsStyle}>
          <button className="add-btn" onClick={() => console.log("Add item")}>
            + Add Item
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Journal overlay — outside 3D scene so pointer events work freely */}
      {settled && (
        <div className="journal-overlay" onClick={(e) => e.stopPropagation()}>
          <BookJournal user={username} />
        </div>
      )}
    </>
  );
}