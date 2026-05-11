import { getCategories } from "@/lib/supabase/queries";
import { PostForm } from "./post-form";

export const dynamic = "force-dynamic";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const categories = await getCategories();
  return (
    <PostForm categories={categories} preselectedCategorySlug={sp.category} />
  );
}
