import "./Background.css";

/**
 * Background – global aurora background component.
 * Renders a fixed, full-viewport pastel aurora gradient that sits behind
 * every page (z-index: -1). Drop this once at the top of your app and
 * it will be visible across all pages automatically.
 */
export default function Background() {
    return <div className="aurora-bg" aria-hidden="true" />;
}
