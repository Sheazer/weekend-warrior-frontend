import React, { useState } from "react";
import { createActivityReview } from "../api/activities";

function ReviewModal({ activityId, activityTitle, onClose, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createActivityReview(activityId, rating, comment);
      alert("🎉 Отзыв успешно отправлен! Спасибо.");
      if (onReviewSuccess) onReviewSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Оценить организатора</h3>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        
        <p style={styles.subtitle}>Событие: <strong>{activityTitle}</strong></p>

        {error && <div style={styles.errorBlock}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Рейтинг Звезд */}
          <div style={styles.ratingGroup}>
            <label style={styles.label}>Ваша оценка:</label>
            <div style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    ...styles.star,
                    color: star <= rating ? "#f59e0b" : "rgba(255,255,255,0.2)"
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Комментарий */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Отзыв:</label>
            <textarea
              required
              rows="4"
              placeholder="Расскажите, как прошло событие, всё ли было вовремя и хорошо организовано..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <button type="submit" disabled={submitting} style={styles.submitBtn}>
            {submitting ? "Отправка..." : "Оставить отзыв"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16
  },
  modal: {
    background: "#18181b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    width: "100%",
    maxWidth: 420,
    padding: 24,
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    boxSizing: "border-box"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.4)",
    fontSize: 24,
    cursor: "pointer",
    lineHeight: "1"
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 20px 0"
  },
  errorBlock: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#f87171",
    padding: 12,
    borderRadius: 12,
    fontSize: 13,
    marginBottom: 16
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  ratingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  starsRow: {
    display: "flex",
    gap: 6
  },
  star: {
    fontSize: 32,
    cursor: "pointer",
    transition: "color 0.1s ease",
    userSelect: "none"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)"
  },
  textarea: {
    padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    resize: "none",
    fontFamily: "inherit"
  },
  submitBtn: {
    background: "linear-gradient(135deg, #4f46e5, #9333c0)",
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(147,51,192,0.3)"
  }
};  

export default ReviewModal;