import bots, { botTags } from "@/bots";
import i18n from "@/i18n";

const ANALYSIS_PROMPT_PREFIX = `You are an expert analyst. Below are responses from multiple AI models to the same question.
Please carefully compare these responses and identify:

1. **Consensus**: Key points that all or most models agree on.
2. **Differences**: Points where models disagree or take different approaches. For each difference, note which model said what.
3. **Suggestion**: A synthesized recommendation that combines the best insights.

Output your analysis as valid JSON with this exact structure:
{
  "consensus": "A concise summary of points where all models agree",
  "differences": [
    {
      "topic": "The topic of disagreement",
      "details": [
        { "model": "Model name", "position": "What this model said about this topic" }
      ]
    }
  ],
  "suggestion": "A practical, actionable recommendation"
}

Here is the original question and each model's response:

Question: {prompt}

`;
const ANALYSIS_PROMPT_TEMPLATE = `--- {botName} ---
{botResponse}

`;
const ANALYSIS_PROMPT_SUFFIX = `Now provide your analysis as valid JSON only, no markdown formatting, no code fences.`;

function getPreferredApiBot() {
  const apiBotList = botTags?.api || [];
  for (const bot of apiBotList) {
    if (bot && !bot.isDisabled() && bot.isAvailable()) {
      return bot;
    }
  }
  return null;
}

function buildAnalysisPrompt(prompt, responses) {
  let body = "";
  for (const resp of responses) {
    const botInstance = bots.getBotByClassName(resp.className);
    const botName = botInstance ? botInstance.getFullname() : resp.className;
    const content = resp.content || "";
    body += ANALYSIS_PROMPT_TEMPLATE.replace("{botName}", botName).replace(
      "{botResponse}",
      content,
    );
  }
  return (
    ANALYSIS_PROMPT_PREFIX.replace("{prompt}", prompt) +
    body +
    ANALYSIS_PROMPT_SUFFIX
  );
}

function tryParseJSON(text) {
  // strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  // find the first { and last }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function analyzeResponses(prompt, responses, onProgress) {
  const bot = getPreferredApiBot();
  if (!bot) {
    throw new Error(i18n.global.t("consensus.noApiBot"));
  }

  const analysisPrompt = buildAnalysisPrompt(prompt, responses);
  let rawContent = "";

  const result = await new Promise((resolve) => {
    bot.sendPrompt(
      analysisPrompt,
      (index, values) => {
        if (values.content !== undefined) {
          rawContent = values.content;
          if (onProgress) {
            onProgress(rawContent, false);
          }
        }
        if (values.done) {
          const parsed = tryParseJSON(rawContent);
          if (parsed) {
            resolve(parsed);
          } else {
            resolve({
              consensus: rawContent,
              differences: [],
              suggestion: "",
              _raw: true,
            });
          }
        }
      },
      "consensus-analysis",
    );
  });

  return result;
}

export function useConsensusAnalysis() {
  return {
    getPreferredApiBot,
    analyzeResponses,
    buildAnalysisPrompt,
  };
}
