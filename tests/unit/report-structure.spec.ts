import { expect, test } from "@playwright/test";
import { structureReportFromText } from "../../features/reports/structure-from-text";

const SAMPLE = `
GIRLS GLOBAL INITIATIVE (GGI)
OFFICIAL ACTIVITY REPORT
BREAST CANCER AWARENESS AND SCREENING PROGRAMME
“Know Your Body, Protect Your Future”
Date Friday, 23rd October 2026
Venue Enchi Presbyterian Church, Enchi, Western North Region, Ghana
Time 10:40 a.m. – 2:50 p.m.
Target participants 80 students
Actual student
attendance 100 students
Other participants 3 nurses and 9 teachers
1. INTRODUCTION
Girls Global Initiative (GGI) organised a Breast Cancer Awareness and Screening Programme
on Friday, 23rd October 2026, at the Enchi Presbyterian Church.
The programme was held under the theme “Know Your Body, Protect Your Future”.
2. OBJECTIVES OF THE PROGRAMME
• Raise awareness among young girls about breast cancer.
• Educate participants on recognising unusual changes.
3. PARTICIPATION AND COMMUNITY MOBILISATION
GGI planned to host 80 students and attracted 100 students.
• 100 students from various schools.
• 9 teachers accompanying and supporting the students.
4. PROGRAMME IMPLEMENTATION AND ACTIVITIES
Opening Prayer: The programme commenced with an opening prayer.
Health Education Sessions: Three nurses facilitated the sessions.
5. ORGANISING TEAM AND OFFICIALS PRESENT
1. Miss Philomena Ofori Larbi – President and Founder.
6. PARTICIPATING HEALTH PROFESSIONALS AND TEACHERS
Three nurses facilitated the breast cancer awareness sessions.
7. KEY ACHIEVEMENTS AND OUTCOMES
• Exceeded attendance target: 100 students against a target of 80.
8. CHALLENGES ENCOUNTERED
The major challenge was an unexpected power outage in Enchi.
9. RECOMMENDATIONS AND WAY FORWARD
• Early logistical preparation and contingency planning.
10. CONCLUSION
The programme was successfully implemented.
PREPARED BY
Miss Philomena Ofori Larbi
President and Founder
Organisation: Girls Global Initiative
Programme: Breast Cancer Awareness and Screening Programme
Theme: Know Your Body, Protect Your Future
Date: 23rd October 2026
`;

test.describe("report structure-from-text", () => {
  test("preserves facts and section coverage without inventing content", () => {
    const draft = structureReportFromText(SAMPLE, { pageCount: 5 });

    expect(draft.title).toMatch(/Breast Cancer Awareness/i);
    expect(draft.publishedOn).toMatch(/23rd October 2026/);
    expect(draft.body).toContain("## Introduction");
    expect(draft.body).toContain("## Objectives");
    expect(draft.body).toContain("## Challenges");
    expect(draft.body).toContain("## Recommendations");
    expect(draft.body).toContain("80 students");
    expect(draft.body).toContain("100 students");
    expect(draft.body).toContain("Opening Prayer");
    expect(draft.body).toContain("Miss Philomena Ofori Larbi");
    expect(draft.body).not.toContain("invented");
    expect(draft.pageCount).toBe(5);
  });
});
