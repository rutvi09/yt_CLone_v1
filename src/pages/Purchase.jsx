import React, { useState } from "react";
import {
  Crown,
  PlayCircle,
  Download,
  Music2,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
const Purchase = () => {
    const [selectedPlan, setSelectedPlan] = useState("monthly");

const [coupon, setCoupon] = useState("");

const [paymentMethod, setPaymentMethod] = useState("upi");

const [loading, setLoading] = useState(false);

const [paymentSuccess, setPaymentSuccess] = useState(false);

const handlePayment = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    setPaymentSuccess(true);
  }, 2000);
};
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">

      {/* Background Effects */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/20 blur-[180px] rounded-full" />

      <div className="absolute right-0 top-40 w-96 h-96 bg-purple-600/20 blur-[180px] rounded-full" />

      {/* Hero */}

      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-2 rounded-full mb-8">

              <Crown className="text-yellow-400" size={22} />

              <span className="font-medium">
                Premium Membership
              </span>

            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">

              Stream

              <span className="text-red-500">
                {" "}Without{" "}
              </span>

              Limits.

            </h1>

            <p className="text-gray-400 text-lg mt-8 leading-8 max-w-xl">

              Unlock ad-free entertainment, background playback,
              offline downloads and premium viewing experience
              across all your favorite videos.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-semibold text-white flex items-center gap-2 transition">

                Get Premium

                <ArrowRight size={20} />

              </button>

              <button className="border border-white/20 hover:border-white px-8 py-4 rounded-2xl transition">

                Learn More

              </button>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-14">

              <div>

                <h2 className="text-4xl font-bold">
                  100M+
                </h2>

                <p className="text-gray-500 mt-2">
                  Premium Users
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-bold">
                  4K
                </h2>

                <p className="text-gray-500 mt-2">
                  Ultra HD
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-bold">
                  24/7
                </h2>

                <p className="text-gray-500 mt-2">
                  Entertainment
                </p>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="relative">

            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl">

              <div className="aspect-video rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center">

                <PlayCircle size={90} />

              </div>

              <div className="grid grid-cols-2 gap-5 mt-6">

                <div className="bg-white/5 rounded-2xl p-5">

                  <Download className="text-red-500 mb-3" />

                  <h3 className="font-semibold">
                    Offline
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Save videos and watch anywhere.
                  </p>

                </div>

                <div className="bg-white/5 rounded-2xl p-5">

                  <Music2 className="text-red-500 mb-3" />

                  <h3 className="font-semibold">
                    Background
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Continue playing while multitasking.
                  </p>

                </div>

                <div className="bg-white/5 rounded-2xl p-5">

                  <Sparkles className="text-red-500 mb-3" />

                  <h3 className="font-semibold">
                    Premium
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Unlock exclusive experiences.
                  </p>

                </div>

                <div className="bg-white/5 rounded-2xl p-5">

                  <Crown className="text-yellow-400 mb-3" />

                  <h3 className="font-semibold">
                    Member
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Enjoy uninterrupted streaming.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* ================= FEATURES SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">

        <div className="text-center">

          <span className="text-red-500 uppercase tracking-[0.3em] text-sm font-semibold">
            Why Premium
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black mt-5">
            Everything You Need
            <br />
            In One Membership
          </h2>

          <p className="text-gray-400 mt-8 max-w-3xl mx-auto text-lg leading-8">
            Upgrade your entertainment experience with powerful features
            designed for uninterrupted watching, listening and downloading.
          </p>

        </div>

        {/* Feature Cards */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">

          {[
            {
              icon: <PlayCircle size={38} />,
              title: "Ad-Free Streaming",
              desc: "Enjoy every video without interruptions or distracting advertisements.",
            },
            {
              icon: <Download size={38} />,
              title: "Offline Downloads",
              desc: "Save videos to your device and watch them anytime, anywhere.",
            },
            {
              icon: <Music2 size={38} />,
              title: "Background Playback",
              desc: "Keep listening while using other apps or when your screen is locked.",
            },
            {
              icon: <Sparkles size={38} />,
              title: "Premium Quality",
              desc: "Experience smoother playback and high-quality streaming.",
            },
            {
              icon: <Crown size={38} />,
              title: "Exclusive Benefits",
              desc: "Unlock early access to upcoming premium features and experiences.",
            },
            {
              icon: <Download size={38} />,
              title: "Unlimited Access",
              desc: "Watch your favorite content across all devices without limits.",
            },
          ].map((feature, index) => (

            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-red-500 transition-all duration-500 hover:-translate-y-2"
            >

              <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">

                {feature.icon}

              </div>

              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {feature.desc}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= PREMIUM EXPERIENCE ================= */}

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}

          <div>

            <span className="text-red-500 font-semibold uppercase tracking-[0.3em]">
              Premium Experience
            </span>

            <h2 className="text-3xl sm:text-5xl font-black mt-6 leading-tight">
              Watch Smarter.
              <br />
              Listen Better.
            </h2>

            <p className="text-gray-400 text-lg mt-8 leading-8">

              Premium gives you a seamless experience across every screen.
              Whether you're watching tutorials, music, gaming or movies,
              everything feels faster, cleaner and distraction free.

            </p>

            <div className="space-y-6 mt-10">

              {[
                "No Ads while watching videos",
                "Offline Downloads on supported devices",
                "Background Play for music & podcasts",
                "Priority access to premium features",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">

                    <Check size={18} />

                  </div>

                  <span className="text-lg">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Right */}

          <div className="relative">

            <div className="absolute inset-0 bg-red-600/20 blur-[120px]" />

            <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-[40px] border border-white/10 p-10">

              <div className="space-y-6">

                <div className="bg-white text-black rounded-2xl p-6">

                  <div className="flex justify-between items-center">

                    <div>

                      <h4 className="font-bold text-xl">
                        Streaming Quality
                      </h4>

                      <p className="text-gray-400 mt-2">
                        Crystal clear playback
                      </p>

                    </div>

                    <span className="text-green-400 font-bold">
                      4K
                    </span>

                  </div>

                </div>

                <div className="bg-white text-black rounded-2xl p-6">

                  <div className="flex justify-between items-center">

                    <div>

                      <h4 className="font-bold text-xl">
                        Downloads
                      </h4>

                      <p className="text-gray-400 mt-2">
                        Unlimited Offline Access
                      </p>

                    </div>

                    <span className="text-red-400 font-bold">
                      ∞
                    </span>

                  </div>

                </div>

                <div className="bg-white text-black rounded-2xl p-6">

                  <div className="flex justify-between items-center">

                    <div>

                      <h4 className="font-bold text-xl">
                        Background Play
                      </h4>

                      <p className="text-gray-400 mt-2">
                        Keep listening anytime
                      </p>

                    </div>

                    <span className="text-yellow-400 font-bold">
                      ON
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* ================= PLANS SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">

        <div className="text-center">

          <span className="uppercase tracking-[0.3em] text-red-500 font-semibold text-sm">
            Choose Your Plan
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mt-5">
            Flexible Plans
            <br />
            For Everyone
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto mt-8 text-lg leading-8">
            Select the membership that best matches your viewing habits.
            Upgrade anytime with no long-term commitment.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {[
            {
              id: "monthly",
              title: "Monthly",
              price: "₹199",
              subtitle: "Perfect for trying Premium",
              badge: "",
              features: [
                "Ad-free streaming",
                "Offline downloads",
                "Background play",
                "Premium quality",
              ],
            },
            {
              id: "yearly",
              title: "Yearly",
              price: "₹1,999",
              subtitle: "Best value for regular viewers",
              badge: "Most Popular",
              features: [
                "Everything in Monthly",
                "Priority support",
                "Exclusive features",
                "Save more every year",
              ],
            },
            {
              id: "family",
              title: "Family",
              price: "₹299",
              subtitle: "Share with up to 5 members",
              badge: "",
              features: [
                "Multiple profiles",
                "Family sharing",
                "Background play",
                "Offline downloads",
              ],
            },
          ].map((plan) => (

            <div
              key={plan.id}
              className={`relative rounded-3xl border transition-all duration-500 cursor-pointer p-8
              ${
                selectedPlan === plan.id
                  ? "border-red-500 bg-white/10 scale-105 shadow-2xl"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >

              {plan.badge && (

                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 px-5 py-2 rounded-full text-sm font-semibold">

                  {plan.badge}

                </div>

              )}

              <h3 className="text-3xl font-bold">
                {plan.title}
              </h3>

              <p className="text-gray-400 mt-2">
                {plan.subtitle}
              </p>

              <div className="mt-8">

                <span className="text-5xl font-black">
                  {plan.price}
                </span>

                <span className="text-gray-500 ml-2">
                  / month
                </span>

              </div>

              <div className="space-y-4 mt-10">

                {plan.features.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">

                      <Check size={15} />

                    </div>

                    <span>
                      {item}
                    </span>

                  </div>

                ))}

              </div>

              <button
                className={`w-full mt-10 py-4 rounded-2xl font-semibold transition
                ${
                  selectedPlan === plan.id
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {selectedPlan === plan.id
                  ? "Selected"
                  : "Choose Plan"}
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* ================= ORDER SUMMARY ================= */}

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Coupon */}

          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold ">
              Have a Promo Code?
            </h2>

            <p className="text-gray-400 mt-3">
              Apply a promotional code before checkout.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-8">

              <input
                type="text"
                placeholder="Enter promo code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
              />

              <button
                className="bg-red-600 hover:bg-red-700 px-8 rounded-2xl font-semibold transition"
              >
                Apply
              </button>

            </div>

          </div>

          {/* Summary */}

          <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-5 mt-8">

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Membership
                </span>

                <span className="font-semibold capitalize">
                  {selectedPlan}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Tax
                </span>

                <span>
                  Included
                </span>

              </div>

              <hr className="border-white/10" />

              <div className="flex justify-between text-2xl font-bold">

                <span>Total</span>

                <span className="text-red-500">
                  {selectedPlan === "monthly"
                    ? "₹199"
                    : selectedPlan === "yearly"
                    ? "₹1,999"
                    : "₹299"}
                </span>

              </div>

            </div>

            <button className="w-full mt-10 bg-red-600 hover:bg-red-700 rounded-2xl py-4 text-lg font-semibold transition-all duration-300">

              Continue to Checkout →

            </button>

          </div>

        </div>

      </section>
            {/* ================= CHECKOUT SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold">
              Payment Method
            </h2>

            <p className="text-gray-400 mt-2">
              Choose your preferred payment option.
            </p>

            <div className="space-y-5 mt-8">

              {[
                {
                  id: "upi",
                  title: "UPI",
                  subtitle: "Google Pay, PhonePe, Paytm"
                },
                {
                  id: "card",
                  title: "Credit / Debit Card",
                  subtitle: "Visa, Mastercard, RuPay"
                },
                {
                  id: "bank",
                  title: "Net Banking",
                  subtitle: "All major banks"
                },
              ].map((item) => (

                <label
                  key={item.id}
                  className={`flex items-center justify-between rounded-2xl border p-5 cursor-pointer transition ${
                    paymentMethod === item.id
                      ? "border-red-500 bg-red-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >

                  <div>

                    <h3 className="font-semibold text-lg">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      {item.subtitle}
                    </p>

                  </div>

                  <input
                    type="radio"
                    checked={paymentMethod === item.id}
                    onChange={() => setPaymentMethod(item.id)}
                  />

                </label>

              ))}

            </div>

          </div>

          {/* Right */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold">
              Billing Details
            </h2>

            <p className="text-gray-400 mt-2">
              Enter your information below.
            </p>

            <div className="space-y-5 mt-8">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/10   border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
              />

              {paymentMethod === "card" && (

                <>

                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                    />

                    <input
                      type="password"
                      placeholder="CVV"
                      className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                    />

                  </div>

                </>

              )}

            </div>

          </div>

        </div>

        {/* Checkout Button */}

        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8">

          <div>

            <h2 className="text-3xl font-bold">
              Ready to Upgrade?
            </h2>

            <p className="text-red-100 mt-2">
              Secure checkout • Cancel anytime • Instant activation
            </p>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-2xl font-bold text-lg transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Complete Purchase"}
          </button>

        </div>

      </section>
            {/* ================= FAQ SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[0.3em] text-red-500 text-sm font-semibold">
            Frequently Asked Questions
          </span>

          <h2 className="text-3xl sm:text-5xl font-black mt-6">
            Everything You Need
            <br />
            To Know
          </h2>

        </div>

        <div className="space-y-6">

          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes. Your membership can be cancelled whenever you want. Your premium benefits remain active until the current billing period ends.",
            },
            {
              q: "Does Premium remove advertisements?",
              a: "Yes. Premium members enjoy uninterrupted streaming across supported content.",
            },
            {
              q: "Can I download videos?",
              a: "Absolutely. Download supported videos and watch them later even when you're offline.",
            },
            {
              q: "Does Premium support background play?",
              a: "Yes. Continue listening while using other apps or when your device is locked.",
            },
          ].map((faq, index) => (

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-red-500 transition"
            >

              <h3 className="text-xl font-bold">
                {faq.q}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {faq.a}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= SUCCESS MODAL ================= */}

      {paymentSuccess && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-md rounded-3xl bg-white border border-white/10 p-10 text-center shadow-2xl">

            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">

              <Check
                size={55}
                className="text-green-400"
              />

            </div>

            <h2 className="text-4xl font-black mt-8">
              Payment Successful
            </h2>

            <p className="text-gray-400 mt-5 leading-7">

              Congratulations!

              <br />

              Your Premium membership has been activated successfully.

            </p>

            <div className="bg-white/5 rounded-2xl mt-8 p-6 text-left space-y-4">

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Membership
                </span>

                <span className="capitalize">
                  {selectedPlan}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Payment
                </span>

                <span className="uppercase">
                  {paymentMethod}
                </span>

              </div>

              <div className="flex justify-between font-bold">

                <span>
                  Status
                </span>

                <span className="text-green-400">
                  Active
                </span>

              </div>

            </div>

            <button
              onClick={() => setPaymentSuccess(false)}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 rounded-2xl py-4 font-semibold transition"
            >

              Continue Watching

            </button>

          </div>

        </div>

      )}

    </div>

  );

};

export default Purchase;