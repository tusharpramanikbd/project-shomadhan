const HomePage = () => {
  return (
    <div className="flex flex-col bg-base-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Turning Problems Into
            <span className="text-primary"> Solutions</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto">
            Shomadhan connects people with the right solutions. Post your
            problem, get trusted responses, and resolve issues faster than ever.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/signup"
              className="btn btn-primary px-8 rounded-full text-base"
            >
              Get Started Free
            </a>
            <a
              href="/login"
              className="btn btn-outline px-8 rounded-full text-base"
            >
              Login
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-10 border-y bg-base-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-wider text-base-content/60 mb-6">
            Trusted by growing communities
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-base-content/50 font-semibold text-lg">
            <span>Developers</span>
            <span>Students</span>
            <span>Professionals</span>
            <span>Local Communities</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need To Solve Problems Faster
          </h2>
          <p className="mt-4 text-base-content/70 max-w-2xl mx-auto">
            Built with simplicity, speed, and trust in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-8 rounded-2xl bg-base-200 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Post Easily</h3>
            <p className="text-base-content/70">
              Describe your issue clearly and reach the right audience
              instantly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-base-200 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
            <p className="text-base-content/70">
              Connect with people who have the expertise to help.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-base-200 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Verified Solutions</h3>
            <p className="text-base-content/70">
              Choose the best response and resolve issues with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION SECTION */}
      <section className="bg-base-200 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop Searching. Start Solving.
            </h2>
            <p className="text-base-content/70 mb-6">
              Traditional platforms overwhelm you with noise. Shomadhan focuses
              on clarity, relevance, and meaningful solutions.
            </p>

            <ul className="space-y-3 text-base-content/80">
              <li>✔ Focused problem posting</li>
              <li>✔ Community-driven responses</li>
              <li>✔ Simple & intuitive experience</li>
            </ul>
          </div>

          <div className="bg-base-100 p-10 rounded-3xl shadow-xl">
            <h4 className="text-lg font-semibold mb-4">Example Workflow</h4>
            <ol className="space-y-3 text-base-content/70">
              <li>1. Create an account</li>
              <li>2. Post your issue</li>
              <li>3. Receive responses</li>
              <li>4. Choose your Shomadhan</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join The Movement Toward Better Solutions
        </h2>

        <p className="text-base-content/70 mb-10 max-w-xl mx-auto">
          Create your free account today and start solving problems smarter.
        </p>

        <a href="/signup" className="btn btn-primary btn-lg rounded-full px-10">
          Create Free Account
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm text-base-content/60">
        © {new Date().getFullYear()} Shomadhan. Built for problem solvers.
      </footer>
    </div>
  );
};

export default HomePage;
