"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Message Received!",
      text: "Thank you for contacting BharaDei.com support. Our Dhaka team will respond shortly.",
      timer: 2200,
      showConfirmButton: false,
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-[var(--bg)]">
      <section className="bd-hero-bg border-b border-[var(--line)] py-14 md:py-20">
        <div className="bd-container max-w-3xl space-y-3">
          <p className="bd-eyebrow">Support &amp; Partnerships</p>
          <h1 className="bd-heading text-4xl sm:text-5xl">Contact Us</h1>
          <p className="text-base text-[var(--body)]">
            Have questions about a booking, owner verification, or enterprise
            equipment rentals? Reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="bd-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="bd-card p-6 space-y-4">
              <h2 className="bd-heading text-xl">Dhaka Headquarters</h2>
              <ul className="space-y-3 text-sm text-[var(--body)]">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--purple)] shrink-0 mt-0.5" />
                  <span>Road 11, Block F, Banani, Dhaka 1213, Bangladesh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[var(--purple)] shrink-0" />
                  <span>+880 1700-000000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[var(--purple)] shrink-0" />
                  <span>support@bharadei.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 bd-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Booking assistance, Owner onboarding, etc."
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>

              <button type="submit" className="bd-btn-primary text-sm">
                <Send size={15} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
