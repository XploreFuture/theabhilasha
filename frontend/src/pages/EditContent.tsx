import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { isAuthenticated, decodeAccessToken } from "../utils/auth";

type Section = {
  heading: string;
  content: string;
  image?: string;
};

type Content = {
  _id: string;
  type: string;
  title: string;
  sections: Section[];
};

export default function EditContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Access denied. Please login as admin.");
      navigate("/login");
      return;
    }

    const decoded = decodeAccessToken();
    if (decoded?.role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/");
      return;
    }

    const fetchContent = async () => {
      const result = await fetchWithAuth<Content>(`/api/content/${id}`, { method: "GET" });
      if (result) setContent(result);
    };

    fetchContent();
  }, [id, navigate]);

  const handleAddSection = () => {
    if (!content) return;
    setContent({
      ...content,
      sections: [...content.sections, { heading: "", content: "", image: "" }],
    });
  };

  const handleChangeSection = (index: number, field: keyof Section, value: string) => {
    if (!content) return;
    const updatedSections = [...content.sections];
    updatedSections[index][field] = value;
    setContent({ ...content, sections: updatedSections });
  };

  const handleSubmit = async () => {
    if (!content) return;
    setLoading(true);
    const result = await fetchWithAuth(`/api/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: content.title, type: content.type, sections: content.sections }),
    });
    setLoading(false);

    if (result) {
      alert("Content updated successfully!");
      navigate(`/content/${id}`);
    }
  };

  if (!content) return <p>Loading content...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Content</h1>

      <input
        className="border p-2 mb-2 w-full"
        value={content.title}
        onChange={(e) => setContent({ ...content, title: e.target.value })}
        placeholder="Title"
      />

      <select
        className="border p-2 mb-2 w-full"
        value={content.type}
        onChange={(e) => setContent({ ...content, type: e.target.value })}
      >
        <option value="">Select Type</option>
        <option value="shayari">Shayari</option>
        <option value="poem">Poem</option>
        <option value="story">Story</option>
        <option value="article">Article</option>
      </select>

      {content.sections.map((s, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 mb-1 w-full"
            value={s.heading}
            onChange={(e) => handleChangeSection(i, "heading", e.target.value)}
            placeholder="Heading"
          />
          <textarea
            className="border p-1 mb-1 w-full"
            value={s.content}
            onChange={(e) => handleChangeSection(i, "content", e.target.value)}
            placeholder="Content"
          />
          <input
            className="border p-1 mb-1 w-full"
            value={s.image || ""}
            onChange={(e) => handleChangeSection(i, "image", e.target.value)}
            placeholder="Image URL"
          />
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 mr-2"
        onClick={handleAddSection}
      >
        Add Section
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Content"}
      </button>
    </div>
  );
}
