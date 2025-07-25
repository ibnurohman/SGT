import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>
      <p className="mt-4 text-lg">This is a sample Next.js application.</p>
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        width={72}
        height={16}
        className="mt-8"
      />
    </main>
  );
}
