import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BookDetails = () => {
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [covers, setCovers] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const bookResponse = await fetch(
          "https://openlibrary.org/works/OL45804W.json"
        );
        if (!bookResponse.ok) throw new Error("Failed to fetch book data");
        const bookResult = await bookResponse.json();

        if (!isMounted) return;
        setBookData(bookResult);

        if (bookResult.covers && bookResult.covers.length > 0) {
          const coverUrls = bookResult.covers.map(
            (coverId) => `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          );
          if (isMounted) setCovers(coverUrls);
        }

        if (bookResult.authors) {
          const authorResults = await Promise.all(
            bookResult.authors.map(async (author) => {
              const authorKey = author.author.key;
              const authorRes = await fetch(
                `https://openlibrary.org${authorKey}.json`
              );
              if (!authorRes.ok) throw new Error("Failed to fetch author data");
              return authorRes.json();
            })
          );
          if (isMounted) setAuthors(authorResults);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mt-10"
      />
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 p-4 bg-red-100 rounded-lg mx-auto mt-10 max-w-md"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!bookData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-500 text-center mt-10"
      >
        No book data available
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Book covers */}
      {covers.length > 0 && (
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {covers.map((cover, index) => (
            <img
              key={index}
              src={cover}
              alt={`Book cover ${index + 1}`}
              className="w-48 h-72 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      )}

      {/* Book title */}
      <h1 className="text-3xl font-bold mb-6">{bookData.title}</h1>

      {/* Authors */}
      {authors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Authors:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((author, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">{author.name}</h3>
                {author.birth_date && (
                  <p className="text-sm text-gray-600">
                    Born: {author.birth_date}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Description:</h2>
        <p className="text-gray-700">
          {bookData.description
            ? typeof bookData.description === "object"
              ? bookData.description.value
              : bookData.description
            : "No description available"}
        </p>
      </div>

      {/* Additional details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <strong>First Published:</strong>
          <p>{bookData.first_publish_date || "Unknown"}</p>
        </div>
        {bookData.subjects && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <strong>Subjects:</strong>
            <p>{bookData.subjects.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
