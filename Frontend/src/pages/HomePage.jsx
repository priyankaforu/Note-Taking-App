import { React, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/ratelimiterui.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const HomePage = () => {
  const [isRatelimited, setIsRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRatelimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        if (error.response.status === 429) {
          setIsRatelimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRatelimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto mt-6 py-10 px-6">
        {loading && <div>Loading...</div>}
        {notes.length === 0 && !isRatelimited && <NotesNotFound />}
        {notes.length > 0 && !isRatelimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
