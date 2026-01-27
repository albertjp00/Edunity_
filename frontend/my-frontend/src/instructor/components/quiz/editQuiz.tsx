import React, { useEffect, useState } from "react";
import "./editQuiz.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getQuiz,
  quizSave,

} from "../../services/instructorServices";


interface QuestionForm {
  _id? : string;
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  error?: string;
}



const emptyQuestion = (): QuestionForm => ({
  id: Math.random().toString(36).slice(2, 9),
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 1,
});




const EditQuiz: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);



  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        const res = await getQuiz(id);

        console.log('quiz', res);

        if (!res) return
        const quiz = res.data.quiz;

        setTitle(quiz.title);

        setQuestions(
          quiz.questions.map((q) => ({
            id: q._id!,
            question: q.question,
            options: q.options.map((o) => o.text),
            correctAnswer: q.correctAnswer,
            points: q.points,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load quiz");
      }
    };

    fetchQuiz();
  }, [id]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);

    if (!value.trim()) {
      setTitleError("Quiz title is required");
    } else {
      setTitleError(null);
    }
  }



  function updateQuestion(id: string, patch: Partial<QuestionForm>) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const updated = { ...q, ...patch };

        if (!updated.question.trim()) {
          updated.error = "Question cannot be empty";
        } else {
          updated.error = undefined;
        }

        return updated;
      })
    );
  }


  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(id: string) {

    console.log('remove ', id);

    setQuestions((prev) => {
      if (prev.length === 1) {
        setError("Quiz must contain at least one question");
        return prev;
      }
      return prev.filter((q) => q.id !== id);
    });
  }



  function updateOption(qId: string, index: number, value: string) {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;
    const newOpts = [...q.options];
    newOpts[index] = value;
    updateQuestion(qId, { options: newOpts });
  }

  function validate(): string | null {
    if (!title.trim()) {
      return 'Please enter a title'
    }
    for (const [i, q] of questions.entries()) {
      if (!q.question.trim()) return `Question ${i + 1} is empty.`;
      if (q.options.some((o) => !o.trim()))
        return `Fill all options for question ${i + 1}.`;
      if (!q.correctAnswer)
        return `Select correct answer for question ${i + 1}.`;
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const payload = {
      title: title.trim(),
      questions: questions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((o) => ({ text: o.trim() })),
        correctAnswer: q.correctAnswer,
        points: q.points,
      })),
    };

    try {
      setSubmitting(true);

      if (!id) return;
      const res = await quizSave(id, payload);
      if (!res) return
      if (res.data.success) {
        toast.success("Quiz updated successfully");
        navigate(-1);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Update failed");
      }
    } finally {
      setSubmitting(false);
    }
  }


  return (

    <div className="quiz-editor">
      <div className="editor-header">
        <h2>Edit Quiz</h2>
        <p>Update questions, answers, and quiz details</p>
      </div>

      <form className="quiz-form" onSubmit={handleSubmit}>
        <div className="card">
          <label className="label">
            Quiz Title
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="input"
              placeholder="Quiz title"
            />
            {titleError && <span className="error-text">{titleError}</span>}
          </label>
        </div>

        {questions.map((q, idx) => (
          <div key={q.id} className="card question-card">
            <div className="question-header">
              <h3>Question {idx + 1}</h3>

              <button
                type="button"
                className="icon-btn danger"
                onClick={() => removeQuestion(q.id)}
                disabled={questions.length === 1}
                title="Remove question"
              >
                ✕
              </button>
            </div>

            {/* Question text */}
            <label className="label">
              Question
              <textarea
                value={q.question}
                onChange={(e) =>
                  updateQuestion(q.id, { question: e.target.value })
                }
                className="textarea"
                placeholder="Edit question..."
              />
            </label>

            {/* Options */}
            <div className="options-box">
              <p className="section-title">Options</p>

              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`option-row ${q.correctAnswer === opt ? "correct" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctAnswer === opt}
                    onChange={() =>
                      updateQuestion(q.id, { correctAnswer: opt })
                    }
                  />

                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      updateOption(q.id, i, e.target.value)
                    }
                    className="input option-input"
                    placeholder={`Option ${i + 1}`}
                  />

                  {q.correctAnswer === opt && (
                    <span className="correct-badge">Correct</span>
                  )}
                </label>
              ))}
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
            {submitting ? "Updating..." : "Update Quiz"}
          </button>
        </div>


      </form>
    </div>

  );
};

export default EditQuiz;
