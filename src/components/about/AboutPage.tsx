import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Globe,
  Target,
  Sparkles,
  Github,
  Linkedin,
} from "lucide-react";
import { useScrollReveal } from "@/utils/useScrollReveal";
import { Footer } from "@/components/landing/Footer";

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your financial data stays yours. We use bank-level encryption and never sell your information to third parties.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Simplicity",
    description:
      "No bloated features or confusing dashboards. We focus on what matters — keeping your bills organized and paid on time.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Heart,
    title: "Empathy",
    description:
      "We've all been hit with late fees. MoneyScope is built by people who understand the frustration of missed payments.",
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Works on any device, any screen size. Everyone deserves tools to manage their finances effectively.",
    gradient: "from-sky-500 to-blue-500",
  },
];

const team = [
  {
    name: "Mir Sameer Irfan",
    role: "Founder & Lead Developer",
    initials: "MS",
    gradient: "from-emerald-500 to-teal-500",
    bio: "Full-stack developer passionate about building tools that make everyday finances simpler.",
    links: {
      github: "https://github.com/MirSameerIrfan",
      linkedin: "#",
    },
  },
];

const milestones = [
  {
    year: "2025",
    title: "Idea Born",
    description:
      "Frustrated by yet another late fee, the concept for MoneyScope was born.",
  },
  {
    year: "2025",
    title: "First Prototype",
    description:
      "Built the initial dashboard with credit card and loan tracking.",
  },
  {
    year: "2026",
    title: "Public Launch",
    description:
      "MoneyScope goes live with recurring bills, payment calendar, and smart reminders.",
  },
  {
    year: "2026",
    title: "Growing Community",
    description:
      "50K+ users trust MoneyScope to manage their payments every month.",
  },
];

export function AboutPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal({
    threshold: 0.1,
  });
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal({
    threshold: 0.08,
  });
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal({
    threshold: 0.1,
  });
  const { ref: teamRef, isVisible: teamVisible } = useScrollReveal({
    threshold: 0.1,
  });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({
    threshold: 0.15,
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative py-24 overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-150 h-150 rounded-full bg-emerald-200/20 blur-3xl animate-gentle-pulse"></div>
          <div
            className="absolute -bottom-1/3 -left-1/4 w-125 h-125 rounded-full bg-teal-200/20 blur-3xl animate-gentle-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Target className="w-4 h-4" />
            Our Mission
          </div>
          <h1
            className={`text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6 transition-all duration-700 delay-100 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Making bill management{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
              stress-free
            </span>
          </h1>
          <p
            className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            MoneyScope exists to eliminate late fees and the anxiety of managing
            multiple bills. We believe everyone deserves a clear picture of
            their financial obligations.
          </p>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              valuesVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              What we stand for
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every feature we build and every decision
              we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`feature-card group bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-200 ${
                    valuesVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: valuesVisible
                      ? `${index * 100 + 200}ms`
                      : "0ms",
                  }}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section
        ref={storyRef}
        className="py-24 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              storyVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Our journey
            </h2>
            <p className="text-xl text-gray-600">
              From a simple idea to a tool trusted by thousands.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500 hidden sm:block"></div>

            <div className="space-y-10">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex gap-8 items-start transition-all duration-700 ${
                    storyVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-6"
                  }`}
                  style={{
                    transitionDelay: storyVisible
                      ? `${index * 120 + 200}ms`
                      : "0ms",
                  }}
                >
                  {/* Dot */}
                  <div className="hidden sm:flex w-16 shrink-0 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 ring-4 ring-white shadow-md"></div>
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              teamVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Meet the builder
            </h2>
            <p className="text-xl text-gray-600">
              MoneyScope is built with care by a passionate developer.
            </p>
          </div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <div
                key={index}
                className={`bg-gray-50 rounded-2xl p-8 text-center max-w-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                  teamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: teamVisible ? "300ms" : "0ms" }}
              >
                <div
                  className={`w-20 h-20 mx-auto bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center shadow-lg mb-5`}
                >
                  <span className="text-2xl font-bold text-white">
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-emerald-600 mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex gap-3 justify-center">
                  <a
                    href={member.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={member.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles
            className={`w-10 h-10 text-emerald-200 mx-auto mb-6 transition-all duration-700 ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          />
          <h2
            className={`text-4xl sm:text-5xl font-black text-white mb-6 transition-all duration-700 delay-100 ${
              ctaVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Ready to get organized?
          </h2>
          <p
            className={`text-xl text-emerald-50 mb-10 transition-all duration-700 delay-200 ${
              ctaVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Join thousands who never miss a payment. It's free to get started.
          </p>
          <Link
            to="/auth/signup"
            className={`group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl delay-300 ${
              ctaVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
