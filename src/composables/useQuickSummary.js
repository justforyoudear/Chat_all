import bots, { botTags } from "@/bots";
import i18n from "@/i18n";

const SUMMARY_PROMPT_PREFIX = `You are an expert synthesizer. Below are responses from multiple AI models to the same question.
Your task is to produce a single, concise, actionable answer that combines the best insights from all responses.

Rules:
- Integrate the strongest points from each model.
- Resolve contradictions by choosing the most well-reasoned position.
- Be concise and direct — do not mention which model said what.
- Output in Markdown format.
- Write in the same language as the question.

Here is the original question and each model's response:

Question: {prompt}

`;
const SUMMARY_PROMPT_TEMPLATE = `--- {botName} ---
{botResponse}

`;
const SUMMARY_PROMPT_SUFFIX = `Now produce the single best synthesized answer:`;

function getPreferredApiBot() {
  const apiBotList = botTags?.api || [];
  for (const bot of apiBotList) {
    if (bot && !bot.isDisabled() && bot.isAvailable()) {
      return bot;
    }
  }
  return null;
}

function buildSummaryPrompt(prompt, responses) {
  let body = "";
  for (const resp of responses) {
    const botInstance = bots.getBotByClassName(resp.className);
    const botName = botInstance ? botInstance.getFullname() : resp.className;
    const content = resp.content || "";
    body += SUMMARY_PROMPT_TEMPLATE.replace("{botName}", botName).replace(
      "{botResponse}",
      content,
    );
  }
  return (
    SUMMARY_PROMPT_PREFIX.replace("{prompt}", prompt) +
    body +
    SUMMARY_PROMPT_SUFFIX
  );
}

async function summarizeResponses(prompt, responses, onProgress) {
  const bot = getPreferredApiBot();
  if (!bot) {
    throw new Error(i18n.global.t("consensus.noApiBot"));
  }

  const summaryPrompt = buildSummaryPrompt(prompt, responses);
  let rawContent = "";

  const result = await new Promise((resolve) => {
    bot.sendPrompt(
      summaryPrompt,
      (index, values) => {
        if (values.content !== undefined) {
          rawContent = values.content;
          if (onProgress) {
            onProgress(rawContent, false);
          }
        }
        if (values.done) {
          resolve(rawContent);
        }
      },
      "quick-summary",
    );
  });

  return result;
}

export function useQuickSummary() {
  return {
    getPreferredApiBot,
    summarizeResponses,
    buildSummaryPrompt,
  };
}
