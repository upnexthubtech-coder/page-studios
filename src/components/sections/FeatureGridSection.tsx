export default function FeatureGridSection({ props }: { props: any }) {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">{props.title}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {props.items.map((item: any, i: number) => (
          <div key={i} className="p-6 border rounded-lg text-center">
            {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}