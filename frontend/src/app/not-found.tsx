import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center py-20">
      <div className="container-tirdo text-center">
        <div className="text-7xl font-black text-primary/20">404</div>
        <h1 className="mt-2 text-2xl font-bold text-primary">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          The page you are looking for may have been moved or no longer exists.
        </p>
        <ButtonLink href="/" variant="accent" className="mt-6">Back to home</ButtonLink>
      </div>
    </section>
  );
}
