import type { ApplicationListItem } from '../domain/application-display';

/** Stable primary row for navigation scaffolding */
export const PRIMARY_UI_APPLICATION_ID = 'jobtrackr-ui-shell-application-id';

export const MOCK_APPLICATIONS: ApplicationListItem[] = [
  {
    id: PRIMARY_UI_APPLICATION_ID,
    jobTitle: 'Staff Product Engineer',
    companyName: 'Acme Labs',
    status: 'TECHNICAL_ASSESSMENT',
    workMode: 'REMOTE',
    location: 'US · ET overlap',
    salaryRange: '$175–205k',
    appliedLabel: 'Applied Jan 12',
    deadlineLabel: 'Take-home due Sun',
    notesPreview: 'Recruiter loop cleared · awaiting panel scheduling.',
  },
  {
    id: 'mock-app-nova-design',
    jobTitle: 'Senior UX Engineer',
    companyName: 'Nova Design Co.',
    status: 'INTERVIEW',
    workMode: 'HYBRID',
    location: 'London · 2d/wk onsite',
    salaryRange: '£120–135k',
    appliedLabel: 'Applied Feb 3',
    notesPreview: 'Portfolio reviewed positively.',
  },
  {
    id: 'mock-app-nimbus',
    jobTitle: 'Platform Engineer',
    companyName: 'Nimbus AI',
    status: 'SCREENING',
    workMode: 'REMOTE',
    location: 'EU-friendly',
    salaryRange: undefined,
    appliedLabel: 'Applied Feb 18',
    notesPreview: 'Waiting on HM screen.',
  },
  {
    id: 'mock-app-polaris',
    jobTitle: 'Engineering Manager',
    companyName: 'Polaris Health',
    status: 'OFFER',
    workMode: 'HYBRID',
    location: 'NYC metro',
    salaryRange: '$210k + equity',
    appliedLabel: 'Offer received Feb 22',
    notesPreview: 'Negotiating start date.',
  },
];

export function getMockApplicationById(id: string): ApplicationListItem | undefined {
  return MOCK_APPLICATIONS.find((a) => a.id === id);
}
