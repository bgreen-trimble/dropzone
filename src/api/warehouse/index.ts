import type { Query } from "@/utils/types";

const sofas = [
  "/dropzone/sofa/sofa-01.webp",
  "/dropzone/sofa/sofa-02.webp",
  "/dropzone/sofa/sofa-03.webp",
  "/dropzone/sofa/sofa-04.webp",
  "/dropzone/sofa/sofa-05.webp",
  "/dropzone/sofa/sofa-06.webp",
  "/dropzone/sofa/sofa-07.webp",
  "/dropzone/sofa/red-sofa-01.webp",
  "/dropzone/sofa/red-sofa-02.webp",
  "/dropzone/sofa/red-sofa-03.webp",
  "/dropzone/sofa/red-sofa-04.webp",
  "/dropzone/sofa/red-sofa-05.webp",
];

export const search = (query: Query): Promise<string[]> => {
  console.log("search api", query);
  const text = query.find((item) => item.type === "text/plain");
  const image = query.find((item) => item.type.startsWith("image/"));
  return new Promise(async (resolve) => {
    const request = {
      text: await text?.text(),
      image: await image?.arrayBuffer(),
    }

    console.log("search api request", request);

    // Shuffling array and picking 4 random sofas
    const shuffled = (request.text === 'red' ? sofas.filter((item) => item.includes('red')) : sofas).sort(() => 0.5 - Math.random());
    const randomSofas = shuffled.slice(0, 4);

    setTimeout(() => {
      resolve(randomSofas);
    }, 1000);
  });
}
