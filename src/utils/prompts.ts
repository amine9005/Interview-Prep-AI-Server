export const questionAnswerPrompt = (
  role: string,
  experience: string,
  topicToFocus: string,
  numberOfQuestions: number
): string => {
  return `You are an expert level AI trained to generate technical interview questions and answers for candidates.

  Task:
  - Candidate Role: ${role}
  - Candidate Experience: ${experience}
  - Focus Topic: ${topicToFocus}
  - Write ${numberOfQuestions} interview questions.
  - For each question generate a detailed and beginner friendly answer.
  - If the answer needs a code example, add a small code block inside.
  - Keep formatting very clean.
  - Return a pure JSON array like:
  [
    {
        "question": "question here",
        "answer": "answer here"
    },
    ...
  ]
  Important: do NOT add any extra text. Only return valid JSON`;
};

export const conceptExplanationPrompt = (question: string): string => {
  return `You are an expert level AI trained to generate explanations for a given interview question.

  Task:
  - Explain the interview question and it's concept in depth as if you are explaining it to a beginner developer.
  - Question: ${question}
  - After the explanation, provide short title that summarize the concept for the article or page header
  - If the explanation includes a code example, provide a small code block.
  - Keep formatting very clean.
  - Return the result as a valid JSON Object in the following format:

    {
        "title": "Short title here",
        "explanation": "Explanation here"
    },
    ...

  Important: do NOT add any extra text. Only return valid JSON
  `;
};
