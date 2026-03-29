import Link from "next/link";

type Props = {
  isDashboard: boolean;
  onLogout: () => void;
};

export function StayFooter({ isDashboard, onLogout }: Props) {
  return (
    <footer className="stayFooter">
      <div className="stayFooterInner">
        <div className="stayFooterCols">
          <div>
            <h3>Support</h3>
            <ul>
              <li>
                <a href="#">Help Centre</a>
              </li>
              <li>
                <a href="#">Safety</a>
              </li>
              <li>
                <a href="#">Cancellation options</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Hosting</h3>
            <ul>
              <li>
                <Link href="/register">Host your home</Link>
              </li>
              <li>
                <a href="#">Resources</a>
              </li>
              <li>
                <a href="#">Community forum</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              {isDashboard ? (
                <li>
                  <button type="button" className="stayFooterLinkBtn" onClick={onLogout}>
                    Log out
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/login">Sign in</Link>
                  </li>
                  <li>
                    <Link href="/register">Create account</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="stayFooterBar">
          <span>© 2026 Stay, Inc.</span>
          <span className="stayFooterDot">·</span>
          <span>Privacy</span>
          <span className="stayFooterDot">·</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}
