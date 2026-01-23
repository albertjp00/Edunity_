import React, { useState } from "react";
import "./addQuiz.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { addQuiz } from "../../services/instructorServices";

interface QuestionForm {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // must be one of the options
  points: number;
}

interface AddQuizProps {
  courseId?: string;
  onSuccess?: () => void;
}

const emptyQuestion = (): QuestionForm => ({
  id: Math.random().toString(36).slice(2, 9),
  question: "",
  options: ["", "", "", ""], // always 4 options
  correctAnswer: "",
  points: 1,
});

const AddQuiz: React.FC<AddQuizProps> = ({
  courseId: initialCourseId = "",
  onSuccess,
}) => {
  const [courseId] = useState<string>(initialCourseId);
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    emptyQuestion(),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const navigate = useNavigate()

  function updateQuestion(id: string, patch: Partial<QuestionForm>) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateOption(qId: string, index: number, value: string) {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;
    const newOpts = q.options.slice();
    newOpts[index] = value;
    updateQuestion(qId, { options: newOpts });
  }

  function validate(): string | null {

    for (const [i, q] of questions.entries()) {
      if (!q.question.trim()) return `Question ${i + 1} is empty.`;
      if (q.options.some((o) => !o.trim()))
        return `Please fill all 4 options for question ${i + 1}.`;
      if (!q.correctAnswer.trim())
        return `Please select the correct answer for question ${i + 1}.`;
    }
    return null;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setMessage(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // ✅ Fixed payload shape
    const payload = {
      courseId: courseId.trim(),
      title: title.trim(),
      questions: questions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((o) => ({ text: o.trim() })), // ✅ match schema
        correctAnswer: q.correctAnswer.trim(),
        points: Number(q.points) || 1,
      })),
    };

    try {
      setSubmitting(true);
      if(!id) return
      const res = await addQuiz(id , payload)
      if (res?.data?.success) {
        toast.success("Quiz Added")
        navigate(-1)
        setMessage("Quiz created successfully.");
        setQuestions([emptyQuestion()]);
        setTitle("");
        if (onSuccess) onSuccess();
      } else {
        setError(res?.data?.message || "Failed to create quiz.");
      }
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(
          err?.response?.data?.message || "Server error while creating quiz."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="quiz-page">
  <div className="quiz-header">
    <h2>Create Quiz</h2>
    <p>Add questions, options, and correct answers</p>
  </div>

  <form className="quiz-form" onSubmit={handleSubmit}>
    {/* Quiz Title */}
    <div className="card">
      <label className="label">
        Quiz Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Enter quiz title"
        />
      </label>
    </div>

    {/* Questions */}
    {questions.map((q, idx) => (
      <div key={q.id} className="card question-card">
        <div className="question-header">
          <h3>Question {idx + 1}</h3>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => removeQuestion(q.id)}
            disabled={questions.length === 1}
          >
            ✕
          </button>
        </div>

        {/* Question Text */}
        <label className="label">
          Question
          <textarea
            value={q.question}
            onChange={(e) =>
              updateQuestion(q.id, { question: e.target.value })
            }
            className="textarea"
            placeholder="Type your question here..."
          />
        </label>

        {/* Options */}
        <div className="options-box">
          <p className="section-title">Options</p>

          {q.options.map((opt, i) => (
            <div key={i} className="option-row">
              <input
                type="text"
                value={opt}
                onChange={(e) =>
                  updateOption(q.id, i, e.target.value)
                }
                className="input option-input"
                placeholder={`Option ${i + 1}`}
              />

              <label className="radio-label">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctAnswer === opt}
                  onChange={() =>
                    updateQuestion(q.id, { correctAnswer: opt })
                  }
                />
                Correct
              </label>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="question-footer">
          <label className="label small">
            Points
            <input
              type="number"
              min={1}
              value={q.points}
              onChange={(e) =>
                updateQuestion(q.id, { points: Number(e.target.value) })
              }
              className="input points-input"
            />
          </label>
        </div>
      </div>
    ))}

    {/* Actions */}
    <div className="sticky-actions">
      <button
        type="button"
        className="secondary-btn"
        onClick={addQuestion}
      >
        + Add Question
      </button>

{error && <div className="error">{error}</div>}
      <button
        type="submit"
        className="primary-btn"
        disabled={submitting}
      >
        {submitting ? "Creating..." : "Create Quiz"}
      </button>
    </div>

    {message && <div className="success">{message}</div>}
    
  </form>
</div>

  );
};

export default AddQuiz;
