// Responsive breakpoints and utilities
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px',
  xlarge: '1400px'
};

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  large: `@media (max-width: ${breakpoints.large})`,
  xlarge: `@media (max-width: ${breakpoints.xlarge})`,
  
  // Min-width queries
  mobileUp: `@media (min-width: ${breakpoints.mobile})`,
  tabletUp: `@media (min-width: ${breakpoints.tablet})`,
  desktopUp: `@media (min-width: ${breakpoints.desktop})`,
  largeUp: `@media (min-width: ${breakpoints.large})`,
  xlargeUp: `@media (min-width: ${breakpoints.xlarge})`,
  
  // Range queries
  mobileOnly: `@media (max-width: ${breakpoints.mobile})`,
  tabletOnly: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktopOnly: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  largeOnly: `@media (min-width: ${breakpoints.desktop}) and (max-width: ${breakpoints.large})`,
  xlargeOnly: `@media (min-width: ${breakpoints.large}) and (max-width: ${breakpoints.xlarge})`,
  xxlargeOnly: `@media (min-width: ${breakpoints.xlarge})`
};

// Common responsive patterns
export const responsive = {
  // Grid patterns
  grid: {
    mobile: '1fr',
    tablet: 'repeat(auto-fit, minmax(250px, 1fr))',
    desktop: 'repeat(auto-fit, minmax(300px, 1fr))',
    large: 'repeat(auto-fit, minmax(350px, 1fr))'
  },
  
  // Spacing patterns
  spacing: {
    mobile: '0.5rem',
    tablet: '1rem',
    desktop: '1.5rem',
    large: '2rem'
  },
  
  // Font sizes
  fontSize: {
    mobile: '0.875rem',
    tablet: '1rem',
    desktop: '1.125rem',
    large: '1.25rem'
  },
  
  // Padding patterns
  padding: {
    mobile: '10px',
    tablet: '15px',
    desktop: '20px',
    large: '24px'
  },
  
  // Margin patterns
  margin: {
    mobile: '8px',
    tablet: '12px',
    desktop: '16px',
    large: '20px'
  }
};

// Responsive utility functions
export const getResponsiveValue = (values) => {
  return `
    ${values.mobile || values.default || ''}
    
    ${media.tablet} {
      ${values.tablet || values.mobile || values.default || ''}
    }
    
    ${media.desktop} {
      ${values.desktop || values.tablet || values.mobile || values.default || ''}
    }
    
    ${media.large} {
      ${values.large || values.desktop || values.tablet || values.mobile || values.default || ''}
    }
  `;
};

// Common responsive mixins
export const mixins = {
  // Flexbox center
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  // Flexbox column
  flexColumn: `
    display: flex;
    flex-direction: column;
  `,
  
  // Responsive grid
  responsiveGrid: (minWidth = '250px') => `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
    gap: 1rem;
    
    ${media.tablet} {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    
    ${media.mobile} {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  `,
  
  // Responsive text
  responsiveText: (sizes) => `
    font-size: ${sizes.mobile || '1rem'};
    
    ${media.tablet} {
      font-size: ${sizes.tablet || sizes.mobile || '1rem'};
    }
    
    ${media.desktop} {
      font-size: ${sizes.desktop || sizes.tablet || sizes.mobile || '1rem'};
    }
    
    ${media.large} {
      font-size: ${sizes.large || sizes.desktop || sizes.tablet || sizes.mobile || '1rem'};
    }
  `,
  
  // Responsive padding
  responsivePadding: (paddings) => `
    padding: ${paddings.mobile || '1rem'};
    
    ${media.tablet} {
      padding: ${paddings.tablet || paddings.mobile || '1rem'};
    }
    
    ${media.desktop} {
      padding: ${paddings.desktop || paddings.tablet || paddings.mobile || '1rem'};
    }
    
    ${media.large} {
      padding: ${paddings.large || paddings.desktop || paddings.tablet || paddings.mobile || '1rem'};
    }
  `,
  
  // Responsive margin
  responsiveMargin: (margins) => `
    margin: ${margins.mobile || '0'};
    
    ${media.tablet} {
      margin: ${margins.tablet || margins.mobile || '0'};
    }
    
    ${media.desktop} {
      margin: ${margins.desktop || margins.tablet || margins.mobile || '0'};
    }
    
    ${media.large} {
      margin: ${margins.large || margins.desktop || margins.tablet || margins.mobile || '0'};
    }
  `,
  
  // Hide on mobile
  hideOnMobile: `
    ${media.mobile} {
      display: none !important;
    }
  `,
  
  // Show only on mobile
  showOnlyOnMobile: `
    display: none;
    
    ${media.mobile} {
      display: block;
    }
  `,
  
  // Hide on tablet and below
  hideOnTablet: `
    ${media.tablet} {
      display: none !important;
    }
  `,
  
  // Show only on tablet and above
  showOnlyOnTablet: `
    display: none;
    
    ${media.tabletUp} {
      display: block;
    }
  `,
  
  // Responsive container
  responsiveContainer: (maxWidth = '1200px') => `
    max-width: ${maxWidth};
    margin: 0 auto;
    padding: 0 2rem;
    
    ${media.tablet} {
      padding: 0 1.5rem;
    }
    
    ${media.mobile} {
      padding: 0 1rem;
    }
  `
};

export default {
  breakpoints,
  media,
  responsive,
  mixins,
  getResponsiveValue
};
