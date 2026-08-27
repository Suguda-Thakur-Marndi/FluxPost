"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-10 sm:p-14 border border-white/10 shadow-2xl space-y-8 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-4 pb-6 border-b border-border/30">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Shield className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">Privacy Policy</h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
              Last Updated: August 2026
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Overview</h2>
            <p>
              Lemon.ai (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and handle your data when you use our social media scheduling platform, websites, and associated services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, connecting social media accounts, and drafting posts:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li><strong>Account Information:</strong> Name, email address, and authentication identifiers provided through Clerk.</li>
              <li><strong>Social Media Credentials:</strong> OAuth tokens received from authorized platforms (e.g., Twitter, LinkedIn, Instagram). All tokens are encrypted at rest using AES-256.</li>
              <li><strong>Content & Media:</strong> Post copy, scheduled timestamps, uploaded images, and idea board notes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. How We Use Your Information</h2>
            <p>
              We use the collected information exclusively to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Provide, maintain, and execute social media scheduling and publishing services.</li>
              <li>Generate AI-assisted post variations and suggestions upon your explicit request.</li>
              <li>Refresh expired authorization tokens to maintain scheduled publishing queues.</li>
              <li>Communicate platform updates and customer support responses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Data Security</h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards. All sensitive API credentials and refresh tokens are encrypted using AES-256 prior to storage in our PostgreSQL database protected by Row-Level Security (RLS).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Third-Party Services</h2>
            <p>
              Our application integrates with official developer APIs from Twitter/X, LinkedIn, Meta (Facebook, Instagram, Threads), Google/YouTube, and Bluesky. Your interaction with these third-party platforms is governed by their respective terms of service and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact us at <a href="mailto:privacy@lemonai.media" className="text-primary hover:underline font-semibold">privacy@lemonai.media</a>.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
