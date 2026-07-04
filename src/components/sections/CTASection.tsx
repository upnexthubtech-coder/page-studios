export default function CTASection({ props }: { props: any }) {
  const isSecondary = props.style === 'secondary';

  return (
    <section className="py-16 px-4 text-center">
      <a
        href={props.url}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 ${
          isSecondary
            ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {props.label}
      </a>
    </section>
  );
}