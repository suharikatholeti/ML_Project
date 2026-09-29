from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load ML model
model = joblib.load("student_model.pkl")

# Load label encoder
label_encoder = joblib.load("label_encoder.pkl")


# --------------------------------------------------
# CONCEPT LEVEL
# --------------------------------------------------

def get_concept_status(level):
    if level <= 2:
        return "Weak"
    elif level == 3:
        return "Medium"
    else:
        return "Strong"


# --------------------------------------------------
# LEARNING RISK
# --------------------------------------------------

def calculate_learning_risk(
    weak_count,
    problems_solved,
    coding_hours,
    projects,
    internships
):

    if weak_count >= 3 and (
        problems_solved < 100 or
        coding_hours < 10
    ):
        return "High"

    if weak_count >= 2 or problems_solved < 100:
        return "Medium"

    return "Low"


# --------------------------------------------------
# PERSONALIZED RECOMMENDATIONS
# --------------------------------------------------

def generate_recommendations(data, weak, medium, strong):

    recommendations = []

    problems = data["problems_solved"]
    coding_hours = data["coding_hours_per_week"]
    projects = data["projects_completed"]
    internships = data["internships_completed"]
    contests = data["contests_participated"]

    # Weak concepts
    if weak:
        recommendations.append(
            f"Strengthen {weak[0]} first because it is currently a weak concept."
        )

    if len(weak) > 1:
        recommendations.append(
            "Practice your other weak concepts regularly before moving to advanced topics."
        )

    # Problems
    if problems < 50:
        recommendations.append(
            "Start consistent coding practice and solve at least 10 beginner problems every week."
        )
    elif problems < 150:
        recommendations.append(
            "Increase your coding practice and gradually include medium-level problems."
        )
    else:
        recommendations.append(
            "Continue solving problems and focus more on medium and hard-level questions."
        )

    # Coding hours
    if coding_hours < 5:
        recommendations.append(
            "Increase your weekly coding time and maintain a consistent daily practice routine."
        )
    elif coding_hours < 10:
        recommendations.append(
            "Try to gradually increase your coding practice to improve consistency."
        )

    # Projects
    if projects == 0:
        recommendations.append(
            "Build at least one practical project to strengthen your resume and apply your programming knowledge."
        )
    elif projects <= 2:
        recommendations.append(
            "Build another practical project and focus on implementing real-world features."
        )
    else:
        recommendations.append(
            "Focus on improving project quality, documentation, optimization and real-world functionality."
        )

    # Internships
    if internships == 0:
        recommendations.append(
            "Start applying for internships to gain practical industry experience."
        )
    elif internships == 1:
        recommendations.append(
            "Use your internship experience and consider gaining additional practical exposure."
        )
    else:
        recommendations.append(
            "Leverage your internship experience by applying those skills to advanced projects."
        )

    # Contests
    if contests == 0:
        recommendations.append(
            "Participate in coding contests to improve problem-solving speed and time management."
        )
    elif contests < 5:
        recommendations.append(
            "Participate in coding contests more regularly to improve speed and confidence."
        )
    else:
        recommendations.append(
            "Continue participating in contests and focus on solving problems under time constraints."
        )

    return recommendations


# --------------------------------------------------
# MAIN API
# --------------------------------------------------

@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        data = request.get_json()

        # ------------------------------------------
        # Read 11 inputs
        # ------------------------------------------

        arrays = int(data["arrays_level"])
        strings = int(data["strings_level"])
        recursion = int(data["recursion_level"])
        trees = int(data["trees_level"])
        graphs = int(data["graphs_level"])
        dp = int(data["dp_level"])

        projects = int(data["projects_completed"])
        internships = int(data["internships_completed"])
        contests = int(data["contests_participated"])
        coding_hours = int(data["coding_hours_per_week"])
        problems = int(data["problems_solved"])

        # ------------------------------------------
        # Create model input
        # ------------------------------------------

        input_data = pd.DataFrame([{
            "arrays_level": arrays,
            "strings_level": strings,
            "recursion_level": recursion,
            "trees_level": trees,
            "graphs_level": graphs,
            "dp_level": dp,
            "projects_completed": projects,
            "internships_completed": internships,
            "contests_participated": contests,
            "coding_hours_per_week": coding_hours,
            "problems_solved": problems
        }])

        # ------------------------------------------
        # ML Prediction
        # ------------------------------------------

        prediction = model.predict(input_data)[0]

        try:
            readiness = label_encoder.inverse_transform([prediction])[0]
        except Exception:
            readiness = str(prediction)

        # ------------------------------------------
        # Concept mastery
        # ------------------------------------------

        concepts = {
            "Arrays": arrays,
            "Strings": strings,
            "Recursion": recursion,
            "Trees": trees,
            "Graphs": graphs,
            "Dynamic Programming": dp
        }

        weak = []
        medium = []
        strong = []

        for concept, level in concepts.items():

            status = get_concept_status(level)

            if status == "Weak":
                weak.append(concept)

            elif status == "Medium":
                medium.append(concept)

            else:
                strong.append(concept)

        # ------------------------------------------
        # Next topic
        # ------------------------------------------

        if medium:
            next_topic = medium[0]
        elif weak:
            next_topic = weak[0]
        else:
            next_topic = "Advanced / Mixed Practice"

        # ------------------------------------------
        # Marks equivalent score
        # ------------------------------------------

        concept_total = (
            arrays +
            strings +
            recursion +
            trees +
            graphs +
            dp
        )

        marks_score = round((concept_total / 30) * 100)

        # ------------------------------------------
        # Learning risk
        # ------------------------------------------

        risk = calculate_learning_risk(
            len(weak),
            problems,
            coding_hours,
            projects,
            internships
        )

        # ------------------------------------------
        # Recommendations
        # ------------------------------------------

        recommendations = generate_recommendations(
            {
                "problems_solved": problems,
                "coding_hours_per_week": coding_hours,
                "projects_completed": projects,
                "internships_completed": internships,
                "contests_participated": contests
            },
            weak,
            medium,
            strong
        )

        # ------------------------------------------
        # Project recommendation
        # ------------------------------------------

        if projects == 0:
            project_recommendation = (
                "Build your first practical project using your strongest concepts."
            )
        elif projects <= 2:
            project_recommendation = (
                "Build another practical project and add real-world functionality."
            )
        else:
            project_recommendation = (
                "Improve your existing projects with better architecture, "
                "documentation and optimization."
            )

        # ------------------------------------------
        # Internship recommendation
        # ------------------------------------------

        if internships == 0:
            internship_recommendation = (
                "Start applying for beginner-friendly internships while "
                "continuing your coding and project practice."
            )
        elif internships == 1:
            internship_recommendation = (
                "Use your existing internship experience and look for "
                "opportunities involving stronger technical responsibilities."
            )
        else:
            internship_recommendation = (
                "Leverage your internship experience when building advanced "
                "projects and preparing for technical interviews."
            )

        # ------------------------------------------
        # Learning insight
        # ------------------------------------------

        if strong:
            strong_text = ", ".join(strong)
            insight = (
                f"You have a good foundation in {strong_text}. "
            )
        else:
            insight = "You are still developing your DSA foundation. "

        if weak:
            weak_text = ", ".join(weak)
            insight += (
                f"However, {weak_text} need more attention. "
            )

        if problems < 100:
            insight += (
                "Your coding practice should also be increased to improve "
                "problem-solving confidence."
            )
        else:
            insight += (
                "Your problem-solving practice is developing well, so you "
                "can gradually focus on more challenging problems."
            )

        # ------------------------------------------
        # Final response
        # ------------------------------------------

        result = {

            "overall_skill_readiness": readiness,

            "marks_equivalent_score": marks_score,

            "learning_risk": risk,

            "concept_mastery": {
                concept: {
                    "level": level,
                    "status": get_concept_status(level)
                }
                for concept, level in concepts.items()
            },

            "weak_concepts": weak,

            "medium_concepts": medium,

            "strong_concepts": strong,

            "next_topic_to_cover": next_topic,

            "learning_insight": insight,

            "recommendations": recommendations,

            "project_recommendation": project_recommendation,

            "internship_recommendation": internship_recommendation
        }

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.route("/")
def home():

    return jsonify({
        "message": "AI Learning Insight System is Running 🚀"
    })


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )