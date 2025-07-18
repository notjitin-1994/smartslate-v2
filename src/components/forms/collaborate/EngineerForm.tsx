import React from 'react';
import { FormInput } from '../FormInput';
import { EngineerFormState } from '../../../types/forms/types';

interface EngineerFormProps {
  formState: EngineerFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EngineerForm: React.FC<EngineerFormProps> = ({ formState, handleChange }) => (
  <div className="space-y-4">
    <FormInput id="fullName" name="fullName" label="Full Name" value={formState.fullName} onChange={handleChange} required />
    <FormInput id="email" name="email" label="Email" type="email" value={formState.email} onChange={handleChange} required />
    <FormInput id="linkedinProfile" name="linkedinProfile" label="LinkedIn Profile URL" value={formState.linkedinProfile} onChange={handleChange} required />
    <FormInput id="githubProfile" name="githubProfile" label="GitHub Profile URL" value={formState.githubProfile} onChange={handleChange} required />
    <FormInput id="yearsOfExperience" name="yearsOfExperience" label="Years of Professional Experience" value={formState.yearsOfExperience} onChange={handleChange} required />
    <FormInput id="techStack" name="techStack" label="Primary Tech Stack (e.g., React, Python, etc.)" value={formState.techStack} onChange={handleChange} required />
    <FormInput id="interest" name="interest" label="Why are you interested in joining Smartslate?" value={formState.interest} onChange={handleChange} required />
  </div>
);
