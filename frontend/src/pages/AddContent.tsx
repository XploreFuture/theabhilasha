import { useState, useEffect } from "react";
import { isAuthenticated, decodeAccessToken } from "../utils/auth";
import { fetchWithAuth } from "../utils/api";

export default function AddContent() {
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [sections, setSections] = useState([{ heading: "", content: "", image: "" }]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Access denied. Please login as admin.");
      window.location.href = "/login";
    } else {
      const decoded = decodeAccessToken();
      setUserRole(decoded?.role ?? null);
      if (decoded?.role !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "/";
      }
    }
  }, []);

  const addSection = () =>
    setSections([...sections, { heading: "", content: "", image: "" }]);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { type, title, sections };
    const result = await fetchWithAuth("/api/content/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (result) {
      alert("Content added successfully!");
      setType("");
      setTitle("");
      setSections([{ heading: "", content: "", image: "" }]);
    }
  };

  if (!userRole || userRole !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Content</h1>

      <select
        className="border p-2 mb-2 w-full"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="shayari">Shayari</option>
        <option value="poem">Poem</option>
        <option value="story">Story</option>
        <option value="article">Article</option>
      </select>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
            className="border p-1 w-full"
            placeholder="Image URL (optional)"
            value={imageurl}
        onChange={(e) => setImageurl(e.target.value)}
          />

      {sections.map((s, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 mb-1 w-full"
            placeholder="Heading"
            value={s.heading}
            onChange={(e) => {
              const newSections = [...sections];
              newSections[i].heading = e.target.value;
              setSections(newSections);
            }}
          />
          <textarea
            className="border p-1 mb-1 w-full"
            placeholder="Content"
            value={s.content}
            onChange={(e) => {
              const newSections = [...sections];
              newSections[i].content = e.target.value;
              setSections(newSections);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="Image URL (optional)"
            value={s.image}
            onChange={(e) => {
              const newSections = [...sections];
              newSections[i].image = e.target.value;
              setSections(newSections);
            }}
          />
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 mr-2"
        onClick={addSection}
      >
        Add Section
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
