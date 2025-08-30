import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Section = {
  heading: string;
  content: string;
  image?: string;
};

type Content = {
  _id: string;
  type: string;
  title: string;
  imageurl: string;
  sections: Section[];
};

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/content/${id}`);
        if (!res.ok) throw new Error("Failed to fetch content");
        const data: Content = await res.json();
        setContent(data);
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, [id]);

  if (!content) return <p>Loading content...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
            <img
              src={content.imageurl}
              className="max-w-full h-auto mt-2 rounded"
            />


      <p className="mb-4 font-semibold">Type: {content.type}</p>

      {content.sections.map((s, i) => (
        <div key={i} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{s.heading}</h2>
          <p className="my-2">{s.content}</p>
          {s.image && (
            <img
              src={s.image}
              alt={s.heading}
              className="max-w-full h-auto mt-2 rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}
