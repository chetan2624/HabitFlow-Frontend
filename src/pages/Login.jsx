import React from 'react';
import { SignIn } from '@clerk/react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-hidden">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/photos/hero-1.jpg" 
          alt="Mountain Landscape" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Welcome Text */}
        <div className="text-white lg:w-1/2 flex flex-col gap-6">
           <h1 className="text-6xl md:text-8xl font-bold font-sans drop-shadow-xl tracking-tight leading-none">
             Welcome<br/>Back
           </h1>
           <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-lg font-light leading-relaxed">
             It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using HabitFlow is to find clarity in the noise.
           </p>
           
        </div>

        {/* Right Side: Clerk Component Transparent Styled */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end w-full">
           <SignIn 
             fallbackRedirectUrl="/dashboard" 
             signUpUrl="/signup" 
             appearance={{
               variables: {
                 colorBackground: 'transparent',
                 colorText: 'white',
                 colorTextSecondary: 'rgba(255,255,255,0.7)',
                 colorInputBackground: 'rgba(255,255,255,0.05)',
                 colorInputText: 'white',
               },
               elements: {
                 rootBox: "w-full max-w-md",
                 card: "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl w-full",
                 headerTitle: "text-white text-3xl font-bold",
                 headerSubtitle: "text-white/70",
                 formFieldLabel: "text-white/90",
                 formFieldInput: "bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500",
                 formButtonPrimary: "bg-[#d95d39] hover:bg-[#c24f2d] text-white font-bold py-3 text-lg transition-all",
                 footer: "bg-transparent border-t border-white/10",
                 footerActionText: "text-white/90 font-medium",
                 footerActionLink: "text-[#d95d39] hover:text-[#c24f2d] font-bold ml-1",
                 dividerLine: "bg-white/20",
                 dividerText: "text-white/50",
                 socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                 socialButtonsBlockButtonText: "text-white font-medium",
                 identityPreviewText: "text-white",
                 identityPreviewEditButtonIcon: "text-[#d95d39]"
               }
             }}
           />
        </div>

      </div>
    </div>
  );
};

export default Login;
