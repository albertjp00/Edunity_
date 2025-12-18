import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./doQuiz.css";
import { getQuiz, submitQuiz } from "../../services/courseServices";

interface IOption {
  text: string;
}

interface IQuestion {
  _id: string;
  question: string;
  options: IOption[];
  correctAnswer: string;
  points: number;
}

interface IQuiz {
  _id: string;
  courseId: string;
  title: string;
  questions: IQuestion[];
}

const DoQuiz: React.FC = () => {
  // const { id } = useParams<{ id: string }>(); // courseId
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const {courseId} = useParams()

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if(!courseId) return
        const res = await getQuiz(courseId)
        if(!res) return
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      if(!courseId) return
      const quizId = quiz._id
      const res = await submitQuiz(courseId , quizId  , answers)
      if(!res) return
      if (res.data.success) {
        if(res.data.success){
          console.log(res);
          
          setScore(res.data.data.score);
        }
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };


  if (!quiz) return <p>Loading quiz...</p>;

  return (
  <div className="quiz-container">
    <h2>{quiz.title}</h2>

    {quiz.questions.map((q, index) => (
      <div key={q._id} className="question-card">
        <h4>
          {index + 1}. {q.question}
        </h4>
        <div className="options">
          {q.options.map((opt, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={q._id}
                value={opt.text}
                checked={answers[q._id] === opt.text}
                onChange={() => handleAnswerChange(q._id, opt.text)}
              />
              {opt.text}
            </label>
          ))}
        </div>
      </div>
    ))}

    <div className="quiz-actions">
      <button onClick={handleSubmit} className="submit-btn">
        Submit Quiz
      </button>
      {/* <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button> */}
    </div>

    {score !== null && (
      <div className="score-card">
        <h3>Your Score: {score}</h3>
      </div>
    )}
  </div>
);
}


export default DoQuiz;

