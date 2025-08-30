import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

export default function ContentList() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
const res = await fetch("http://localhost:5000/api/content");
        if (!res.ok) throw new Error("Failed to fetch content");
        const data: Content[] = await res.json();
        setContents(data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) return <p className="p-4 text-center">Loading contents...</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Contents</h1>

      {contents.length === 0 && <p>No content available.</p>}

      <ul className="space-y-4">
        {contents.map((content) => (
          <li
            key={content._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <Link to={`/content/${content._id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {content.title}
              </h2>
            </Link>
            <p className="text-gray-600 mt-1">Type: {content.type}</p>
            <p className="text-gray-800 mt-2 line-clamp-3">
              {content.sections.length > 0
                ? content.sections[0].content
                : "No sections available."}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
