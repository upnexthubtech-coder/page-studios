export default function HeroSection({ props }: { props: any }) {
  return (
    <section className="relative bg-gray-900 text-white py-20 px-4">
      {props.backgroundImage && (
        <img src={props.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{props.headline}</h1>
        {props.subheadline && <p className="text-xl">{props.subheadline}</p>}
      </div>
    </section>
  );
}