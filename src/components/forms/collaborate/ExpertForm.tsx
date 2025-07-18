import React from 'react';
import { FormInput } from '../FormInput';
import { FormTextArea } from '../FormTextArea';
import { ExpertFormState } from '../../../types/forms/types';

interface ExpertFormProps {
  formState: ExpertFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ExpertForm: React.FC<ExpertFormProps> = ({ formState, handleChange }) => (
  <div className="space-y-4">
    <FormInput id="fullName" name="fullName" label="Full Name" value={formState.fullName} onChange={handleChange} required placeholder="Jane Doe" />
    <FormInput id="email" name="email" label="Email" type="email" value={formState.email} onChange={handleChange} required placeholder="jane@example.com" />
    <FormInput id="linkedinProfile" name="linkedinProfile" label="LinkedIn Profile URL" value={formState.linkedinProfile} onChange={handleChange} required placeholder="https://linkedin.com/in/janedoe" />
    <FormInput id="fieldOfExpertise" name="fieldOfExpertise" label="Field of Expertise" value={formState.fieldOfExpertise} onChange={handleChange} required placeholder="AI in Education" />
    <FormInput id="yearsOfExperience" name="yearsOfExperience" label="Years of Professional Experience" value={formState.yearsOfExperience} onChange={handleChange} required placeholder="8" />
    <FormTextArea id="courseIdea" name="courseIdea" label="Briefly describe your course idea" value={formState.courseIdea} onChange={handleChange} required rows={4} placeholder="I want to create a micro-learning series on…" />
    <FormInput id="hasTaughtBefore" name="hasTaughtBefore" label="Have you taught or created a course before? (Yes/No)" value={formState.hasTaughtBefore} onChange={handleChange} required placeholder="Yes" />
    <FormTextArea id="teachingExperience" name="teachingExperience" label="If yes, please describe your teaching experience" value={formState.teachingExperience} onChange={handleChange} rows={3} placeholder="I have delivered…" />
  </div>
);
