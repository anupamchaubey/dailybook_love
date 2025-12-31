import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEntryById, updateEntry } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import WritePost from "./WritePost";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => getEntryById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => updateEntry(id!, payload),
    onSuccess: () => {
      toast({ title: "Story updated successfully" });
      navigate(`/post/${id}`);
    },
  });

  if (isLoading) return <Layout>Loading…</Layout>;
  if (!data) return <Layout>Post not found</Layout>;

  return <WritePost editMode initialData={data} onSubmit={mutation.mutate} />;
}
