import Hero from "@/components/site/Hero";
import Idea1 from "@/components/site/Idea1";
import Idea2 from "@/components/site/Idea2";
import Act3 from "@/components/site/Act3";
import Close from "@/components/site/Close";

// "Tabby Pay": one page, two ideas (NOTES.md R1). Sections are added one at a
// time, each after Salman's review.
export default function Page() {
  return (
    <>
      <Hero />
      <Idea1 />
      <Idea2 />
      <Act3 />
      <Close />
    </>
  );
}
