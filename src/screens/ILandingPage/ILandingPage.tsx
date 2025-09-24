import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

const howItWorksSteps = [
  {
    title: "Sign Up",
    subtitle: "Choose Your Course",
    image: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-6.png",
  },
  {
    title: "Enrol for the Courses",
    subtitle: "Secure Your Spot",
    image: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-7.png",
    overlayImage: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-8.png",
  },
  {
    title: "Start learning",
    subtitle: "Begin Your Journey",
    image: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-9.png",
  },
];

const testimonials = [
  {
    name: "Lorem M.A",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    avatar: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-13.png",
  },
  {
    name: "Ipsum O",
    text: "Lorem ipsum dolor sit amet.",
    avatar: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-13.png",
  },
  {
    name: "Sit A",
    text: "Lorem ipsum dolor sit amet, consectetur.",
    avatar: "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-12.png",
  },
];

const footerLinks = [
  { text: "Terms", href: "#" },
  { text: "Privacy", href: "#" },
  { text: "Help", href: "#" },
];

export const ILandingPage = (): JSX.Element => {
  return (
    <div className="bg-white min-h-screen w-full" data-model-id="160:1713">
      <div className="max-w-[1920px] mx-auto bg-[#f9f9f9] rounded-[20px] overflow-hidden">
        {/* Header Section */}
        <header className="bg-[#33a1cd] rounded-[30px] border border-white p-8 relative overflow-hidden">
          <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
            {/* Navigation */}
            <nav className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Tabs
                  defaultValue="home"
                  className="bg-[#f9f9f9] rounded-[40px] border border-white shadow-[0px_4px_4px_#00000040]"
                >
                  <TabsList className="bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="home"
                      className="bg-[#33a1cd] text-white border border-white rounded-[40px] px-16 py-8 text-4xl font-normal data-[state=active]:bg-[#33a1cd] data-[state=active]:text-white h-auto"
                    >
                      Home
                    </TabsTrigger>
                    <TabsTrigger
                      value="subscriptions"
                      className="bg-transparent text-black px-16 py-8 text-4xl font-normal data-[state=active]:bg-[#33a1cd] data-[state=active]:text-white h-auto"
                    >
                      Subscriptions
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="bg-[#f9f9f9] rounded-[30px] shadow-[0px_4px_4px_#00000040] px-12 py-4">
                <div className="flex flex-wrap items-center gap-8">
                  <Button
                    asChild
                    className="bg-[#dd7c5e] text-white text-4xl font-normal px-10 py-6 rounded-[30px] h-auto hover:bg-[#dd7c5e]/90"
                  >
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-black text-4xl font-normal p-0 h-auto hover:bg-transparent"
                  >
                    LOG IN
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-black text-4xl font-normal p-0 h-auto hover:bg-transparent"
                  >
                    SIGN UP
                  </Button>
                </div>
              </div>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-[64px] leading-normal">
                  Infoverse Digital-Ed
                </h1>
              </div>

              <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                <h2 className="[font-family:'Inria_Serif',Helvetica] font-bold text-white text-[70px] leading-normal">
                  Unlock a universe of knowledge. Your potential is waiting.
                </h2>
              </div>

              <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                <p className="[font-family:'Inter',Helvetica] font-normal text-white text-5xl leading-normal">
                  Your personalized path to exam success.
                </p>
              </div>

              <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
                <Button className="bg-[#dd7c5e] hover:bg-[#dd7c5e]/90 text-white text-4xl font-normal px-16 py-8 rounded-[30px] h-auto">
                  Explore Courses
                </Button>
              </div>
            </div>

            <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
              <img
                className="w-full max-w-[701px] h-auto rounded-[30px] object-cover"
                alt="Student studying"
                src="https://c.animaapp.com/mfbjddyn8jUtGn/img/pexels-leticia-alvares-1805702-30539351-edited-1.png"
              />
            </div>
          </div>
        </header>

        {/* How It Works Section */}
        <section className="py-16 px-8">
          <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <h2 className="text-center [font-family:'Inter',Helvetica] font-semibold text-black text-[80px] leading-normal mb-16">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`text-center translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:${400 + index * 200}ms]`}
              >
                <div className="bg-[#dd7c5e] rounded-[30px] w-[219px] h-[211px] mx-auto mb-6 flex items-center justify-center relative">
                  {step.overlayImage ? (
                    <div
                      className="relative w-[177px] h-[177px] bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${step.image})` }}
                    >
                      <img
                        className="w-[101px] h-[101px] absolute top-0 right-0 object-cover"
                        alt="Overlay"
                        src={step.overlayImage}
                      />
                    </div>
                  ) : step.image ===
                    "https://c.animaapp.com/mfbjddyn8jUtGn/img/image-9.png" ? (
                    <img
                      className="w-[180px] h-[180px] object-cover"
                      alt="Step icon"
                      src={step.image}
                    />
                  ) : (
                    <img
                      className="w-[173px] h-[173px] object-cover"
                      alt="Step icon"
                      src={step.image}
                    />
                  )}
                </div>
                <h3 className="[font-family:'Inter',Helvetica] font-semibold text-black text-5xl leading-normal mb-2">
                  {step.title}
                </h3>
                <p className="[font-family:'Inter',Helvetica] font-normal text-black text-5xl leading-normal text-center">
                  {step.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ready to Get that A Section */}
        <section className="py-16 px-8">
          <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <h2 className="text-center [font-family:'Inter',Helvetica] font-semibold text-black text-[80px] leading-normal mb-8">
              Ready to Get that A?
            </h2>
          </div>

          <div className="flex justify-center mb-8 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <img
              className="w-full max-w-[1583px] h-auto object-cover"
              alt="Success visualization"
              src="https://c.animaapp.com/mfbjddyn8jUtGn/img/image-10.png"
            />
          </div>

          <div className="text-center translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            <Button className="bg-[#dd7c5e] hover:bg-[#dd7c5e]/90 text-[#fffdfd] text-5xl font-normal px-16 py-8 rounded-[30px] h-auto">
              Sign Up Today
            </Button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-8">
          <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <h2 className="text-center [font-family:'Inter',Helvetica] font-semibold text-black text-[80px] leading-normal mb-4">
              What Learners Say
            </h2>
            <p className="text-center [font-family:'Inter',Helvetica] font-normal text-black text-4xl leading-normal mb-16">
              Trusted Voices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:${400 + index * 200}ms]`}
              >
                <Card className="bg-[#bdd0d2] border-none rounded-[30px] h-[259px] relative">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <p className="[font-family:'Inter',Helvetica] font-normal text-black text-3xl text-center leading-normal">
                      {testimonial.text}
                    </p>
                    <div className="text-center">
                      <p className="[font-family:'Inter',Helvetica] font-bold text-black text-[32px] leading-normal">
                        {testimonial.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-center mt-4">
                  <img
                    className="w-40 h-40 object-cover"
                    alt={`${testimonial.name} avatar`}
                    src={testimonial.avatar}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#33a1cd] rounded-[20px] p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex items-center gap-4">
              <img
                className="w-[117px] h-[117px] rounded-[56px] object-cover"
                alt="Company logo"
                src="https://c.animaapp.com/mfbjddyn8jUtGn/img/with-bg-1.png"
              />
            </div>

            <div className="flex-1">
              <div className="[font-family:'Inter',Helvetica] font-normal text-white text-[32px] leading-normal">
                United Kingdom: +447412858175
                <br />
                West Africa: +2349032840916
                <br />
                Email: info@infoversedigitaleducation.net
              </div>
            </div>

            <div className="flex gap-8">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="[font-family:'Inter',Helvetica] font-normal text-white text-4xl leading-normal hover:underline"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
