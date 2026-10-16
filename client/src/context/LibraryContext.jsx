import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const LibraryContext = createContext(null);
const emptyLibrary = { saved: [], liked: [], history: [] };

function readLibrary() {
  try {
    const stored = JSON.parse(localStorage.getItem("streamtube-demo-library"));
    return Object.fromEntries(
      Object.keys(emptyLibrary).map((key) => [
        key,
        Array.isArray(stored?.[key])
          ? stored[key].filter((id) => typeof id === "string").slice(0, 100)
          : [],
      ])
    );
  } catch {
    return emptyLibrary;
  }
}

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(readLibrary);

  useEffect(() => {
    try {
      // Only demo video IDs are stored here. Authentication stays in cookies.
      localStorage.setItem("streamtube-demo-library", JSON.stringify(library));
    } catch {
      /* Browsers can disable storage; in-memory actions still work. */
    }
  }, [library]);

  function toggle(collection, id) {
    setLibrary((previous) => ({
      ...previous,
      [collection]: previous[collection].includes(id)
        ? previous[collection].filter((item) => item !== id)
        : [id, ...previous[collection]].slice(0, 100),
    }));
  }

  const remember = useCallback((id) => {
    setLibrary((previous) => ({
      ...previous,
      history: [id, ...previous.history.filter((item) => item !== id)].slice(
        0,
        100
      ),
    }));
  }, []);

  return (
    <LibraryContext.Provider value={{ library, toggle, remember }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);
