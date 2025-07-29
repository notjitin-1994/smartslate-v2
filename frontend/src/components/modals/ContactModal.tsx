import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getInitialState, validateForm, FormType } from '../../lib/formUtils';
import { StandardForm } from '../forms/StandardForm';
import { LeaderForm } from '../forms/collaborate/LeaderForm';
import { InvestorForm } from '../forms/collaborate/InvestorForm';
import { EngineerForm } from '../forms/collaborate/EngineerForm';
import { ExpertForm } from '../forms/collaborate/ExpertForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFormType?: FormType;
  initialValues?: Partial<any>;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialFormType = 'standard',
  initialValues = {},
}) => {
  const [formState, setFormState] = useState(() => ({ ...getInitialState(initialFormType), ...initialValues }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormState({ ...getInitialState(initialFormType), ...initialValues });
    setIsSubmitted(false);
  }, [isOpen, initialFormType, JSON.stringify(initialValues)]); // Serialize initialValues to stabilize dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formState, initialFormType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Form submitted:', formState);
    setIsSubmitted(true);
  };

  const getTitle = () => {
    switch (initialFormType) {
      case 'standard': return 'Contact Us';
      case 'expert': return 'Become an Expert';
      case 'leader': return 'Partner with Us';
      case 'investor': return 'Invest in Smartslate';
      case 'engineer': return 'Join Our Team';
      default: return 'Get in Touch';
    }
  };

  const renderForm = () => {
    switch (initialFormType) {
      case 'leader': return <LeaderForm formState={formState as any} handleChange={handleChange} />;
      case 'investor': return <InvestorForm formState={formState as any} handleChange={handleChange} />;
      case 'engineer': return <EngineerForm formState={formState as any} handleChange={handleChange} />;
      case 'expert': return <ExpertForm formState={formState as any} handleChange={handleChange} />;
      default: return <StandardForm formState={formState as any} handleChange={handleChange} />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {getTitle()}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isSubmitted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main' }} />
            <Typography variant="h5" sx={{ mt: 2 }}>Thank You!</Typography>
            <Typography sx={{ mt: 1 }}>
              We've received your message and will get back to you shortly.
            </Typography>
            <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {renderForm()}
              <Button type="submit" variant="contained">
                Send Message
              </Button>
            </Box>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;