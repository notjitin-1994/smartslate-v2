import React from 'react';
import { FormInput } from '../FormInput';
import { FormTextArea } from '../FormTextArea';
import { LeaderFormState } from '../../../types/forms/types';

interface LeaderFormProps {
  formState: LeaderFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const LeaderForm: React.FC<LeaderFormProps> = ({ formState, handleChange }) => (
  <div className="space-y-4">
    <FormInput id="fullName" name="fullName" label="Full Name" value={formState.fullName} onChange={handleChange} required placeholder="Anita Desai" />
    <FormInput id="email" name="email" label="Email" type="email" value={formState.email} onChange={handleChange} required placeholder="anita.desai@iitb.ac.in" helperText="We’ll keep your email private." />
    <FormInput id="linkedinProfile" name="linkedinProfile" label="LinkedIn Profile URL" value={formState.linkedinProfile} onChange={handleChange} required placeholder="https://linkedin.com/in/anita-desai" helperText="Paste full LinkedIn URL" />
    <FormInput id="organization" name="organization" label="Organization / Institution" value={formState.organization} onChange={handleChange} required placeholder="IIT Bombay" />
    <FormInput id="role" name="role" label="Your Role" value={formState.role} onChange={handleChange} required placeholder="Director, Centre for EdTech" />
    <FormTextArea id="interest" name="interest" label="How would you like to collaborate?" value={formState.interest} onChange={handleChange} required rows={4} placeholder="I’d like to co-create courses on…" />
  </div>
);
