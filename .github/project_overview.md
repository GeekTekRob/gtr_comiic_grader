# GTR Comic Grader Project

## 1. Project Vision

Build a platform where comic collectors can upload images of their comics and receive a standardized grading report using the AI of their choice (Gemini, ChatGPT-4o, or Claude 3.5 Sonnet). The system acts as a "logic wrapper" that forces these different AIs to apply identical CGC grading standards.

## 2. Core Grading Logic (Reference Standards)

The application must strictly enforce the following logic derived from the provided CGC knowledge base:
A. The 10-Point Standard Scale

- **Gem Mint (10.0):** No evidence of manufacturing or handling defects.

- **NM/M (9.8):** Nearly perfect; negligible defects.

- **Fine (6.0):** Slightly above-average with one major defect and some small ones.

- **Poor (0.5):** Heavily defaced with missing pieces.

B. Mandatory Page Quality Caps
The AI must "cap" the final grade based on interior paper condition:

- **White Pages:** The only designation allowed for a **10.0** grade.
- **Off-White to White:** The lowest designation allowed for a **9.9** grade.
- **Light Tan to Off-White:** Maximum achievable grade is **8.5**.
- **Tan to Off-White:** Maximum achievable grade is **7.5**.
- **Slightly Brittle:** Maximum achievable grade is **6.5**.
- **Brittle:** Maximum achievable grade is **3.5**.

C. Restoration & Conservation

- **Conservation:** Professional repairs (tear seals, de-acidification) using rice paper and wheat glue. Must satisfy Quality "A" and Quantity "1".

- **Restoration:** Aesthetic work (color touch, piece fill). Categorized by Quality (A-C) and Quantity (1-5).

## 3. Proposed Tech Stack

- **Frontend:** React or Next.js (for image upload and report rendering).
- **Backend:** Node.js or Python (FastAPI/Flask) to handle API orchestration.
- **AI Integration:**
  - **Gemini API:** (Google) For high-context window analysis.
  - **OpenAI API (GPT-4o):** For vision-based defect detection.
  - **Anthropic API (Claude 3.5):** For logical reasoning and archival advice.
- **Storage:** AWS S3 or Supabase (temporary image hosting for AI analysis).

## 4. Repository Structure

```text
/
├── .github/prompts/      # System prompts for Gemini, GPT, and Claude
├── docs/                 # Project_overview.md and CGC PDF references
├── src/
│   ├── api/              # Handlers for different LLM providers
│   ├── components/       # Image uploaders and Report UI
│   ├── logic/
│   │   ├── grade_caps.js # Logic for applying Tan/Brittle caps
│   │   └── restoration.js# Logic for A-C/1-5 grading
│   └── templates/        # The Markdown report schema
└── public/               # Asset management

```

## 5. Required Output Format

The system must force every AI model to return the data in this exact schema:

> **GRADE:** [NUMERICAL] [LABEL]
> **GRADING ANALYSIS:**
>
> - **Defects:** [Observed damage]
> - **Page Quality:** [Color + Any Caps applied]
> - **Restoration:** [Detected work/materials]
>
> **SUGGESTIONS:**
>
> - **Repair/Improvement:** [Archival steps like rice paper/wheat glue]
> - **Prevention:** [Storage/Climate advice]

## 6. Development Goals for Copilot

1. Generate a `SystemPrompt.txt` that includes the CGC grade caps.
2. Create an API router that takes `comic_name`, `issue_number`, and `images[]` as input.
3. Build a function that compares the AI's suggested grade against the "Page Quality Cap" to ensure the final output is mathematically correct.
