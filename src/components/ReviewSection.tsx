import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, User, Calendar, CheckCircle2 } from 'lucide-react';
import { Review, Language } from '../types';
import { DICTIONARY } from '../data';

interface ReviewSectionProps {
  lang: Language;
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export default function ReviewSection({ lang, reviews, onAddReview }: ReviewSectionProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    onAddReview(newReview);
    setAuthor('');
    setRating(5);
    setComment('');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <section id="reviews-section-block" className="space-y-8">
      <div className="text-center md:text-left border-b border-bistro-sand pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-bistro-dark flex items-center justify-center md:justify-start gap-2">
          ⭐ {DICTIONARY.guestReviews[lang]}
        </h2>
        <p className="text-xs text-bistro-muted mt-1">
          {lang === 'sr' ? 'Podelite Vaše iskustvo sa nama' : 'Share your dining experience with us'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Reviews List (Col: 7) */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence initial={false}>
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-bistro-gold/10 p-5 rounded-2xl shadow-xs space-y-3"
              >
                {/* Meta details */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-bistro-sand flex items-center justify-center font-bold text-sm text-bistro-gold-dark">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-bistro-dark">{rev.author}</h4>
                      <div className="flex items-center gap-1.5 text-bistro-muted text-xxs font-mono mt-0.5">
                        <Calendar className="w-3 h-3 text-bistro-gold" />
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < rev.rating ? 'fill-bistro-gold text-bistro-gold' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment content */}
                <p className="text-xs sm:text-sm text-bistro-charcoal leading-relaxed pl-1">
                  "{rev.comment}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Col: Add Review Form (Col: 5) */}
        <div className="lg:col-span-5 bg-white border border-bistro-gold/15 rounded-2xl p-6 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-bistro-dark mb-4 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-bistro-gold shrink-0" />
            {DICTIONARY.leaveReview[lang]}
          </h3>

          <AnimatePresence>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 bg-green-50 border border-green-200 rounded-xl text-center text-green-800 space-y-2 py-8"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <h4 className="font-serif font-bold text-base">
                  {lang === 'sr' ? 'Hvala Vam na recenziji!' : 'Thank you for your feedback!'}
                </h4>
                <p className="text-xs text-green-700/80">
                  {lang === 'sr' ? 'Vaš utisak je dragocen našem timu.' : 'Your opinion is extremely valuable to our team.'}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="review-author-input"
                    className="text-xxs uppercase tracking-wider font-bold text-bistro-muted block mb-1.5"
                  >
                    👤 {DICTIONARY.reviewName[lang]}
                  </label>
                  <input
                    id="review-author-input"
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder={lang === 'sr' ? 'Unesite Vaše ime...' : 'Enter your name...'}
                    className="w-full text-xs sm:text-sm bg-bistro-cream border border-bistro-gold/20 focus:border-bistro-gold outline-none p-3 rounded-xl transition-all"
                  />
                </div>

                {/* Interactive Star Selection */}
                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-bistro-muted block mb-1.5">
                    ⭐ {lang === 'sr' ? 'Ocena' : 'Rating'}
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = idx + 1;
                      const active = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                      return (
                        <button
                          key={idx}
                          type="button"
                          id={`star-select-${starValue}`}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 focus:outline-none transition-transform active:scale-120 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              active ? 'fill-bistro-gold text-bistro-gold' : 'text-gray-200'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="review-comment-textarea"
                    className="text-xxs uppercase tracking-wider font-bold text-bistro-muted block mb-1.5"
                  >
                    💬 {DICTIONARY.reviewComment[lang]}
                  </label>
                  <textarea
                    id="review-comment-textarea"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder={lang === 'sr' ? 'Podelite Vaše utiske o hrani, usluzi...' : 'Share your experience on food, service...'}
                    className="w-full text-xs sm:text-sm bg-bistro-cream border border-bistro-gold/20 focus:border-bistro-gold outline-none p-3 rounded-xl resize-none transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="submit-review-btn"
                  className="w-full py-3 bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                >
                  {DICTIONARY.submitReview[lang]}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
