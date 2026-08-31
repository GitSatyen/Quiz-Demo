// ============================================================================
// PORTFOLIO DEMO CONFIG
// ============================================================================
// This file intentionally contains NO real company credentials or endpoints.
// The original integration used a CRM/email platform. For this public
// portfolio version, submissions are only logged and no external API is called.

const DEMO_MODE = true;

function onFormSubmit(e) {
  if (!DEMO_MODE) return;

  if (!e || !e.values) {
    Logger.log("Geen demo event data gevonden.");
    return;
  }

  const values = e.values;
  const name = values[1] || "Demo User";
  const email = values[2] || "demo@example.com";
  const result = values[3] || "Onbekend";
  const score = values[4] || "0";

  Logger.log("Portfolio demo submission ontvangen: " +
             JSON.stringify({ name, email, result, score }));
}

// Kept as a small example of how profile tags could be derived.
// No external service is contacted.
function determineTags(result) {
  const tags = ["quiz-software-development"];

  switch (result) {
    case "Builder":
      tags.push("profile-builder");
      break;
    case "Architect":
      tags.push("profile-architect");
      break;
    case "ProblemSolver":
      tags.push("profile-problem-solver");
      break;
    default:
      tags.push("profile-unknown");
  }

  return tags;
}
