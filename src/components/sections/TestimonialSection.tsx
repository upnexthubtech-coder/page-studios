export default function TestimonialSection({ props }: { props: any }) {
  return (
    <section className="py-16 px-4 bg-gray-100 text-center">
      <blockquote className="max-w-2xl mx-auto text-xl italic mb-4">“{props.quote}”</blockquote>
      <cite className="font-semibold">— {props.author}{props.role ? `, ${props.role}` : ''}</cite>
    </section>
  );
}