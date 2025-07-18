import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyACThcmJesW8hVaVQ0TQBD7w7T_e70QJZg");

export class MeetingAI {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async generateMeetingSummary(
    notes: string,
    participants: string[]
  ): Promise<string> {
    const prompt = `
    Generate a comprehensive meeting summary based on the following notes and participants:
    
    Participants: ${participants.join(", ")}
    
    Meeting Notes:
    ${notes}
    
    Please provide a structured summary with:
    1. **Executive Summary** (2-3 sentences)
    2. **Key Discussion Points** (3-5 bullet points)
    3. **Important Decisions Made** (if any)
    4. **Action Items** (with responsible persons if mentioned)
    5. **Next Steps** (if discussed)
    6. **Follow-up Required** (if any)
    
    Format the response in clean HTML with proper headings and bullet points.
    Keep it professional and concise.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating meeting summary:", error);
      return "Unable to generate summary at this time. Please try again later.";
    }
  }

  async generateMeetingAgenda(
    title: string,
    duration: number,
    participants: string[]
  ): Promise<string> {
    const prompt = `
    Generate a professional meeting agenda for a website display with the following details:
    
    Meeting Title: ${title}
    Duration: ${duration} minutes
    Participants: ${participants.join(", ")}
    
    Requirements:
    1. Use clean, professional formatting without markdown symbols (*, -, etc.)
    2. Structure with clear sections and time allocations
    3. Include realistic agenda items based on the meeting title
    4. Make it specific to the participants (if provided)
    5. Output should be ready for direct HTML display
    
    Format:
    [Meeting Title]
    [Date/Time/Duration]
    [Participants]
    
    Agenda:
    1. [Time] [Topic] - [Brief description]
    2. [Time] [Topic] - [Brief description]
    ...
    
    Example:
    Quarterly Sales Review
    July 15, 2023 | 10:00 AM - 11:30 AM (90 mins)
    Participants: John Smith (Sales), Sarah Lee (Marketing), Alex Wong (Product)
    
    Agenda:
    1. 10:00-10:10 Welcome & Objectives - Review meeting goals and expected outcomes
    2. 10:10-10:30 Q2 Performance Review - Analysis of sales metrics and KPIs
    3. 10:30-10:50 Campaign Results - Review of marketing campaign effectiveness
    4. 10:50-11:10 Product Roadmap - Discussion of upcoming features and timelines
    5. 11:10-11:25 Action Items - Assign responsibilities and deadlines
    6. 11:25-11:30 Closing Remarks - Summary and next steps
    `;

    try {
      const result = await this.model.generateContent(prompt);
      let response = result.response.text();

      // Clean up any residual markdown or unwanted characters
      response = response
        .replace(/\*\*/g, "") // Remove bold markers
        .replace(/\*/g, "") // Remove asterisks
        .replace(/- /g, "") // Remove bullet points
        .replace(/\[|\]/g, "") // Remove square brackets
        .trim();

      return response;
    } catch (error) {
      console.error("Error generating agenda:", error);
      return `Meeting Agenda: ${title}
      
      Unable to generate detailed agenda at this time. Please check back later or create a custom agenda.`;
    }
  }
}

export const meetingAI = new MeetingAI();
