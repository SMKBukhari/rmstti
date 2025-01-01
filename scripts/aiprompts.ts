export const job_description = (roleName: string, skills: string) => {
  return `Craft a comprehensive and engaging job description for the position of ${roleName}. The description should be tailored to a startup environment and include the following sections, each separated by two line breaks:

Job Summary: Provide a compelling overview of the ${roleName} role, emphasizing its significance within a fast-paced startup. Highlight how this position contributes to the company's mission and growth.

Key Responsibilities: List 7-10 detailed primary tasks and responsibilities associated with the ${roleName} role. Focus on actionable items that showcase the diverse nature of the position.

Required Skills and Qualifications: Enumerate 8-12 specific skills, qualifications, and experiences necessary for the ${roleName} role. Incorporate the following skills: ${skills}. Include both technical and soft skills relevant to a startup environment.

Preferred Skills: Outline 5-7 additional skills or experiences that would give candidates an edge. These should be desirable but not mandatory qualifications that would help excel in the role.

Work Environment: Describe the dynamic working conditions of a startup, including team structure, collaboration tools used, and aspects of the company culture that make it unique and appealing.

Impact: Articulate how the ${roleName} position directly contributes to the startup's goals, product development, and overall success. Provide 2-3 specific examples of potential projects or outcomes.

Career Growth Opportunities: Detail potential career paths and growth opportunities within the startup, emphasizing rapid skill development, increased responsibilities, and possibilities for advancement as the company scales.

Ensure the description is clear, professional, and appealing to potential candidates who are excited about working in a startup environment. Avoid using any symbols for highlighting or formatting. Aim for a total length of 500-600 words. Each time this prompt is used, generate a unique description with varied language and structure.`;
};

export const job_short_description = (roleName: string) => {
  return `Create a captivating and concise job summary for the ${roleName} position in a dynamic startup environment. In exactly 350 characters:

1. Highlight the core purpose of the role
2. Mention 2-3 key responsibilities
3. Emphasize one unique aspect of working for this startup
4. Include a call-to-action for potential applicants

Avoid using any symbols or formatting. Ensure the description is energetic, professional, and tailored to attract top talent interested in startup opportunities. Generate a unique summary each time, varying the structure and focus to highlight different aspects of the role.`;
};

export const job_tags = (profession: string) => {
  return `Generate an array of exactly 10 highly relevant keywords for the ${profession} role in a startup context. Follow these guidelines:

1. Include a mix of technical skills, soft skills, and industry-specific terms
2. Ensure at least 2 keywords relate to startup culture or environment
3. Include 1-2 trending technologies or methodologies relevant to the field
4. Avoid generic terms like "teamwork" or "communication"
5. Ensure each keyword is unique and not a variation of another
6. Limit each keyword or phrase to a maximum of 3 words

Return only the array of keywords, without any additional text or formatting. Ensure each generated set is unique and tailored to current industry trends and startup needs. Example format: ["keyword1", "keyword2", "keyword3", ...]`;
};

export const company_overview = (companyName: string) => {
  return `Create a compelling company overview for the startup ${companyName}. In 200-250 words, address the following points:

1. Founding story: Brief background on when and why the company was started
2. Mission and vision: The core purpose and long-term aspirations of ${companyName}
3. Product or service: A concise explanation of what ${companyName} offers and its unique value proposition
4. Target market: Identify the primary audience or customers ${companyName} serves
5. Achievements: Mention 1-2 key milestones or recognitions the company has received
6. Culture: Briefly describe the company's values and work environment
7. Future outlook: A sentence about the company's growth plans or upcoming initiatives

Ensure the overview is engaging, informative, and tailored to attract both potential employees and customers. Use a tone that reflects the startup's innovative and dynamic nature. Generate a unique overview each time, varying the focus and structure to highlight different aspects of ${companyName}.`;
};

export const company_why_join_us = (companyName: string) => {
  return `Craft an inspiring "Why Join Us" section for ${companyName}, a dynamic startup. In 150-200 words, highlight the following aspects:

1. Innovation: How ${companyName} is disrupting its industry or solving unique problems
2. Growth opportunities: Emphasize rapid skill development and career advancement possibilities
3. Impact: Describe how employees can make a significant difference in the company and potentially the world
4. Culture: Highlight 2-3 unique aspects of the company culture (e.g., flat hierarchy, remote-first, continuous learning)
5. Benefits: Mention 1-2 standout perks or benefits that set ${companyName} apart
6. Team: Briefly describe the collaborative and diverse nature of the team
7. Vision: Connect the role to the larger mission and future of the company

Conclude with a powerful call-to-action that encourages talented individuals to apply. Ensure the content is energetic, genuine, and tailored to attract ambitious professionals who thrive in startup environments. Generate a unique "Why Join Us" piece each time, varying the emphasis and examples to showcase different strengths of ${companyName}.`;
};

export const user_Bio = (role: string, userName: string) => {
  return `Create an impactful professional biography for ${userName}, a ${role}, in exactly 100 words. Include the following elements:

1. A strong opening statement that captures attention
2. Highlight 2-3 key skills or areas of expertise relevant to the ${role} position
3. Mention one significant professional achievement or project
4. Include a brief statement about ${userName}'s approach to work or professional philosophy
5. If applicable, mention any relevant education or certifications
6. Conclude with a forward-looking statement about ${userName}'s professional goals or interests

Ensure the biography is engaging, professional, and tailored to the ${role} position in a startup context. Use active voice and impactful language. Generate a unique biography each time, varying the structure and focus to highlight different aspects of ${userName}'s professional profile.`;
};

