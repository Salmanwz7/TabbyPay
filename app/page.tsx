import Hero from "@/components/site/Hero";
import Act1 from "@/components/site/Act1";

// One page, three acts (spec §0.1). Sections are added one at a time, each
// after Salman's review.
export default function Page() {
  return (
    <>
      <Hero />
      <Act1 />
    </>
  );
}
