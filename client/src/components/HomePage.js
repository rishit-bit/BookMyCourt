import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Logo from './Logo';
import { ThreeDButton } from './3D';
import { 
  Users, 
  Shield, 
  Zap,
  ArrowRight,
  Calendar,
  Quote,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap size={32} />,
      title: 'Instant Booking',
      description: 'Book your court in seconds with our lightning-fast booking system.'
    },
    {
      icon: <Calendar size={32} />,
      title: 'Flexible Scheduling',
      description: 'Choose from multiple time slots that fit your schedule perfectly.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Payments',
      description: 'Safe and encrypted payment gateway for all your transactions.'
    },
    {
      icon: <Users size={32} />,
      title: 'Premium Courts',
      description: 'Access to top-quality courts with professional maintenance.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in seconds with just your email and basic information.'
    },
    {
      number: '02',
      title: 'Select Court',
      description: 'Browse through available courts and choose your preferred location.'
    },
    {
      number: '03',
      title: 'Book & Pay',
      description: 'Select your time slot and complete secure payment in one click.'
    },
    {
      number: '04',
      title: 'Play & Enjoy',
      description: 'Show up at your booked time and enjoy your game stress-free.'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '500+', label: 'Courts Available' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Alexandra Martinez',
      role: 'Professional Tennis Player',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      text: 'BookMyCourt has completely transformed how I manage my training schedule. The interface is intuitive and booking is effortless!'
    },
    {
      name: 'Michael Chen',
      role: 'Basketball Coach',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      text: 'The platform makes it so easy to book courts for my team. Reliable, fast, and professional service every time.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Badminton Enthusiast',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      text: 'I love how seamless the booking process is. From selection to payment, everything is smooth and user-friendly.'
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <PageContainer>
      <Background />
      <FloatingElements />

      {/* Navigation */}
      <Navbar>
        <NavContainer>
          <Logo size="medium" />
          <NavLinks $isOpen={isMenuOpen}>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </NavLinks>
          <AuthButtons>
            <LoginButton onClick={() => navigate('/auth')}>Login</LoginButton>
            <SignupButton onClick={handleGetStarted}>Sign Up</SignupButton>
          </AuthButtons>
          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </NavContainer>
      </Navbar>

      <UIOverlay>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroTitle>
                Book Your Court.<br />
                <Highlight>Play Your Game.</Highlight>
              </HeroTitle>
              <HeroSubtitle>
                Experience the easiest way to book sports courts. Join thousands of players 
                who trust BookMyCourt for seamless booking, secure payments, and premium facilities.
              </HeroSubtitle>
              <ButtonWrapper>
                <ThreeDButton
                  onClick={handleGetStarted}
                  size="large"
                  variant="primary"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </ThreeDButton>
              </ButtonWrapper>
            </motion.div>
          </HeroContent>
        </HeroSection>

        {/* Stats Section */}
        <StatsSection>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>

        {/* Features Section */}
        <FeaturesSection id="features">
          <SectionContainer>
            <SectionTitle>Everything You Need</SectionTitle>
            <SectionSubtitle>
              All the features you need to book and manage your court reservations seamlessly
            </SectionSubtitle>
            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </SectionContainer>
        </FeaturesSection>

        {/* How It Works Section */}
        <HowItWorksSection id="how-it-works">
          <SectionContainer>
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle>
              Book your court in just four simple steps
            </SectionSubtitle>
            <StepsGrid>
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <StepNumber>{step.number}</StepNumber>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepCard>
              ))}
            </StepsGrid>
          </SectionContainer>
        </HowItWorksSection>

        {/* Testimonials Section */}
        <TestimonialsSection id="testimonials">
          <SectionContainer>
            <SectionTitle>What Players Say</SectionTitle>
            <SectionSubtitle>
              Trusted by thousands of athletes and sports enthusiasts
            </SectionSubtitle>
            <TestimonialsGrid>
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <QuoteIcon><Quote size={32} /></QuoteIcon>
                  <TestimonialText>{testimonial.text}</TestimonialText>
                  <TestimonialAuthor>
                    <AuthorImage 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.name) + '&background=4F46E5&color=fff&size=150';
                      }}
                    />
                    <AuthorInfo>
                      <AuthorName>{testimonial.name}</AuthorName>
                      <AuthorRole>{testimonial.role}</AuthorRole>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialCard>
              ))}
            </TestimonialsGrid>
          </SectionContainer>
        </TestimonialsSection>

        {/* CTA Section */}
        <CTASection>
          <CTACard>
            <CTATitle>Ready to Get Started?</CTATitle>
            <CTASubtitle>
              Join thousands of players and start booking your favorite courts today
            </CTASubtitle>
            <ButtonWrapper>
              <ThreeDButton
                onClick={handleGetStarted}
                size="large"
                variant="primary"
              >
                Start Booking Now
                <ArrowRight size={20} />
              </ThreeDButton>
            </ButtonWrapper>
          </CTACard>
        </CTASection>

        {/* Footer */}
        <FooterSection id="contact">
          <FooterContainer>
            <FooterContent>
              <FooterColumn>
                <FooterLogo>
                  <Logo size="medium" />
                </FooterLogo>
                <FooterDescription>
                  Premium sports court booking platform. Your game, our passion.
                </FooterDescription>
                <SocialLinks>
                  <SocialLink href="#"><Facebook size={18} /></SocialLink>
                  <SocialLink href="#"><Twitter size={18} /></SocialLink>
                  <SocialLink href="#"><Instagram size={18} /></SocialLink>
                  <SocialLink href="#"><Linkedin size={18} /></SocialLink>
                </SocialLinks>
              </FooterColumn>
              
              <FooterColumn>
                <FooterTitle>Quick Links</FooterTitle>
                <FooterLinks>
                  <FooterLink href="#features">Features</FooterLink>
                  <FooterLink href="#how-it-works">How It Works</FooterLink>
                  <FooterLink href="#testimonials">Testimonials</FooterLink>
                  <FooterLink onClick={handleGetStarted}>Book Court</FooterLink>
                </FooterLinks>
              </FooterColumn>
              
              <FooterColumn>
                <FooterTitle>Contact</FooterTitle>
                <ContactInfo>
                  <ContactItem>
                    <Phone size={14} />
                    +91 8799224907
                  </ContactItem>
                  <ContactItem>
                    <Mail size={14} />
                    support@bookmycourt.com
                  </ContactItem>
                  <ContactItem>
                    <MapPin size={14} />
                    123 Sports Avenue, Ahmedabad, Gujarat, India 380001
                  </ContactItem>
                </ContactInfo>
              </FooterColumn>
            </FooterContent>
            
            <FooterBottom>
              <FooterCopyright>
                © 2025 BookMyCourt. All rights reserved.
              </FooterCopyright>
            </FooterBottom>
          </FooterContainer>
        </FooterSection>
      </UIOverlay>
    </PageContainer>
  );
};

// Styled Components - Matching AuthPage Design Language
const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: linear-gradient(135deg, #0B0E23 0%, #1A1B3D 25%, #2D1B69 50%, #1A1B3D 75%, #0B0E23 100%);
  perspective: 1000px;
  -webkit-perspective: 1000px;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0,0,0);
  -webkit-transform: translate3d(0,0,0);
  will-change: transform;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 20% 20%, rgba(55, 48, 163, 0.15) 0, transparent 40%),
    radial-gradient(circle at 80% 10%, rgba(79, 70, 229, 0.12) 0, transparent 35%),
    radial-gradient(circle at 10% 80%, rgba(37, 99, 235, 0.1) 0, transparent 35%),
    linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.01));
  pointer-events: none;
`;

const FloatingElements = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(37, 99, 235, 0.1));
    animation: float 20s ease-in-out infinite;
    will-change: transform;
  }
  
  &::before {
    width: 300px;
    height: 300px;
    top: 10%;
    left: 5%;
    animation-delay: 0s;
  }
  
  &::after {
    width: 200px;
    height: 200px;
    top: 60%;
    right: 10%;
    animation-delay: -10s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const UIOverlay = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0,0,0);
  -webkit-transform: translate3d(0,0,0);
  will-change: transform;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(11, 14, 35, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(17, 24, 39, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2rem;
    transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    transition: transform 0.3s ease;
    border-bottom: 1px solid rgba(79, 70, 229, 0.2);
    z-index: 999;
    display: ${props => props.$isOpen ? 'flex' : 'none'};
  }
`;

const NavLink = styled.a`
  color: #E5E7EB;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4F46E5;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled.button`
  background: transparent;
  border: 1px solid rgba(79, 70, 229, 0.3);
  color: #4F46E5;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 70, 229, 0.1);
    border-color: rgba(79, 70, 229, 0.5);
  }
`;

const SignupButton = styled.button`
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  border: none;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #4F46E5;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 2rem 4rem;
  text-align: center;
  transform: translateZ(30px);
  
  @media (max-width: 768px) {
    padding: 100px 1.5rem 3rem;
  }
  
  @media (max-width: 480px) {
    padding: 90px 1rem 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: #E5E7EB;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 
    0 0 20px rgba(79, 70, 229, 0.5),
    0 0 40px rgba(79, 70, 229, 0.3);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #A1A1AA;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StatsSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 
      0 35px 70px rgba(0,0,0,0.5),
      0 0 0 1px rgba(79, 70, 229, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #4F46E5;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #A1A1AA;
  font-weight: 500;
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const SectionContainer = styled.div`
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #E5E7EB;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #A1A1AA;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    box-shadow: 
      0 35px 70px rgba(0,0,0,0.5),
      0 0 0 1px rgba(79, 70, 229, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const FeatureIcon = styled.div`
  color: #4F46E5;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #E5E7EB;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #A1A1AA;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(11, 14, 35, 0.5);
  border-radius: 40px;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    margin-top: 3rem;
    border-radius: 30px;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
    margin-top: 2rem;
    border-radius: 20px;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const StepCard = styled(motion.div)`
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 
      0 35px 70px rgba(0,0,0,0.5),
      0 0 0 1px rgba(79, 70, 229, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
  }
  
  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const StepNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #E5E7EB;
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  color: #A1A1AA;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const TestimonialsSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 
      0 35px 70px rgba(0,0,0,0.5),
      0 0 0 1px rgba(79, 70, 229, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const QuoteIcon = styled.div`
  color: #4F46E5;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: #A1A1AA;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(79, 70, 229, 0.3);
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #E5E7EB;
  margin-bottom: 0.25rem;
`;

const AuthorRole = styled.p`
  color: #A1A1AA;
  font-size: 0.85rem;
`;

const CTASection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const CTACard = styled.div`
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  padding: 4rem;
  border-radius: 30px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }
`;

const CTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #E5E7EB;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.1rem;
  color: #A1A1AA;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const FooterSection = styled.footer`
  padding: 4rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid rgba(79, 70, 229, 0.2);
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem 1rem;
  }
`;

const FooterContainer = styled.div``;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FooterDescription = styled.p`
  color: #A1A1AA;
  line-height: 1.6;
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a`
  color: #A1A1AA;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4F46E5;
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #E5E7EB;
  margin-bottom: 0.75rem;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  color: #A1A1AA;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #4F46E5;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #A1A1AA;
  font-size: 0.9rem;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(79, 70, 229, 0.2);
  padding-top: 2rem;
  text-align: center;
`;

const FooterCopyright = styled.p`
  color: #A1A1AA;
  font-size: 0.85rem;
  opacity: 0.8;
`;

export default HomePage;
