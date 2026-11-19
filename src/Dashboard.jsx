import { useEffect, useState } from "react";
import "./Dashboard.css";

import AIAssistant from "./AIAssistant";
import Books from "./Books";
import DashboardLayout from "./DashboardLayout";
import Notes from "./Notes";
import Profile from "./Profile";
import Progress from "./Progress";
import Quiz from "./Quiz";

const defaultProfile = {
  name: "Student",
  email: "student@example.com",
  learningMode: "Student",
  subjects: [],
};

function readStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const [notes, setNotes] = useState(() => readStoredValue("studygenieNotes", []));
  const [quizHistory, setQuizHistory] = useState(() => readStoredValue("quizHistory", []));
  const [profile, setProfile] = useState(() => readStoredValue("studygenieProfile", defaultProfile));

  useEffect(() => {
    const loadDashboardData = () => {
      setNotes(readStoredValue("studygenieNotes", []));
      setQuizHistory(readStoredValue("quizHistory", []));
      setProfile(readStoredValue("studygenieProfile", defaultProfile));
    };

    window.addEventListener("studygenie-update", loadDashboardData);
    window.addEventListener("storage", loadDashboardData);

    return () => {
      window.removeEventListener("studygenie-update", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
    };
  }, []);

  const topicsStudied = notes.length;
  const quizzesCompleted = quizHistory.length;

  const averageScore =
    quizzesCompleted > 0
      ? Math.round(
          quizHistory.reduce(
            (total, quiz) =>
              total + Number(quiz.percentage || 0),
            0
          ) / quizzesCompleted
        )
      : 0;

  const bestScore =
    quizzesCompleted > 0
      ? Math.max(
          ...quizHistory.map((quiz) =>
            Number(quiz.percentage || 0)
          )
        )
      : 0;

  const latestQuiz =
    quizHistory.length > 0
      ? quizHistory[0]
      : null;

  const latestNote =
    notes.length > 0
      ? notes[0]
      : null;

  const navigate = (page) => {
    setActivePage(page);
  };

  const renderPageContent = () => {
    if (activePage === "ai") {
      return <AIAssistant />;
    }

    if (activePage === "notes") {
      return <Notes />;
    }

    if (activePage === "quiz") {
      return <Quiz />;
    }

    if (activePage === "progress") {
      return <Progress />;
    }

    if (activePage === "profile") {
      return (
        <Profile
          onLogout={onLogout}
        />
      );
    }

    if (activePage === "books") {
      return <Books />;
    }

    return (
      <div className="dashboard-content">

        <section className="welcome-section">

          <div>
            <h1>
              Welcome Back, {profile.name}!
            </h1>

            <p>
              Keep learning, keep growing. You can do it! 🚀
            </p>
          </div>

        </section>

        <section className="stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              ▣
            </div>

            <div>
              <h3>{topicsStudied}</h3>
              <p>Notes Created</p>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ▤
            </div>

            <div>
              <h3>{quizzesCompleted}</h3>
              <p>Quizzes Taken</p>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              ▫
            </div>

            <div>
              <h3>
                {profile.subjects?.length || 0}
              </h3>

              <p>Subjects</p>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              ★
            </div>

            <div>
              <h3>{averageScore}%</h3>
              <p>Overall Progress</p>
            </div>

          </div>

        </section>

        <section className="dashboard-grid">

          <div className="activity-card">

            <div className="card-heading">

              <div>
                <h2>Recent Activity</h2>

                <p>
                  Your latest learning activities
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("progress")}
              >
                View All
              </button>

            </div>

            <div className="activity-list">

              {latestNote && (
                <div className="activity-item">

                  <div className="activity-icon green">
                    ▣
                  </div>

                  <div className="activity-info">

                    <strong>
                      Created a new note
                    </strong>

                    <span>
                      {latestNote.title}
                    </span>

                  </div>

                  <small>
                    Recently
                  </small>

                </div>
              )}

              {latestQuiz && (
                <div className="activity-item">

                  <div className="activity-icon blue">
                    ✓
                  </div>

                  <div className="activity-info">

                    <strong>
                      Completed a quiz
                    </strong>

                    <span>
                      {latestQuiz.quizName}
                    </span>

                  </div>

                  <small>
                    {latestQuiz.percentage}%
                  </small>

                </div>
              )}

              {!latestNote && !latestQuiz && (
                <div className="empty-activity">

                  <span>📚</span>

                  <strong>
                    No activity yet
                  </strong>

                  <p>
                    Start studying to see your activity here.
                  </p>

                </div>
              )}

            </div>

          </div>

          <div className="study-progress-card">

            <div className="card-heading">

              <div>
                <h2>Study Progress</h2>

                <p>
                  Your overall performance
                </p>
              </div>

            </div>

            <div className="progress-circle">

              <div className="circle-inner">

                <strong>
                  {averageScore}%
                </strong>

                <span>
                  Progress
                </span>

              </div>

            </div>

            <div className="progress-details">

              <div>

                <span>
                  <i className="dot purple"></i>
                  Notes
                </span>

                <strong>
                  {notes.length}
                </strong>

              </div>

              <div>

                <span>
                  <i className="dot green"></i>
                  Quizzes
                </span>

                <strong>
                  {quizzesCompleted}
                </strong>

              </div>

              <div>

                <span>
                  <i className="dot blue"></i>
                  Best Score
                </span>

                <strong>
                  {bestScore}%
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section className="ai-box">

          <div className="ai-box-icon">
            ✦
          </div>

          <div className="ai-box-text">

            <h3>
              Need help with your studies?
            </h3>

            <p>
              Ask your AI Assistant anything.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("ai")}
          >
            Go to AI Assistant
            <span>→</span>
          </button>

        </section>

      </div>
    );
  };

  const activePageName =
    activePage === "dashboard"
      ? "Dashboard"
      : activePage === "ai"
      ? "AI Assistant"
      : activePage === "notes"
      ? "Notes"
      : activePage === "quiz"
      ? "Quiz"
      : activePage === "progress"
      ? "Progress"
      : activePage === "books"
      ? "Books"
      : activePage === "profile"
      ? "Profile"
      : "Dashboard";

  return (
    <DashboardLayout
      activePage={activePageName}
      onNavigate={(page) => {
        const pageMap = {
          Dashboard: "dashboard",
          "AI Assistant": "ai",
          Notes: "notes",
          Quiz: "quiz",
          Progress: "progress",
          Books: "books",
          Profile: "profile",
        };

        navigate(pageMap[page] || "dashboard");
      }}
      onLogout={onLogout}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}

export default Dashboard;
