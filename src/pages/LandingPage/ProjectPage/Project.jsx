import  { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Project.css";
import { FiSave, FiDownload } from "react-icons/fi";
import NavbarMenu from "../components/NavbarMenu";
import Footer1 from "../components/Footer1";




const DEFAULT_ITEMS = [
  { id: "it1", title: "Chair", img: "/media/woodenchair.png", count: 0, min: 0, max: 99 },
  { id: "it2", title: "Mic Stand", img: "/media/mic-stand.png", count: 0, min: 0, max: 99 },
  { id: "it3", title: "Stage Light", img: "/media/spotlight.png", count: 0, min: 0, max: 99 },
  { id: "it4", title: "Table", img: "/media/spotlight-1.png", count: 0, min: 0, max: 99 },
  { id: "it5", title: "Sofa", img: "/media/armchair.png", count: 0, min: 0, max: 99 },
  { id: "it6", title: "Podium", img: "/media/tribune.png", count: 0, min: 0, max: 99 },
  { id: "it7", title: "Curtain", img: "/media/theater.png", count: 0, min: 0, max: 99 },
];

const FALLBACK_PLACEHOLDER = "/media/placeholder-36.png"; // add placeholder in public/media

export default function ProjectPage() {
  const location = useLocation();
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [project, setProject] = useState(null);

  // Mapping to normalize older icon filenames to new media files
  const IMAGE_MAP = {
    // keys that might appear in localStorage -> desired public/media path
    "icon-chair.png": "/media/wooden-chair.png",
    "/media/icon-chair.png": "/media/wooden-chair.png",
    "media/icon-chair.png": "/media/wooden-chair.png",
    "icon-mic.png": "/media/mic-stand.png",
    "/media/icon-mic.png": "/media/mic-stand.png",
    "media/icon-mic.png": "/media/mic-stand.png",
    // add other mappings if you have other mismatches
  };

  // Normalize a single item (safe)
  const normalizeItem = (it) => {
    if (!it) return null;
    const cloned = { ...it };
    const img = String(cloned.img || "");
    for (const key in IMAGE_MAP) {
      if (!key) continue;
      if (img === key || img.includes(key)) {
        cloned.img = IMAGE_MAP[key];
        break;
      }
    }
    // ensure required fields
    cloned.count = typeof cloned.count === "number" ? cloned.count : 0;
    cloned.min = typeof cloned.min === "number" ? cloned.min : 0;
    cloned.max = typeof cloned.max === "number" ? cloned.max : 9999;
    cloned.title = cloned.title || "Item";
    cloned.id = cloned.id || `id-${Math.random().toString(36).slice(2, 9)}`;
    return cloned;
  };

  // Load project (from navigation state or localStorage moodboards)
  useEffect(() => {
    if (location.state && location.state.moodboard) {
      setProject(location.state.moodboard);
      return;
    }
    try {
      const raw = localStorage.getItem("moodboards_v1");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) {
          const last = arr[arr.length - 1];
          setProject(last);
        }
      }
    } catch (e) {
      console.warn("Could not read moodboards_v1:", e);
    }
  }, [location.state]);

  // Load palette (with normalization)
  useEffect(() => {
    let loaded = null;
    try {
      const raw = localStorage.getItem("palette_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          loaded = parsed.map(normalizeItem);
        }
      }
    } catch (e) {
      console.warn("Failed to parse palette_v1:", e);
    }

    if (!loaded) {
      // use defaults normalized
      loaded = DEFAULT_ITEMS.map(normalizeItem);
    } else {
      // if any item missing img, try to set based on id -> default mapping
      loaded = loaded.map((it) => {
        if (!it.img || it.img === "undefined") {
          const def = DEFAULT_ITEMS.find((d) => d.id === it.id);
          if (def) it.img = def.img;
          else it.img = FALLBACK_PLACEHOLDER;
        }
        return it;
      });
    }

    // Save normalized result back to localStorage (so next loads are correct)
    try {
      localStorage.setItem("palette_v1", JSON.stringify(loaded));
    } catch (e) {
      // ignore
    }

    setItems(loaded);
  }, []);

  const changeCount = (id, delta) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const next = Math.max(it.min ?? 0, Math.min(it.max ?? 9999, (it.count ?? 0) + delta));
        return { ...it, count: next };
      })
    );
  };

  const clearAll = () => {
    const cleared = items.map((it) => ({ ...it, count: 0 }));
    setItems(cleared);
    try {
      localStorage.setItem("palette_v1", JSON.stringify(cleared));
    } catch (e) {}
  };

  const handleSave = () => {
    const payload = {
      createdAt: new Date().toISOString(),
      items: items.map(({ id, title, count, img }) => ({ id, title, img, count })),
    };
    console.log("Palette saved:", payload);
    // store saved moodboards list or palette as required
    try {
      const key = "saved_palettes_v1";
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(payload);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
    alert("Palette saved (check console). Replace with API call as needed.");
  };

  const handleDownload = () => {
    const payload = { createdAt: new Date().toISOString(), items };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palette-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // auto-save palette to localStorage whenever items change (debounce not included for brevity)
    try {
      localStorage.setItem("palette_v1", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const totalSelected = items.reduce((s, it) => s + (it.count || 0), 0);

  return (
    <>
    <NavbarMenu/>
    <div className="palette-page">
      <header className="pp-header">
        <div>
          <h1 className="pp-title">{project ? project.name : "Untitled Project"}</h1>
         
        </div>

        <div className="pp-actions">
         
          <button className="pp-link" onClick={clearAll}>CLEAR ALL</button>
         <button className="pp-btn pp-btn-vertical" onClick={handleSave}>
  <FiSave size={18} className="pp-icon" />
  <span>Save</span>
</button>

<button className="pp-btn pp-btn-vertical" onClick={handleDownload}>
  <FiDownload size={18} className="pp-icon" />
  <span>Download</span>
</button>

        </div>
      </header>

      <main className="pp-main">
        <aside className="pp-sidebar" aria-label="Object Palette">
            <h3 className="pp-maintitle">Object Palette</h3>
          <div className="pp-list" role="list">
            {items.map((it) => (
              <div key={it.id} className="pp-item" role="listitem" aria-label={it.title}>
                <div className="pp-thumb" title={it.title}>
                  <img
                    src={it.img || FALLBACK_PLACEHOLDER}
                    alt={it.title}
                    onError={(e) => {
                      console.warn("Image failed to load for item:", it.id, "attempted src:", e.currentTarget.src);
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_PLACEHOLDER;
                    }}
                  />
                </div>

                <div className="pp-controls">
                  <button className="pp-qty" onClick={() => changeCount(it.id, -1)} aria-label={`Decrease ${it.title}`}>−</button>
                  <div className="pp-count" aria-live="polite">{it.count ?? 0}</div>
                  <button className="pp-qty" onClick={() => changeCount(it.id, +1)} aria-label={`Increase ${it.title}`}>+</button>
                </div>
              </div>
            ))}
          </div>

       {/*}   <div className="pp-footer">
            <div className="pp-summary">
              <span className="pp-label">Selected:</span>
              <span className="pp-value">{totalSelected}</span>
            </div>
          </div>*/}
        </aside>

        <section className="pp-canvas" aria-label="Canvas">
          <div className="pp-canvas-inner">
          </div>
        </section>
      </main>
    </div>

   <Footer1/>
    </>
  );
}
