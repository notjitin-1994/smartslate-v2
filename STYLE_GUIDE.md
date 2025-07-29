# SmartSlate Style Guide

This document outlines the design system and styling guidelines for the SmartSlate website, built upon Material UI.

## 1. Theme Configuration

Our theme is defined in `src/theme.ts` and provides a centralized configuration for colors, typography, spacing, and component styles.

### 1.1. Colors

- **Primary:** #1976d2
- **Secondary:** #dc004e
- **Background:** #fff
- **Text:** #000

### 1.2. Typography

We use a consistent typography scale for headings, body text, and captions to ensure readability and visual hierarchy.

- **h1:** 3.052rem
- **h2:** 2.441rem
- **h3:** 1.953rem
- **h4:** 1.563rem
- **h5:** 1.25rem
- **body1:** 1rem (base)
- **caption:** 0.8rem

### 1.3. Spacing

All spacing is based on a `4px` grid system. The `theme.spacing()` utility should be used to ensure consistent margins and padding.

## 2. Component Guidelines

### 2.1. Buttons

Use the `Button` component from `src/components/common/Button.tsx`. It is a wrapper around the Material UI `Button` and accepts all of its props.

- **Contained:** For high-emphasis, primary actions.
- **Outlined:** For medium-emphasis, secondary actions.
- **Text:** For low-emphasis actions, such as links or minor commands.

### 2.2. Forms

Form inputs should use the `TextField` component from Material UI. Labels should be clear and concise.

### 2.3. Modals

Modals should be used for focused tasks or to display critical information. Use the `Dialog` component from Material UI.

## 3. How to Use

To use the new design system, simply import the components from Material UI or our custom component library and use them in your code. All components will automatically be styled according to the theme.

Example:

```tsx
import { Button, Typography } from '@mui/material';

const MyComponent = () => (
  <div>
    <Typography variant="h1">Hello, World!</Typography>
    <Button variant="contained">Click Me</Button>
  </div>
);