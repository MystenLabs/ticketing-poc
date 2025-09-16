import Image from "next/image";

export const Waves = () => {
  return (
    <Image
      src={"/waves.svg"}
      alt="waves"
      width={300}
      height={300}
      className="absolute top-[-90px]"
      style={{
        width: "100%",
        height: "379px",
        opacity: "0.5",
        background:
          "linear-gradient(180deg, #FFFFFF 3%, rgba(255, 255, 255, 0) 39%)",
        border: "0.3px solid",
        borderImageSource:
          "linear-gradient(200.97deg, #FFFFFF 34.24%, rgba(255, 255, 255, 0) 51.39%)",
      }}
    />
  );
};
