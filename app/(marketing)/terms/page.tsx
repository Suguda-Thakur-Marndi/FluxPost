"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-10 sm:p-14 border border-white/10 shadow-2xl space-y-8 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-4 pb-6 border-b border-border/30">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <FileText className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">Terms of Service</h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
              Last Updated: August 2026
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using Lemon.ai (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. User Accounts & Responsibilities</h2>
            <p>
              When creating an account, you agree to provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Acceptable Use Policy</h2>
            <p>
              You agree not to use the Service to publish, distribute, or schedule any content that:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Violates any applicable local, national, or international law or regulation.</li>
              <li>Infringes upon any copyright, trademark, trade secret, or intellectual property rights.</li>
              <li>Constitutes automated spam, malware, phishing, or abusive mass-messaging.</li>
              <li>Violates the terms of service or API developer policies of the connected social platforms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Subscriptions & Billing</h2>
            <p>
              Paid plans are billed on a recurring monthly or annual basis. You may cancel your subscription at any time through the Billing settings in your dashboard. Cancellations take effect at the end of the current billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, whether express or implied. While we endeavor to maintain 99.9% uptime, we do not guarantee uninterrupted or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Contact</h2>
            <p>
              For legal inquiries regarding these terms, please email <a href="mailto:legal@lemonai.media" className="text-primary hover:underline font-semibold">legal@lemonai.media</a>.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
