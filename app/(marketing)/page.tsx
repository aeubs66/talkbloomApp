'use client'

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    float: {
      y: [0, -10],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1, 
        delay: 0.5, 
        ease: [0.6, -0.05, 0.01, 0.99] 
      } 
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      y: -2,
      boxShadow: "0 10px 20px rgba(228, 113, 60, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.97,
      y: 2,
      boxShadow: "0 5px 10px rgba(228, 113, 60, 0.1)",
      transition: {
        duration: 0.1
      }
    },
    initial: {
      scale: 1,
      y: 0,
      boxShadow: "0 5px 15px rgba(228, 113, 60, 0.1)"
    }
  };

  return (
    <>
      {/* Solid background color */}
      <div className="fixed inset-0 -z-10 bg-[#F2F2F2]" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row overflow-hidden"
      >
        
        <motion.div
          variants={variants}
          animate="float"
          className="relative mb-8 h-[260px] w-[300px] lg:mb-0 lg:h-[404px] lg:w-[424px] transition-transform duration-500"
        >
          <Image src="/assets/hero.png" alt="Hero" fill style={{ objectFit: "contain" }} priority />
        </motion.div>

        <motion.div
          variants={contentVariants}
          className="flex flex-col items-center gap-y-8 z-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="max-w-[480px] text-center font-bold text-[#ff6b2b] lg:text-4xl text-2xl leading-tight"
          >
            Where every word is a step toward brilliance.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
            className="flex w-full max-w-[330px] flex-col items-center gap-y-4"
          >
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignUpButton
                  mode="modal"
                  afterSignInUrl="/learn"
                  afterSignUpUrl="/learn"
                >
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="w-full bg-[#ff6b2b] text-white transition-all duration-300 font-semibold relative overflow-hidden"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </SignUpButton>

                <SignInButton
                  mode="modal"
                  afterSignInUrl="/learn"
                  afterSignUpUrl="/learn"
                >
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full"
                  >
                    <Button 
                      size="lg" 
                      variant="primaryOutline" 
                      className="w-full border-2 border-[#ff6b2b] text-[#ff6b2b] transition-all duration-300 font-semibold"
                    >
                      I already have an account
                    </Button>
                  </motion.div>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full"
                >
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="w-full bg-[#ff6b2b] text-white shadow-lg shadow-orange-200/50 hover:shadow-orange-200/80 hover:opacity-90 transition-all duration-300 font-semibold" 
                    asChild
                  >
                    <Link href="/learn">Continue Learning</Link>
                  </Button>
                </motion.div>
              </SignedIn>
            </ClerkLoaded>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
