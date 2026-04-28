import "./Background.css";
import { getServiceContrallerBackgroundLayers } from "../controllers/serviceContraller";

/**
 * Background – global aurora background component.
 * Renders a fixed, full-viewport pastel aurora gradient that sits behind
 * every page (z-index: -1). Drop this once at the top of your app and
 * it will be visible across all pages automatically.
 */
export default function Background({ theme = "light" }) {
    const controllerLayers = getServiceContrallerBackgroundLayers(theme);

    return (
        <div className="aurora-bg" aria-hidden="true">
            <div className="aurora-bg__controller-layers">
                {controllerLayers.map((layer) => (
                    <span
                        key={layer.id}
                        className="aurora-bg__controller-layer"
                        style={layer.style}
                    />
                ))}
            </div>
        </div>
    );
}
