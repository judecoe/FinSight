import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "../src/components/ui";

export default function Home() {
  const { data: session, status } = useSession();

  // Enhanced scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("animate-fadeInDown");
          }, index * 150);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".scroll-animation");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      title: "Real-time Bank Data",
      description:
        "Connect your accounts and see real-time balances and transactions",
      icon: "💳",
    },
    {
      title: "Smart Analytics",
      description:
        "Automatic categorization and spending insights to help you save",
      icon: "📊",
    },
    {
      title: "Secure & Private",
      description:
        "Bank-level security with 256-bit encryption to protect your data",
      icon: "🔒",
    },
  ];

  return (
    <>
      <Head>
        <title>FinSight - Take Control of Your Money</title>
        <meta
          name="description"
          content="A modern, secure finance dashboard to track your spending, manage budgets, and achieve your financial goals."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-white">
                  FinSight
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/link-bank"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Link Bank
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center scroll-animation opacity-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Take Control of Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect your bank accounts, track spending, and make smarter
              financial decisions with our secure, intelligent finance
              dashboard.
            </p>

            {session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/link-bank"
                  className="bg-gray-800 text-blue-400 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Connect Bank Account
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Get Started Free
                </Link>
                <a
                  href="#features"
                  className="bg-gray-800 text-blue-400 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Learn More
                </a>
              </div>
            )}
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 scroll-animation opacity-0">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-6xl mx-auto">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gray-800 p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
                      <span className="text-white text-sm font-medium">
                        FinSight Dashboard
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs">Total Balance</p>
                          <p className="text-white text-xl font-bold">
                            $24,758.50
                          </p>
                        </div>
                        <div className="h-8 w-8 bg-green-600/20 rounded-full flex items-center justify-center">
                          <span className="text-green-400 text-xs">↗</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs">
                            Monthly Spending
                          </p>
                          <p className="text-white text-xl font-bold">
                            $3,245.20
                          </p>
                        </div>
                        <div className="h-8 w-8 bg-red-600/20 rounded-full flex items-center justify-center">
                          <span className="text-red-400 text-xs">↗</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs">Savings Goal</p>
                          <p className="text-white text-xl font-bold">68%</p>
                        </div>
                        <div className="h-8 w-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 text-xs">⭯</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Preview */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white text-sm font-medium mb-3">
                      Spending Overview
                    </h3>
                    <div className="h-32 bg-gray-900 rounded flex items-end justify-around p-2 space-x-1">
                      <div className="bg-blue-500 w-4 h-16 rounded-t"></div>
                      <div className="bg-blue-500 w-4 h-12 rounded-t"></div>
                      <div className="bg-blue-500 w-4 h-20 rounded-t"></div>
                      <div className="bg-blue-500 w-4 h-8 rounded-t"></div>
                      <div className="bg-blue-500 w-4 h-24 rounded-t"></div>
                      <div className="bg-blue-500 w-4 h-14 rounded-t"></div>
                      <div className="bg-blue-500 w-4 h-18 rounded-t"></div>
                    </div>
                  </div>

                  {/* Recent Transactions Preview */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white text-sm font-medium mb-3">
                      Recent Transactions
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-green-600 rounded-full text-xs text-white flex items-center justify-center">
                            S
                          </div>
                          <span className="text-gray-300 text-xs">
                            Starbucks Coffee
                          </span>
                        </div>
                        <span className="text-red-400 text-xs">-$5.49</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-blue-600 rounded-full text-xs text-white flex items-center justify-center">
                            U
                          </div>
                          <span className="text-gray-300 text-xs">
                            Uber Ride
                          </span>
                        </div>
                        <span className="text-red-400 text-xs">-$12.30</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-green-600 rounded-full text-xs text-white flex items-center justify-center">
                            +
                          </div>
                          <span className="text-gray-300 text-xs">
                            Salary Deposit
                          </span>
                        </div>
                        <span className="text-green-400 text-xs">
                          +$2,500.00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section id="features" className="mt-24">
            <div className="text-center mb-16 scroll-animation opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything You Need to Manage Your Money
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Powerful features designed to help you understand and optimize
                your financial life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center scroll-animation opacity-0 hover:shadow-lg hover:border-gray-600 transition-all"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-24 text-center scroll-animation opacity-0">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Financial Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who have taken control of their
                finances.
              </p>
              {session ? (
                <Link
                  href="/dashboard"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-block"
                >
                  Open Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-block"
                >
                  Sign Up Today
                </Link>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <span className="ml-2 text-xl font-bold">FinSight</span>
                </div>
                <p className="text-gray-400 max-w-md">
                  Empowering you to make better financial decisions with secure,
                  intelligent tools and insights.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/dashboard" className="hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/link-bank" className="hover:text-white">
                      Connect Bank
                    </Link>
                  </li>
                  <li>
                    <a href="#features" className="hover:text-white">
                      Features
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 FinSight. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
