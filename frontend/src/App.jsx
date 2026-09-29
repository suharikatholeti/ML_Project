import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    arrays_level: 0,
    strings_level: 0,
    recursion_level: 0,
    trees_level: 0,
    graphs_level: 0,
    dp_level: 0,
    projects_completed: 0,
    internships_completed: 0,
    contests_participated: 0,
    coding_hours_per_week: 1,
    problems_solved: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const conceptFields = [
    { key: "arrays_level", label: "Arrays" },
    { key: "strings_level", label: "Strings" },
    { key: "recursion_level", label: "Recursion" },
    { key: "trees_level", label: "Trees" },
    { key: "graphs_level", label: "Graphs" },
    { key: "dp_level", label: "Dynamic Programming" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const analyzeSkills = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/analyze",
        formData
      );

      setResult(response.data);
    } catch (err) {
      console.error("Backend error:",err);
       if (err.response) {
    setError(
      `Backend error ${err.response.status}: ${
        err.response.data?.error || JSON.stringify(err.response.data)
      }`
    );
  }
     else {
    setError(
      "Unable to connect to the Flask backend. Please make sure Flask is running on port 5000."
    );
  }
    } finally {
      setLoading(false);
    }
  };

  const getLevelText = (value) => {
    if (value <= 2) return "Weak";
    if (value === 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="app">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">AI-POWERED LEARNING ANALYSIS</div>

          <h1>
            AI Learning
            <span> Insight System</span>
          </h1>

          <p>
            Discover your DSA strengths, identify skill gaps, and get a
            personalized roadmap for your next stage of learning.
          </p>

          <div className="hero-stats">
            <div>
              <strong>11</strong>
              <span>Learning Inputs</span>
            </div>

            <div>
              <strong>6</strong>
              <span>Core Concepts</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Personalized Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* INPUT SECTION */}
      <main className="main-container">

        <form onSubmit={analyzeSkills}>

          {/* DSA CONCEPTS */}
          <section className="card">
            <div className="section-heading">
              <div className="section-number">01</div>

              <div>
                <h2>DSA Concept Mastery</h2>
                <p>
                  Rate your current understanding of each concept from 0 to 5.
                </p>
              </div>
            </div>

            <div className="concept-grid">
              {conceptFields.map((concept) => (
                <div className="input-card" key={concept.key}>

                  <div className="input-header">
                    <label>{concept.label}</label>

                    <span className="level-badge">
                      {getLevelText(formData[concept.key])}
                    </span>
                  </div>

                  <div className="range-value">
                    {formData[concept.key]}
                    <span>/ 5</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="5"
                    name={concept.key}
                    value={formData[concept.key]}
                    onChange={handleChange}
                  />

                  <div className="range-labels">
                    <span>Beginner</span>
                    <span>Advanced</span>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="card">
            <div className="section-heading">
              <div className="section-number">02</div>

              <div>
                <h2>Experience & Practice</h2>
                <p>
                  Tell us about your practical experience and coding activity.
                </p>
              </div>
            </div>

            <div className="stats-grid">

              <div className="number-input">
                <label>Projects Completed</label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  name="projects_completed"
                  value={formData.projects_completed}
                  onChange={handleChange}
                />

                <small>0 – 10 projects</small>
              </div>

              <div className="number-input">
                <label>Internships Completed</label>

                <input
                  type="number"
                  min="0"
                  max="5"
                  name="internships_completed"
                  value={formData.internships_completed}
                  onChange={handleChange}
                />

                <small>0 – 5 internships</small>
              </div>

              <div className="number-input">
                <label>Contests Participated</label>

                <input
                  type="number"
                  min="0"
                  max="20"
                  name="contests_participated"
                  value={formData.contests_participated}
                  onChange={handleChange}
                />

                <small>0 – 20 contests</small>
              </div>

              <div className="number-input">
                <label>Coding Hours / Week</label>

                <input
                  type="number"
                  min="1"
                  max="30"
                  name="coding_hours_per_week"
                  value={formData.coding_hours_per_week}
                  onChange={handleChange}
                />

                <small>1 – 30 hours</small>
              </div>

              <div className="number-input">
                <label>Problems Solved</label>

                <input
                  type="number"
                  min="0"
                  max="500"
                  name="problems_solved"
                  value={formData.problems_solved}
                  onChange={handleChange}
                />

                <small>0 – 500 problems</small>
              </div>

            </div>
          </section>

          {/* BUTTON */}
          <div className="analyze-area">

            <button
              type="submit"
              className="analyze-button"
              disabled={loading}
            >
              {loading ? "Analyzing Your Skills..." : "Check My Skills →"}
            </button>

            <p>
              Your information is analyzed by the AI learning model to
              generate a personalized report.
            </p>

          </div>

        </form>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <section className="results">

            <div className="result-title">
              <div className="badge">YOUR PERSONALIZED REPORT</div>

              <h2>Learning Analysis</h2>

              <p>
                Here is your personalized learning insight based on your
                current skills and experience.
              </p>
            </div>

            {/* TOP SCORE CARDS */}
            <div className="score-grid">

              <div className="score-card primary">
                <span>Marks Equivalent</span>

                <strong>
                  {result.marks_equivalent_score ?? result.skill_score ?? 0}
                </strong>

                <small>/ 100</small>
              </div>

              <div className="score-card">
                <span>Skill Readiness</span>

                <strong className="readiness">
                  {result.overall_skill_readiness ||
                    result.readiness ||
                    "Analyzed"}
                </strong>
              </div>

              <div className="score-card">
                <span>Learning Risk</span>

                <strong>
                  {result.learning_risk || result.risk || "Analyzed"}
                </strong>
              </div>

            </div>

            {/* INSIGHT */}
            <div className="report-card insight-card">

              <div className="report-icon">✦</div>

              <div>
                <h3>Learning Insight</h3>

                <p>
                  {result.learning_insight ||
                    result.insight ||
                    "Your personalized learning insight is ready."}
                </p>
              </div>

            </div>

            {/* CONCEPT MASTERY */}
            <div className="report-card">

              <div className="report-header">
                <div>
                  <h3>Concept Mastery</h3>
                  <p>Your current DSA concept distribution.</p>
                </div>
              </div>

              <div className="mastery-grid">

                <div className="mastery-box weak">
                  <span>WEAK</span>

                  <strong>
                    {result.weak_concepts?.length || 0}
                  </strong>

                  <p>
                    {result.weak_concepts?.length
                      ? result.weak_concepts.join(", ")
                      : "No weak concepts"}
                  </p>
                </div>

                <div className="mastery-box medium">
                  <span>MEDIUM</span>

                  <strong>
                    {result.medium_concepts?.length || 0}
                  </strong>

                  <p>
                    {result.medium_concepts?.length
                      ? result.medium_concepts.join(", ")
                      : "No medium concepts"}
                  </p>
                </div>

                <div className="mastery-box strong">
                  <span>STRONG</span>

                  <strong>
                    {result.strong_concepts?.length || 0}
                  </strong>

                  <p>
                    {result.strong_concepts?.length
                      ? result.strong_concepts.join(", ")
                      : "No strong concepts"}
                  </p>
                </div>

              </div>

            </div>

            {/* NEXT TOPIC */}
            <div className="recommendation-grid">

              <div className="recommendation-card next-topic">

                <div className="recommendation-icon">→</div>

                <div>
                  <span>NEXT TOPIC TO COVER</span>

                  <h3>
                    {result.next_topic_to_cover ||
                      "Continue practicing DSA"}
                  </h3>

                  <p>
                    Focus on this topic next to improve your overall
                    problem-solving ability.
                  </p>
                </div>

              </div>

              <div className="recommendation-card">

                <div className="recommendation-icon">◈</div>

                <div>
                  <span>CODING PRACTICE</span>

                  <h3>
                    {result.coding_recommendation ||
                      "Maintain consistent coding practice"}
                  </h3>

                  <p>
                    {result.coding_recommendation_detail ||
                      "Practice regularly and gradually increase problem difficulty."}
                  </p>
                </div>

              </div>

            </div>

            {/* PROJECT + INTERNSHIP */}
            <div className="recommendation-grid">

              <div className="recommendation-card">

                <div className="recommendation-icon">⌘</div>

                <div>
                  <span>PROJECT EXPERIENCE</span>

                  <h3>
                    {result.project_recommendation ||
                      "Build practical projects"}
                  </h3>

                  <p>
                    Use projects to apply your DSA and development knowledge
                    to real-world problems.
                  </p>
                </div>

              </div>

              <div className="recommendation-card">

                <div className="recommendation-icon">◎</div>

                <div>
                  <span>INTERNSHIP EXPERIENCE</span>

                  <h3>
                    {result.internship_recommendation ||
                      "Look for practical internship opportunities"}
                  </h3>

                  <p>
                    Practical experience can help you understand how technical
                    skills are applied in real development environments.
                  </p>
                </div>

              </div>

            </div>

            {/* ACTIVITY SUMMARY */}
            <div className="report-card">

              <div className="report-header">
                <div>
                  <h3>Your Activity Snapshot</h3>
                  <p>The information you provided for this analysis.</p>
                </div>
              </div>

              <div className="activity-grid">

                <div>
                  <span>Projects</span>
                  <strong>{formData.projects_completed}</strong>
                </div>

                <div>
                  <span>Internships</span>
                  <strong>{formData.internships_completed}</strong>
                </div>

                <div>
                  <span>Contests</span>
                  <strong>{formData.contests_participated}</strong>
                </div>

                <div>
                  <span>Coding / Week</span>
                  <strong>{formData.coding_hours_per_week}h</strong>
                </div>

                <div>
                  <span>Problems</span>
                  <strong>{formData.problems_solved}</strong>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      <footer>
        <p>AI Learning Insight System • Personalized Learning Analytics</p>
      </footer>

    </div>
  );
}

export default App;