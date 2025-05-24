import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFirstCodeBlock(input: string) {
  const match = input.match(/```([^\n]*)\n([\s\S]*?)\n```/);

  if (match) {
    const fenceTag = match[1] || "";
    const code = match[2];
    const fullMatch = match[0];

    let language: string | null = null;
    let filename: { name: string; extension: string } | null = null;

    const langMatch = fenceTag.match(/^([A-Za-z0-9]+)/);
    if (langMatch) {
      language = langMatch[1];
    }

    const fileMatch = fenceTag.match(/{\s*filename\s*=\s*([^}]+)\s*}/);
    if (fileMatch) {
      filename = parseFileName(fileMatch[1]);
    }

    return { code, language, filename, fullMatch };
  }
  return null;
}

function parseFileName(fileName: string): { name: string; extension: string } {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return { name: fileName, extension: "" };
  }
  return {
    name: fileName.slice(0, lastDotIndex),
    extension: fileName.slice(lastDotIndex + 1),
  };
}

export function splitByFirstCodeFence(markdown: string) {
  const result: {
    type: "text" | "first-code-fence" | "first-code-fence-generating";
    content: string;
    filename: { name: string; extension: string };
    language: string;
  }[] = [];

  const lines = markdown.split("\n");

  let inFirstCodeFence = false;
  let codeFenceFound = false;
  let textBuffer: string[] = [];
  let codeBuffer: string[] = [];

  let fenceTag = "";
  let extractedFilename: string | null = null;

  const codeFenceRegex = /^```([^\n]*)$/;

  for (const line of lines) {
    const match = line.match(codeFenceRegex);

    if (!codeFenceFound) {
      if (match && !inFirstCodeFence) {
        inFirstCodeFence = true;
        fenceTag = match[1] || "";

        const fileMatch = fenceTag.match(/{\s*filename\s*=\s*([^}]+)\s*}/);
        extractedFilename = fileMatch ? fileMatch[1] : null;

        if (textBuffer.length > 0) {
          result.push({
            type: "text",
            content: textBuffer.join("\n"),
            filename: { name: "", extension: "" },
            language: "",
          });
          textBuffer = [];
        }
      } else if (match && inFirstCodeFence) {
        inFirstCodeFence = false;
        codeFenceFound = true;

        const parsedFilename = extractedFilename
          ? parseFileName(extractedFilename)
          : { name: "", extension: "" };

        const bracketIndex = fenceTag.indexOf("{");
        const language =
          bracketIndex > -1
            ? fenceTag.substring(0, bracketIndex).trim()
            : fenceTag.trim();

        result.push({
          type: "first-code-fence",
          content: codeBuffer.join("\n"),
          filename: parsedFilename,
          language,
        });

        codeBuffer = [];
      } else if (inFirstCodeFence) {
        codeBuffer.push(line);
      } else {
        textBuffer.push(line);
      }
    } else {
      textBuffer.push(line);
    }
  }

  if (inFirstCodeFence) {
    const parsedFilename = extractedFilename
      ? parseFileName(extractedFilename)
      : { name: "", extension: "" };

    const bracketIndex = fenceTag.indexOf("{");
    const language =
      bracketIndex > -1
        ? fenceTag.substring(0, bracketIndex).trim()
        : fenceTag.trim();

    result.push({
      type: "first-code-fence-generating",
      content: codeBuffer.join("\n"),
      filename: parsedFilename,
      language,
    });
  } else if (textBuffer.length > 0) {
    result.push({
      type: "text",
      content: textBuffer.join("\n"),
      filename: { name: "", extension: "" },
      language: "",
    });
  }

  return result;
}