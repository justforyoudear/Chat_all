import bots, { botTags } from "@/bots";
import store from "@/store";
import i18n from "@/i18n";

const ENHANCE_PROMPT = `You are a prompt engineering expert. The user has written a vague or brief question. Your job is to rewrite it into a clear, well-structured prompt that will get better answers from AI models.

Rules:
- Keep the same intent and language as the original question.
- Add necessary context, constraints, and output format hints.
- Do not add information the user didn't imply.
- Output ONLY the rewritten prompt, no explanation, no preamble.
- If the original prompt is already clear and detailed, return it as-is.

Original prompt:
{prompt}

Rewritten prompt:`;

function getPreferredApiBot() {
  const preferred = store.state.consensusAnalysis?.preferredBot;
  if (preferred) {
    const bot = bots.getBotByClassName(preferred);
    if (bot && !bot.isDisabled() && bot.isAvailable()) {
      return bot;
    }
  }
  const apiBotList = botTags?.openAICompatible || [];
  for (const bot of apiBotList) {
    if (bot && !bot.isDisabled() && bot.isAvailable()) {
      return bot;
    }
  }
  return null;
}

async function enhancePrompt(originalPrompt, onProgress) {
  const bot = getPreferredApiBot();
  if (!bot) {
    throw new Error(i18n.global.t("consensus.noApiBot"));
  }

  const fullPrompt = ENHANCE_PROMPT.replace("{prompt}", originalPrompt);
  let rawContent = "";

  const result = await new Promise((resolve) => {
    bot.sendPrompt(
      fullPrompt,
      (index, values) => {
        if (values.content !== undefined) {
          rawContent = values.content;
          if (onProgress) {
            onProgress(rawContent, false);
          }
        }
        if (values.done) {
          const enhanced = rawContent.trim();
          resolve(enhanced || originalPrompt);
        }
      },
      "prompt-enhance",
    );
  });

  return result;
}

export function usePromptEnhance() {
  return {
    enhancePrompt,
    getPreferredApiBot,
  };
}
