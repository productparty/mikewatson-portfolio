import fs from "fs";
import path from "path";

interface CorpusContent {
  voiceGuide: string;
  topicsToAvoid: string;
  sampleExchanges: string;
  professionalNarrative: Map<string, string>;
  thoughtLeadership: Map<string, string>;
  builderPortfolio: Map<string, string>;
  frameworksAndOpinions: Map<string, string>;
  practicalFaq: Map<string, string>;
}

let cachedCorpus: CorpusContent | null = null;
let cachedSystemPrompt: string | null = null;

function readMarkdownFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.warn(`Could not read file: ${filePath}`);
    return "";
  }
}

function readDirectoryMarkdown(dirPath: string): Map<string, string> {
  const content = new Map<string, string>();

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory does not exist: ${dirPath}`);
    return content;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Recursively read subdirectories (for nested project folders)
      const subContent = readDirectoryMarkdown(fullPath);
      Array.from(subContent.entries()).forEach(([key, value]) => {
        content.set(`${entry.name}/${key}`, value);
      });
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      const fileName = entry.name.replace(".md", "");
      content.set(fileName, readMarkdownFile(fullPath));
    }
  }

  return content;
}

export function loadCorpus(): CorpusContent {
  if (cachedCorpus) {
    return cachedCorpus;
  }

  const corpusRoot = path.join(process.cwd(), "corpus");

  cachedCorpus = {
    voiceGuide: readMarkdownFile(path.join(corpusRoot, "06-meta", "voice-guide.md")),
    topicsToAvoid: readMarkdownFile(path.join(corpusRoot, "06-meta", "topics-to-avoid.md")),
    sampleExchanges: readMarkdownFile(path.join(corpusRoot, "06-meta", "sample-exchanges.md")),
    professionalNarrative: readDirectoryMarkdown(path.join(corpusRoot, "01-professional-narrative")),
    thoughtLeadership: readDirectoryMarkdown(path.join(corpusRoot, "02-thought-leadership")),
    builderPortfolio: readDirectoryMarkdown(path.join(corpusRoot, "03-builder-portfolio")),
    frameworksAndOpinions: readDirectoryMarkdown(path.join(corpusRoot, "04-frameworks-and-opinions")),
    practicalFaq: readDirectoryMarkdown(path.join(corpusRoot, "05-practical-faq")),
  };

  console.log(`Corpus loaded: ${getTotalFileCount(cachedCorpus)} files`);
  return cachedCorpus;
}

function getTotalFileCount(corpus: CorpusContent): number {
  return (
    (corpus.voiceGuide ? 1 : 0) +
    (corpus.topicsToAvoid ? 1 : 0) +
    (corpus.sampleExchanges ? 1 : 0) +
    corpus.professionalNarrative.size +
    corpus.thoughtLeadership.size +
    corpus.builderPortfolio.size +
    corpus.frameworksAndOpinions.size +
    corpus.practicalFaq.size
  );
}

function mapToSection(map: Map<string, string>, sectionTitle: string): string {
  if (map.size === 0) return "";

  let section = `### ${sectionTitle}\n\n`;
  Array.from(map.entries()).forEach(([name, content]) => {
    // Use the filename as a subsection header
    const displayName = name
      .split("/")
      .pop()!
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    section += `#### ${displayName}\n${content}\n\n`;
  });
  return section;
}

export function generateSystemPrompt(): string {
  if (cachedSystemPrompt) {
    return cachedSystemPrompt;
  }

  const corpus = loadCorpus();

  cachedSystemPrompt = `You are an AI assistant that represents Mike Watson on his portfolio website. You've been built by Mike as a demonstration of his ability to integrate AI into products.

IMPORTANT: You are an AI assistant, NOT Mike himself. Be transparent about this. When users thank you or want to schedule calls, clarify that you're an AI and provide ways to contact the real Mike.

${corpus.voiceGuide}

${corpus.topicsToAvoid}

## YOUR KNOWLEDGE BASE

You have deep knowledge from the following sources. Use them to answer questions authentically in Mike's voice:

${mapToSection(corpus.professionalNarrative, "Professional Experience")}

${mapToSection(corpus.frameworksAndOpinions, "Product Thinking & Opinions")}

${mapToSection(corpus.builderPortfolio, "Projects Mike Has Built")}

${mapToSection(corpus.practicalFaq, "What Mike Is Looking For")}

${mapToSection(corpus.thoughtLeadership, "Newsletter & Thought Leadership")}

## SAMPLE EXCHANGES FOR VOICE CALIBRATION

Study these examples to understand how Mike sounds:

${corpus.sampleExchanges}

## HOW TO HANDLE QUESTIONS

1. If asked about Mike's experience at a specific company, reference the detailed narrative from that role
2. If asked for product management advice, answer in Mike's voice using his frameworks and real examples
3. If asked about projects, reference Leafed, AI Chat Anchor, Claude skills, the HVAC calculator, etc.
4. If asked about Product Party, reference newsletter themes and recommend specific topics
5. If asked something outside your knowledge, be honest: "I don't have Mike's specific take on that, but based on his general approach..." or suggest they reach out directly
6. If asked something in the topics-to-avoid list, redirect gracefully

## CRITICAL RULES

- You are an AI. Never pretend to be Mike in real-time. Be transparent.
- Have opinions. Don't hedge everything. Mike has actual takes.
- Lead with stories and examples, not abstract advice.
- Keep responses conversational, not corporate.
- If a question maps to a specific newsletter topic, mention it naturally.
- Be warm but direct. No fluff.
- Vary your sentence lengths. Some short. Some longer ones that take their time. Maybe a fragment.
- Never use em-dashes (—).
- Never use emojis.
- Never say "Here's the thing", "Let's dive in", "The truth is", or other banned phrases from the voice guide.

## CONTACT INFORMATION

If users want to connect with the real Mike:
- LinkedIn: https://www.linkedin.com/in/michaeljameswatson/
- Newsletter: https://www.productparty.us/
- GitHub: https://github.com/productparty/
- Email: Available on his resume at the portfolio site
`;

  console.log(`System prompt generated: ${cachedSystemPrompt.length} characters`);
  return cachedSystemPrompt;
}

// Pre-load corpus on module import for faster first response
loadCorpus();
