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
  const [hasReviewed, setHasReviewed] = useState<boolean>(() => {
    return localStorage.getItem('caffee_food_has_reviewed') === 'true';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim() || hasReviewed) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    onAddReview(newReview);
    localStorage.setItem('caffee_food_has_reviewed', 'true');
    setHasReviewed(true);
    setAuthor('');
    setRating(5);
    setComment('');
  };

  return (
    <section id="reviews-section-block" className="space-y-8">
      <div className="text-center md:text-left border-b border-bistro-sand dark:border-white/10 pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-bistro-dark dark:text-white flex items-center justify-center md:justify-start gap-2">
          ⭐ {DICTIONARY.guestReviews[lang]}
        </h2>
        <p className="text-xs text-bistro-muted dark:text-emerald-200/70 mt-1">
          {lang === 'sr' ? 'Podelite Vaše iskustvo sa nama' : lang === 'sq' ? 'Shpërndani përvojën tuaj me ne' : 'Share your dining experience with us'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Reviews List (Col: 7) */}
        <div className="lg:col-span-7 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-[#142318] border border-bistro-gold/10 dark:border-white/10 p-8 rounded-2xl text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-bistro-gold/40 dark:text-emerald-400/40 mx-auto" />
              <h4 className="font-serif font-bold text-bistro-dark dark:text-white text-base">
                {lang === 'sr' ? 'Još uvek nema recenzija' : lang === 'sq' ? 'Nuk ka ende vlerësime' : 'No reviews yet'}
              </h4>
              <p className="text-xs text-bistro-muted dark:text-gray-300 max-w-sm mx-auto">
                {lang === 'sr'
                  ? 'Budi prvi koji će ostaviti utisak i podeliti svoje iskustvo sa našim jelima!'
                  : lang === 'sq'
                  ? 'Bëhu i pari që lë një vlerësim dhe shpërndan përvojën tënde!'
                  : 'Be the first to leave a review and share your experience with us!'}
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {reviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-[#142318] border border-bistro-gold/10 dark:border-white/10 p-5 rounded-2xl shadow-xs space-y-3"
                >
                  {/* Meta details */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-bistro-dark dark:text-white">{rev.author}</h4>
                        <div className="flex items-center gap-1.5 text-bistro-muted dark:text-emerald-200/60 text-[10px] font-mono mt-0.5">
                          <Calendar className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
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
                            idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment content */}
                  <p className="text-xs sm:text-sm text-bistro-charcoal dark:text-gray-200 leading-relaxed pl-1">
                    "{rev.comment}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right Col: Add Review Form (Col: 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#142318] border border-bistro-gold/15 dark:border-white/10 rounded-2xl p-6 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-bistro-dark dark:text-white mb-4 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            {DICTIONARY.leaveReview[lang]}
          </h3>

          {hasReviewed ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-center space-y-2 py-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-serif font-bold text-base text-emerald-900 dark:text-emerald-100">
                {lang === 'sr' && 'Već ste ostavili recenziju!'}
                {lang === 'sq' && 'Keni lënë tashmë vlerësimin tuaj!'}
                {lang === 'en' && 'You have already submitted a review!'}
              </h4>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed max-w-xs mx-auto">
                {lang === 'sr' && 'Hvala Vam na utisku. Dozvoljeno je ostavljanje samo jedne recenzije po osobi.'}
                {lang === 'sq' && 'Faleminderit për vlerësimin. Lejohet vetëm një vlerësim për person.'}
                {lang === 'en' && 'Thank you for your feedback. Only 1 review per person is allowed.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="review-author-input"
                  className="text-xxs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70 block mb-1.5"
                >
                  👤 {DICTIONARY.reviewName[lang]}
                </label>
                <input
                  id="review-author-input"
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={lang === 'sr' ? 'Unesite Vaše ime...' : lang === 'sq' ? 'Shkruani emrin tuaj...' : 'Enter your name...'}
                  className="w-full text-xs sm:text-sm bg-bistro-cream dark:bg-[#192b1e] border border-bistro-gold/20 dark:border-white/15 focus:border-emerald-600 outline-none p-3 rounded-xl transition-all text-bistro-dark dark:text-white placeholder:text-bistro-muted dark:placeholder:text-emerald-300/50"
                />
              </div>

              {/* Interactive Star Selection */}
              <div>
                <label className="text-xxs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70 block mb-1.5">
                  ⭐ {lang === 'sr' ? 'Ocena' : lang === 'sq' ? 'Vlerësimi' : 'Rating'}
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starValue = idx + 1;
                    const active = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        id={`star-select-${starValue}`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 1.4, rotate: 15 }}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors duration-200 ${
                            active ? 'fill-amber-500 text-amber-500' : 'text-gray-200 dark:text-gray-600'
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="review-comment-textarea"
                  className="text-xxs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70 block mb-1.5"
                >
                  💬 {DICTIONARY.reviewComment[lang]}
                </label>
                <textarea
                  id="review-comment-textarea"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={
                    lang === 'sr'
                      ? 'Podelite Vaše utiske o hrani, usluzi...'
                      : lang === 'sq'
                      ? 'Shpërndani përshtypjet tuaja për ushqimin, shërbimin...'
                      : 'Share your experience on food, service...'
                  }
                  className="w-full text-xs sm:text-sm bg-bistro-cream dark:bg-[#192b1e] border border-bistro-gold/20 dark:border-white/15 focus:border-emerald-600 outline-none p-3 rounded-xl resize-none transition-all text-bistro-dark dark:text-white placeholder:text-bistro-muted dark:placeholder:text-emerald-300/50"
                />
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                id="submit-review-btn"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                {DICTIONARY.submitReview[lang]}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
