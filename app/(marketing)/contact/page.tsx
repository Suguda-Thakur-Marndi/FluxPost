"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been received.");
    }, 800);
  };

  return (
    <div className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-2 text-sm font-medium border border-border/60 mb-6"
        >
          <Sparkles className="size-4 text-primary animate-pulse" />
          <span className="text-foreground/80">Get in Touch</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black tracking-tight leading-tight"
        >
          We’d love to <span className="text-gradient">hear from you</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-muted-foreground font-medium text-base"
        >
          Have a question, feedback, or feature request? Send us a message and our team will get back to you within 24 hours.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-foreground">Contact Details</h3>

            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Us</p>
                <p className="text-sm font-semibold text-foreground mt-1">support@lemonai.media</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Community & Discord</p>
                <p className="text-sm font-semibold text-foreground mt-1">discord.gg/lemonai</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3 glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl"
        >
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                Thank you for reaching out. A support specialist will review your message and reply shortly.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Name <span className="text-primary">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl bg-muted/20 border-white/10 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Email <span className="text-primary">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl bg-muted/20 border-white/10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Subject
                </label>
                <Input
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="rounded-xl bg-muted/20 border-white/10 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Message <span className="text-primary">*</span>
                </label>
                <Textarea
                  required
                  rows={5}
                  placeholder="Tell us what you're working on or need help with..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="rounded-xl bg-muted/20 border-white/10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 text-base"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
