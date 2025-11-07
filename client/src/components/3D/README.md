# 3D Components

This directory contains modern, 3D-themed React components that use CSS transforms, shadows, and depth effects to create an immersive user experience without requiring Three.js or WebGL.

## Components

### ThreeDCard
A 3D card component that responds to mouse movement with realistic 3D rotation and depth effects.

**Props:**
- `children` - Content to render inside the card
- `depth` - Z-axis depth (default: 20)
- `perspective` - CSS perspective value (default: 1000)
- `className` - Additional CSS classes

**Usage:**
```jsx
import { ThreeDCard } from './3D';

<ThreeDCard depth={25}>
  <div>Your content here</div>
</ThreeDCard>
```

### ThreeDButton
A 3D button component with press animations, hover effects, and multiple variants.

**Props:**
- `children` - Button content
- `onClick` - Click handler function
- `disabled` - Disabled state
- `variant` - Button style variant: 'primary', 'secondary', 'success', 'danger'
- `size` - Button size: 'small', 'medium', 'large'
- `className` - Additional CSS classes

**Usage:**
```jsx
import { ThreeDButton } from './3D';

<ThreeDButton 
  variant="primary" 
  size="large" 
  onClick={handleClick}
>
  Click Me
</ThreeDButton>
```

### ThreeDInput
A 3D input field component with focus effects, error states, and icon support.

**Props:**
- `icon` - Lucide React icon component
- `placeholder` - Input placeholder text
- `type` - Input type (default: 'text')
- `error` - Error message to display
- `success` - Success message to display
- `disabled` - Disabled state
- `className` - Additional CSS classes
- All standard input props (onChange, onFocus, etc.)

**Usage:**
```jsx
import { ThreeDInput } from './3D';
import { Mail } from 'lucide-react';

<ThreeDInput
  icon={Mail}
  type="email"
  placeholder="Enter your email"
  error={errors.email?.message}
  {...register('email')}
/>
```

### ThreeDToggle
A 3D toggle component for switching between options with smooth animations.

**Props:**
- `options` - Array of option objects: `[{ value, label }]`
- `value` - Currently selected value
- `onChange` - Change handler function
- `size` - Toggle size: 'small', 'medium', 'large'
- `variant` - Toggle style variant
- `className` - Additional CSS classes

**Usage:**
```jsx
import { ThreeDToggle } from './3D';

const options = [
  { value: 'login', label: 'Sign In' },
  { value: 'signup', label: 'Create Account' }
];

<ThreeDToggle
  options={options}
  value={currentMode}
  onChange={setCurrentMode}
  size="medium"
/>
```

## Features

- **CSS-based 3D effects** - No external dependencies required
- **Smooth animations** - Uses CSS transitions and transforms
- **Responsive design** - Works on all screen sizes
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **Customizable** - Easy to theme and modify
- **Performance optimized** - Hardware-accelerated transforms

## Styling

All components use styled-components and can be customized through:
- CSS custom properties (CSS variables)
- Styled-components theme system
- Direct prop overrides
- CSS-in-JS styling

## Browser Support

- Modern browsers with CSS transform support
- Fallbacks for older browsers
- Progressive enhancement approach

## Performance Notes

- Uses `transform3d` for hardware acceleration
- Minimal reflows and repaints
- Efficient CSS transitions
- Optimized for 60fps animations
