import React from 'react';
import { FormInput } from './FormInput';
import { FormTextArea } from './FormTextArea';
import type { StandardFormData } from '../../lib/formUtils';

interface StandardFormProps {
  formState: StandardFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Basic contact form used by generic "Contact Us" CTA
export const StandardForm: React.FC<StandardFormProps> = ({ formState, handleChange }) => (
  <div className="space-y-4">
    <FormInput id="name" name="name" label="Full Name" value={formState.name} onChange={handleChange} required placeholder="Rahul Sharma" />
    <FormInput id="organization" name="organization" label="Organization / Institution" value={formState.organization} onChange={handleChange} required placeholder="Infosys Ltd." />
    <FormInput id="email" name="email" label="Email" type="email" value={formState.email} onChange={handleChange} required placeholder="rahul.sharma@example.com" helperText="We'll never share your email." />
    <FormInput id="phone" name="phone" label="Phone" type="tel" value={formState.phone} onChange={handleChange} required placeholder="+91 98765 43210" helperText="Format: +91 followed by 10-digit mobile number" />
    <FormTextArea id="interest" name="interest" label="How can we help?" value={formState.interest || ''} onChange={handleChange} rows={4} placeholder="Tell us how we can help you…" />
  </div>
);

export default StandardForm;
