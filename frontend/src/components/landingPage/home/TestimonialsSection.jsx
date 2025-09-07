import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "@/services/api";

const Star = ({ on }) => (
  <FaStar className={on ? "text-yellow-400" : "text-gray-300"} />
);

export default function TestimonialsSection() {
  const navigate = useNavigate();

  // current user (for admin check)
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ avg: 0, count: 0 });
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);
  //....
  const DRAFT_KEY = "review:draft";
  const REDIRECT_PATH = "/?postReview=1"; // login ke baad yahin bhejna hai
  //..
  const load = async () => {
    try {
      const d = await api.get(`/reviews/public?limit=8`);
      setItems(d.items || []);
      setStats(d.stats || { avg: 0, count: 0 });
    } catch {
      setItems([]);
      setStats({ avg: 0, count: 0 });
    }
  };

  useEffect(() => {
    load();
  }, []);
  //..
  // auto-submit draft after login redirect (?postReview=1)
  useEffect(() => {
    const url = new URL(window.location.href);
    const shouldPost = url.searchParams.get("postReview") === "1";
    if (!shouldPost) return;

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return; // koi draft nahi

    if (user?.role === "admin") {
      // safety: admin ko post nahi karne dena
      localStorage.removeItem(DRAFT_KEY);
      url.searchParams.delete("postReview");
      window.history.replaceState({}, "", url.toString());
      alert("Admins cannot post reviews. Please use a patient/doctor account.");
      return;
    }

    const draft = JSON.parse(raw);
    (async () => {
      setSaving(true);
      try {
        await api.post(`/reviews`, draft); //  cookies auto-attached

        alert(
          "Thanks! Your review has been submitted. It will appear after admin approval."
        );
        setShowForm(false);
        setText("");
        setCity("");
        setRating(5);
        load();
      } catch (e) {
        console.error("auto review submit failed:", e);
        if (String(e?.message || "").includes("401")) {
          // still not logged in; keep draft and bounce to login
          alert("Please login to submit your review.");
          try {
            navigate(`/login?redirect=${encodeURIComponent(REDIRECT_PATH)}`);
          } catch {}
        } else {
          alert(e?.message || "Could not submit review.");
        }
      } finally {
        setSaving(false);
        if (!String(e?.message || "").includes("401")) {
          localStorage.removeItem(DRAFT_KEY);
        }
        url.searchParams.delete("postReview");
        window.history.replaceState({}, "", url.toString());
      }
    })();
  }, [user?._id]); //user set hone per
  //..
  const submit = async () => {
    //  front-end guard too (backend already blocks admins)
    if (isAdmin) {
      alert("Admins cannot post reviews");
      return;
    }
    if (!text.trim()) return alert("Please write your experience.");
    // Pre-login guard: pehle login, baad me auto-submit
    if (!user?._id) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ rating, text, city }));
      alert("Please login to submit your review.");
      try {
        navigate(`/login?redirect=${encodeURIComponent(REDIRECT_PATH)}`);
      } catch {}
      return;
    }
    setSaving(true);
    try {
      await api.post(`/reviews`, { rating, text, city });

      setText("");
      setCity("");
      setRating(5);
      setShowForm(false);
      alert("Thanks! Your review will appear after approval.");
      load();
    } catch (e) {
      console.error("review submit failed:", e);
      if (String(e?.message || "").includes("401")) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ rating, text, city }));
        alert("Please login to submit your review.");
        try {
          navigate(`/login?redirect=${encodeURIComponent(REDIRECT_PATH)}`);
        } catch {}
      } else {
        alert(e?.message || "Could not submit review.");
      }
    } finally {
      setSaving(false);
    }
  };

  // slider helpers
  const scrollerRef = React.useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    updateArrows();
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByCard = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // ek card + gap jitna scroll
    const firstCard = el.querySelector("[data-card]");
    const step =
      (firstCard?.getBoundingClientRect().width || el.clientWidth * 0.9) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      className="py-16 px-4 sm:px-8 lg:px-20 relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #e0f7fa, #ffffff)" }}
    >
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">What Our Users Say</h2>
        <p className="text-gray-600 mt-2">
          Real stories from people who trusted TeleCare.
        </p>
        <div className="text-sm text-gray-600 mt-2">
          ⭐ {Number(stats.avg || 0).toFixed(1)} average • {stats.count || 0}{" "}
          reviews
        </div>
      </div>

      {/* Black container */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black z-0 rounded-3xl" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* LEFT arrow */}
          {canLeft && (
            <button
              onClick={() => scrollByCard(-1)}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow items-center justify-center hover:scale-105"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-gray-700" />
            </button>
          )}

          {/* RIGHT arrow */}
          {canRight && (
            <button
              onClick={() => scrollByCard(1)}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow items-center justify-center hover:scale-105"
              aria-label="Next"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          )}

          {/* Reviews slider */}
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: "none" }} /* Firefox */
            onScroll={updateArrows}
          >
            {(items.length ? items : []).map((r, idx) => (
              <motion.div
                data-card
                key={r._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="
          min-w-[260px] sm:min-w-[300px] md:min-w-[360px] lg:min-w-[380px]
          snap-start bg-white rounded-xl p-6 text-center shadow
          hover:shadow-lg transition
        "
              >
                <div className="flex justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} on={i <= (r.rating || 0)} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">“{r.text}”</p>
                <h4 className="font-bold text-gray-800">{r.name}</h4>
                <p className="text-sm text-gray-500">
                  {r.city || ""} • {r.role}
                </p>
              </motion.div>
            ))}

            {!items.length && (
              <div className="min-w-full text-center text-gray-500 py-8">
                No reviews yet. Be the first to share your experience.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Button + simple form */}
      <div className="flex flex-col items-center mt-8 gap-4">
        {!showForm ? (
          <button
            onClick={() => {
              if (isAdmin) return alert("Admins cannot post reviews");
              setShowForm(true);
            }}
            disabled={isAdmin}
            title={isAdmin ? "Admins cannot post reviews" : ""}
            className={`px-6 py-2 rounded-full shadow-lg text-white ${
              isAdmin
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Share your experience
          </button>
        ) : (
          <div className="w-full max-w-xl bg-white rounded-2xl p-4 shadow border">
            <div className="mb-2 font-semibold">Your review</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={
                        i <= rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (optional)"
                className="border rounded px-2 py-1 ml-auto"
              />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a short line about your experience..."
              className="w-full border rounded px-3 py-2 h-20 mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-2 rounded bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="px-4 py-2 rounded bg-emerald-600 text-white"
              >
                {saving ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
