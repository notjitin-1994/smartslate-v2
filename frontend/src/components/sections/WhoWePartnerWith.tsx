import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { Box, Container, Typography, Tabs, Tab, Card, CardContent, Button, Stack, styled } from '@mui/material';
import { School, Business, ArrowForward, Lightbulb, BarChart, People, OfflineBolt } from '@mui/icons-material';
import { Reveal } from '../common/reveal';
import { useTheme } from '@mui/material/styles';
import { content, PartnerType } from './content/whoWePartnerWith';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`partner-tabpanel-${index}`}
      aria-labelledby={`partner-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `partner-tab-${index}`,
    'aria-controls': `partner-tabpanel-${index}`,
  };
}

const GradientText = styled('span')(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const iconMap: { [key: string]: React.ReactElement } = {
  School: <School />,
  Business: <Business />,
  Lightbulb: <Lightbulb />,
  BarChart: <BarChart />,
  People: <People />,
  OfflineBolt: <OfflineBolt />,
};

export const WhoWePartnerWith: React.FC = () => {
  const modalContext = useModal();
  const openModal = modalContext?.openModal;
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const partnerTypes: PartnerType[] = ['institutions', 'businesses'];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container>
        <Reveal>
          <Typography variant="h2" sx={{ mb: 2 }}>Who We <GradientText>Partner</GradientText> With</Typography>
          <Typography sx={{ mb: 4 }}>We collaborate with forward-thinking organizations to build the future of education and workforce development.</Typography>
        </Reveal>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleChange} centered aria-label="Partner types">
            <Tab icon={<School />} label="Educational Institutions" {...a11yProps(0)} />
            <Tab icon={<Business />} label="Business Leaders" {...a11yProps(1)} />
          </Tabs>
        </Box>
        {partnerTypes.map((partnerType, index) => {
          const activeContent = content[partnerType];
          return (
            <TabPanel value={activeTab} index={index} key={partnerType}>
              <Card sx={{ mt: 4, p: 4 }}>
                <CardContent>
                  <Typography variant="h4" sx={{ mb: 2 }}>{activeContent.title}</Typography>
                  <Typography sx={{ mb: 4 }}>{activeContent.pitch}</Typography>
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {activeContent.benefits.map((benefit) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} key={benefit.text}>
                        {iconMap[benefit.icon]}
                        <Typography>{benefit.text}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                    <Button variant="contained" endIcon={<ArrowForward />}>
                      {partnerType === 'institutions' ? 'Explore Our Programs' : 'Learn More'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => openModal && openModal('contact', partnerType === 'institutions' ? 'leader' : 'standard')}
                    >
                      Contact Us
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </TabPanel>
          )
        })}
      </Container>
    </Box>
  );
};

export default WhoWePartnerWith;
