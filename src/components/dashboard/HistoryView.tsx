import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Copy, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { HistorySkeleton } from "./Skeletons";
import { supabase } from "@/integrations/supabase/client";
import type { OutputKind } from "@/lib/repurpose-prompts";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

type HistoryRow = {
  id: string;
  input_text: string;
  content_type: string | null;
  linkedin_output: string | null;
  thread_output: string | null;
  carousel_output: string | null;
  hook_output: string | null;
  created_at: string | null;
};

const outputMeta: {
  key: OutputKind;
  field: keyof HistoryRow;
  label: string;
  badge: string;
  pill: string;
}[] = [
  {
    key: "linkedin",
    field: "linkedin_output",
    label: "💼 LinkedIn",
    badge: "💼 LinkedIn",
    pill: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
  },
  {
    key: "thread",
    field: "thread_output",
    label: "𝕏 X Thread",
    badge: "𝕏 X Thread",
    pill: "bg-[#F9FAFB] text-[#111827] border-[#E5E7EB]",
  },
  {
    key: "carousel",
    field: "carousel_output",
    label: "📸 Instagram",
    badge: "📸 Instagram",
    pill: "bg-[#FDF2F8] text-[#9D174D] border-[#FBCFE8]",
  },
  {
    key: "hook",
    field: "hook_output",
    label: "⚡ Hook",
    badge: "⚡ Hook",
    pill: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  },
];

function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeTime(value: string | null) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.round(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function availableOutputs(row: HistoryRow) {
  return outputMeta.filter((meta) => Boolean(row[meta.field]));
}

function useDebounced(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function HistoryView({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<HistoryRow | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryKey = ["history", userId] as const;

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repurpose_history")
        .select(
          "id, input_text, content_type, linkedin_output, thread_output, carousel_output, hook_output, created_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HistoryRow[];
    },
  });

  const rows = data ?? [];

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.input_text.toLowerCase().includes(term));
  }, [rows, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("repurpose_history").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<HistoryRow[]>(queryKey);
      queryClient.setQueryData<HistoryRow[]>(queryKey, (old) =>
        (old ?? []).filter((row) => row.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success("🗑️ Repurpose deleted");
    },
    onError: (error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(error instanceof Error ? error.message : "Could not delete. Try again.");
    },
  });

  function requestDelete(id: string) {
    setConfirmId(id);
  }

  function confirmDelete() {
    if (!confirmId) return;
    deleteMutation.mutate(confirmId);
    if (detail?.id === confirmId) setDetail(null);
    setConfirmId(null);
  }

  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <p className="mt-1 text-[15px] text-gray-muted">
        All your repurposed content in one place
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-[20px] bg-[#F5F0FF] px-3 py-1 text-[13px] font-semibold text-brand">
          {rows.length} total repurpose{rows.length === 1 ? "" : "s"}
        </span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="🔍 Search your history..."
          aria-label="Search your history"
          className="h-10 w-full max-w-[280px] rounded-[10px] border border-[#E9E8FF] bg-paper px-3 text-[14px] text-ink outline-none placeholder:text-gray-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-[15px] text-gray-muted">
          No repurposes match “{debouncedSearch}”.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {visible.map((row) => (
              <HistoryCard
                key={row.id}
                row={row}
                onView={() => setDetail(row)}
                onDelete={() => requestDelete(row.id)}
                confirming={confirmId === row.id}
                onCancelDelete={() => setConfirmId(null)}
                onConfirmDelete={confirmDelete}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-[14px] text-gray-muted">
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} repurposes
            </p>
            <div className="flex items-center gap-2">
              <PagerButton
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Prev
              </PagerButton>
              <PagerButton
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </PagerButton>
            </div>
          </div>
        </>
      )}

      {detail ? (
        <DetailModal
          row={detail}
          onClose={() => setDetail(null)}
          onDelete={() => requestDelete(detail.id)}
          confirming={confirmId === detail.id}
          onCancelDelete={() => setConfirmId(null)}
          onConfirmDelete={confirmDelete}
        />
      ) : null}
    </div>
  );
}

function PagerButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-9 rounded-[10px] border px-4 text-[14px] font-semibold transition",
        disabled
          ? "cursor-not-allowed border-[#E9E8FF] text-gray-muted/60"
          : "border-brand/40 text-brand hover:bg-[#F5F0FF]",
      )}
    >
      {children}
    </button>
  );
}

function DeleteConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
      <p className="text-[13px] font-medium text-red-700">
        Delete this repurpose? This cannot be undone.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="relative rounded-lg border border-[#E9E8FF] bg-paper px-3 text-[13px] font-semibold text-ink transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)] active:scale-[0.97] p-1"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="relative rounded-lg bg-red-600 px-3 text-[13px] font-semibold text-white hover:bg-red-700 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)] transition-all duration-200 active:scale-[0.97] p-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function HistoryCard({
  row,
  onView,
  onDelete,
  confirming,
  onCancelDelete,
  onConfirmDelete,
}: {
  row: HistoryRow;
  onView: () => void;
  onDelete: () => void;
  confirming: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const words = countWords(row.input_text);
  const preview =
    row.input_text.length > 120 ? `${row.input_text.slice(0, 120)}...` : row.input_text;

  return (
    <article className="card-hover-sm rounded-2xl border border-[#E9E8FF] bg-paper p-5 shadow-[0_2px_8px_rgba(108,58,232,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_4px_16px_rgba(108,58,232,0.1)]">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[14px] font-bold text-ink">{formatDate(row.created_at)}</p>
        <p className="text-[13px] text-gray-muted">{relativeTime(row.created_at)}</p>
      </div>

      <p className="my-3 text-[15px] leading-[1.5] text-[#374151]">{preview}</p>

      <div className="flex flex-wrap gap-2">
        {availableOutputs(row).map((meta) => (
          <span
            key={meta.key}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] font-semibold",
              meta.pill,
            )}
          >
            {meta.badge}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[13px] text-gray-muted">📄 {words} words</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onView}
            className="h-8 rounded-lg border border-brand/40 px-3 text-[13px] font-semibold text-brand transition hover:bg-[#F5F0FF]"
          >
            View
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-8 rounded-lg px-3 text-[13px] font-semibold text-gray-muted transition hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {confirming ? (
        <DeleteConfirm onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
      ) : null}
    </article>
  );
}

function DetailModal({
  row,
  onClose,
  onDelete,
  confirming,
  onCancelDelete,
  onConfirmDelete,
}: {
  row: HistoryRow;
  onClose: () => void;
  onDelete: () => void;
  confirming: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const outputs = availableOutputs(row);
  const [tab, setTab] = useState<OutputKind>(outputs[0]?.key ?? "linkedin");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const active = outputs.find((meta) => meta.key === tab) ?? outputs[0];
  const content = active ? ((row[active.field] as string | null) ?? "") : "";

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("📋 Copied to clipboard!");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex max-h-[85vh] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-[#E9E8FF] bg-paper shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E9E8FF] px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-bold text-ink">{formatDate(row.created_at)}</p>
            {row.content_type ? (
              <span className="rounded-full bg-[#F5F0FF] px-2.5 py-1 text-[12px] font-semibold text-brand capitalize">
                {row.content_type}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-gray-muted transition hover:bg-[#F5F0FF] hover:text-ink"
          >
            <X className="size-4" /> Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex w-full items-center justify-between rounded-xl border border-[#E9E8FF] bg-[#FAFAFF] px-4 py-3 text-left text-[14px] font-semibold text-ink"
          >
            <span>📄 Original post ({countWords(row.input_text)} words)</span>
            <ChevronDown
              className={cn("size-4 transition-transform", expanded && "rotate-180")}
            />
          </button>
          {expanded ? (
            <div className="mt-2 max-h-64 overflow-y-auto rounded-xl bg-[#F3F4F6] p-4 text-[14px] leading-[1.6] whitespace-pre-wrap text-[#374151]">
              {row.input_text}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2 border-b border-[#E9E8FF] pb-2">
            {outputs.map((meta) => (
              <button
                key={meta.key}
                type="button"
                onClick={() => setTab(meta.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13px] font-semibold transition",
                  meta.key === tab
                    ? "bg-[#F5F0FF] text-brand"
                    : "text-gray-muted hover:text-ink",
                )}
              >
                {meta.label}
              </button>
            ))}
          </div>

          {active ? (
            <div className="mt-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={copy}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-brand/40 px-3 text-[13px] font-semibold text-brand transition hover:bg-[#F5F0FF]"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mt-2 rounded-xl border border-[#E9E8FF] bg-[#FAFAFF] p-4 text-[15px] leading-[1.6] whitespace-pre-wrap text-[#374151]">
                {content}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-[14px] text-gray-muted">No outputs saved.</p>
          )}
        </div>

        <div className="border-t border-[#E9E8FF] px-6 py-4">
          {confirming ? (
            <DeleteConfirm onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
          ) : (
            <button
              type="button"
              onClick={onDelete}
              className="text-[13px] font-semibold text-red-600 hover:underline"
            >
              Delete this repurpose
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <div className="flex size-32 items-center justify-center rounded-full bg-[#F5F0FF] text-[64px]">
        📚
      </div>
      <h2 className="mt-6 text-[22px] font-bold text-ink">No repurposes yet</h2>
      <p className="mt-2 max-w-md text-[16px] text-[#6B7280]">
        Head to the dashboard and repurpose your first post. It takes less than 60
        seconds. ✨
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-brand to-brand-glow px-6 text-[15px] font-semibold text-white shadow-lg shadow-brand/25 transition hover:opacity-95"
      >
        Go to Dashboard →
      </Link>
    </div>
  );
}