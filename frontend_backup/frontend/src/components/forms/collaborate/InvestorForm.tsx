import React from 'react';
import { FormInput } from '../FormInput';
import { FormTextArea } from '../FormTextArea';
import { InvestorFormState } from '../../../types/forms/types';

interface InvestorFormProps {
  formState: InvestorFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const InvestorForm: React.FC<InvestorFormProps> = ({ formState, handleChange }) => (
  <div className="space-y-4">
    <FormInput id="fullName" name="fullName" label="Full Name" value={formState.fullName} onChange={handleChange} required placeholder="Rohan Iyer" />
    <FormInput id="email" name="email" label="Email" type="email" value={formState.email} onChange={handleChange} required placeholder="rohan@bharatventures.in" helperText="We'll never share your email." />
    <FormInput id="linkedinProfile" name="linkedinProfile" label="LinkedIn Profile URL" value={formState.linkedinProfile} onChange={handleChange} required placeholder="https://linkedin.com/in/rohan-iyer" helperText="Paste full LinkedIn URL" />
    <FormInput id="fundName" name="fundName" label="Fund Name / Organisation" value={formState.fundName} onChange={handleChange} required placeholder="Bharat Ventures" />
    <FormInput id="investmentStage" name="investmentStage" label="Preferred Investment Stage" value={formState.investmentStage} onChange={handleChange} required placeholder="Seed / Series A" helperText="e.g. Seed, Series A, Growth" />
    <FormTextArea id="interest" name="interest" label="What interests you about Smartslate?" value={formState.interest} onChange={handleChange} required rows={4} placeholder="I believe your EdTech vision aligns with…" />
  </div>
);
