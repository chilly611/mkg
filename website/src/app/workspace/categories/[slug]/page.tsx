import { redirect } from "next/navigation";

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // The feed page already handles ?category=… filtering — redirect there.
  redirect(`/workspace/posts?category=${slug}`);
}
