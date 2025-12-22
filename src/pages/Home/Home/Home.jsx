import Banner from "../Banner/Banner";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Heading */}
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome to <span className="text-green-600">AssetVerse</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Manage, track, and grow your assets with confidence
        </p>
      </section>

      {/* Banner Section */}
      <section>
        <Banner onClickButton={() => console.log("Button clicked")} />
      </section>
    </main>
  );
}
