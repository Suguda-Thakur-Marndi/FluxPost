"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    }, 600);
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold rounded-full border-border bg-card">
          Get in Touch
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          We’d love to hear from you.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Have a question about scheduling limits, custom enterprise workflows, or social channel integrations? Send our team a note.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-4">
          <Card className="surface-card p-6 shadow-2xs">
            <CardContent className="p-0 space-y-5">
              <h3 className="text-base font-bold text-foreground">Direct Support</h3>

              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Support</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">support@mediascheduler.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Community Hub</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">community.mediascheduler.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-3 surface-card p-6 sm:p-8 shadow-2xs">
          <CardContent className="p-0">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Message Dispatched!</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A platform specialist will review your inquiry and reply within one business day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 font-semibold text-xs h-9 rounded-lg"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Name <span className="text-primary">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-lg h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Work Email <span className="text-primary">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-lg h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Subject
                  </label>
                  <Input
                    placeholder="Inquiry or partnership topic"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="rounded-lg h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Message <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="Tell us about your team or question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-lg text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs shadow-xs"
                >
                  {loading ? (
                    "Sending Message..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-1.5 size-3.5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
