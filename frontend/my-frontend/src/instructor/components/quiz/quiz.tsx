import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./quiz.css";
import instructorApi from "../../../api/instructorApi";
import { toast } from "react-toastify";
import axios from "axios";

interface Option {
  text: string;
}

interface Question {
  _id?: string; // make optional since new questions won't have one yet
  question: string;
  options: Option[];
  correctAnswer: string;
  points: number;
}

interface QuizData {
  _id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

const Quiz: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log('get quiz');
  

  const fetchQuiz = async () => {
    try {
      const res = await instructorApi.get(`/instructor/quiz/${courseId}`);
      if (res.data.success) {
        setQuiz(res.data.quiz);
      } else {
        setError(res.data.message || "Failed to load quiz");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || "Server error while fetching quiz");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleUpdate = (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    qIndex?: number,
    optIndex?: number
  ) => {
    if (!quiz) return;
    const updated = { ...quiz };

    if (field === "title") {
      updated.title = value;
    } else if (qIndex !== undefined) {
      if (field === "question") {
        updated.questions[qIndex].question = value;
      } else if (field === "points") {
        updated.questions[qIndex].points = Number(value);
      } else if (field === "correctAnswer") {
        updated.questions[qIndex].correctAnswer = value;
      } else if (field === "option" && optIndex !== undefined) {
        updated.questions[qIndex].options[optIndex].text = value;
      }
    }

    setQuiz(updated);
  };

  const addQuestion = () => {
    if (!quiz) return;

    const newQuestion: Question = {
      
      question: "",
      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      correctAnswer: "",
      points: 1,
    };

    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const validateQuiz = (quiz: QuizData): string | null => {
    if (!quiz.title.trim()) return "Quiz title is required.";

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.question.trim()) return `Question ${i + 1} is required.`;
      if (q.points <= 0) return `Question ${i + 1} must have at least 1 point.`;

      if (q.options.length !== 4)
        return `Question ${i + 1} must have exactly 4 options.`;

      for (let j = 0; j < 4; j++) {
        if (!q.options[j].text.trim())
          return `Option ${j + 1} in Question ${i + 1} cannot be empty.`;
      }

      if (!q.correctAnswer.trim())
        return `Correct answer is required for Question ${i + 1}.`;

      const validAnswer = q.options.some((opt) => opt.text === q.correctAnswer);
      if (!validAnswer)
        return `Correct answer for Question ${i + 1} must match one of the options.`;
    }

    return null; // ✅ No errors
  };

  const saveQuiz = async () => {
    if (!quiz) return;

    const validationError = validateQuiz(quiz);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const quizId = quiz._id;
      const res = await instructorApi.put(`/instructor/quiz/${quizId}`, quiz);
      if (res.data.success) {
        toast.success("Quiz updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Failed to update quiz");
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
      toast.error("Server error while updating quiz");
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!quiz) return <p>No quiz found</p>;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        {isEditing ? (
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => handleUpdate("title", e.target.value)}
          />
        ) : (
          <h2>{quiz.title}</h2>
        )}

        <button onClick={() => (isEditing ? saveQuiz() : setIsEditing(true))}>
          {isEditing ? "Save" : "Edit Quiz"}
        </button>
      </div>

      <div className="questions">
        {quiz.questions.map((q, idx) => (
          <div key={q._id} className="question-card">
            {isEditing ? (
              <>
                {/* Question input */}
                <input
                  type="text"
                  value={q.question}
                  placeholder={`Question ${idx + 1}`}
                  onChange={(e) => handleUpdate("question", e.target.value, idx)}
                />

                {/* Points input */}
                <input
                  type="number"
                  value={q.points}
                  onChange={(e) => handleUpdate("points", e.target.value, idx)}
                />

                {/* Options (Always 4) */}
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <input
                        type="text"
                        value={opt.text}
                        placeholder={`Option ${i + 1}`}
                        onChange={(e) =>
                          handleUpdate("option", e.target.value, idx, i)
                        }
                      />
                    </li>
                  ))}
                </ul>

                {/* Correct Answer (required) */}
                <div>
                  <label>Correct Answer: </label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleUpdate("correctAnswer", e.target.value, idx)
                    }
                    required
                  >
                    <option value="" disabled>
                      -- Select Correct Answer --
                    </option>
                    {q.options.map((opt, i) => (
                      <option key={i} value={opt.text}>
                        {opt.text}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <h4>{q.question}</h4>
                <p>Points: {q.points}</p>
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <label>
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          value={opt.text}
                          disabled
                          checked={q.correctAnswer === opt.text}
                        />
                        {opt.text}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>


      {isEditing && (
        <button onClick={addQuestion} className="add-question-btn">
          ➕ Add Question
        </button>
      )}
    </div>
  );
};

export default Quiz;
