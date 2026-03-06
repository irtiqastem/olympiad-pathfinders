import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, CheckCircle2, XCircle, Clock, FileText,
  Trophy, GraduationCap, Trash2, Users,
  BarChart3, Shield, AlertTriangle, Eye,
  TrendingUp, Activity,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ── Only this email may access the admin panel ───────────────────────────────
const ADMIN_EMAIL = "arhammukhtar777@gmail.com";

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: number | string; color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────────────────
export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAuthorized = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!loading && (!user || !isAuthorized)) {
      toast({ title: "Access denied", description: "You are not authorized.", variant: "destructive" });
      navigate("/");
    }
  }, [user, loading, isAuthorized, navigate, toast]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <>
      <section className="hero-gradient py-10 md:py-14">
        <div className="container-narrow px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">Admin Panel</h1>
              <p className="text-sm text-primary-foreground/60">
                Signed in as <span className="font-medium text-accent">{user?.email}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="overview" className="gap-1 text-xs"><BarChart3 className="h-3.5 w-3.5" /> Overview</TabsTrigger>
              <TabsTrigger value="problems" className="gap-1 text-xs"><Trophy className="h-3.5 w-3.5" /> Problems</TabsTrigger>
              <TabsTrigger value="submissions" className="gap-1 text-xs"><Clock className="h-3.5 w-3.5" /> Reviews</TabsTrigger>
              <TabsTrigger value="blog" className="gap-1 text-xs"><FileText className="h-3.5 w-3.5" /> Blog</TabsTrigger>
              <TabsTrigger value="scholarships" className="gap-1 text-xs"><GraduationCap className="h-3.5 w-3.5" /> Scholarships</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><OverviewTab /></TabsContent>
            <TabsContent value="problems"><ProblemsTab /></TabsContent>
            <TabsContent value="submissions"><SubmissionsTab /></TabsContent>
            <TabsContent value="blog"><BlogTab /></TabsContent>
            <TabsContent value="scholarships"><ScholarshipsTab /></TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [counts, setCounts] = useState({ problems: 0, submissions: 0, pending: 0, posts: 0, scholarships: 0, users: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [problems, submissions, posts, scholarships, users] = await Promise.all([
        supabase.from("problems").select("id", { count: "exact", head: true }),
        supabase.from("submissions").select("id, status"),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("scholarships").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      const pending = (submissions.data as any[] | null)?.filter((s) => s.status === "pending").length ?? 0;
      setCounts({
        problems: problems.count ?? 0,
        submissions: submissions.data?.length ?? 0,
        pending,
        posts: posts.count ?? 0,
        scholarships: scholarships.count ?? 0,
        users: users.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="mb-5 text-lg font-semibold text-foreground">Platform Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Registered Users" value={counts.users} color="bg-blue-500" />
        <StatCard icon={Trophy} label="Problems" value={counts.problems} color="bg-amber-500" />
        <StatCard icon={TrendingUp} label="Total Submissions" value={counts.submissions} color="bg-green-500" />
        <StatCard icon={Clock} label="Pending Reviews" value={counts.pending} color="bg-orange-500" />
        <StatCard icon={FileText} label="Blog Posts" value={counts.posts} color="bg-purple-500" />
        <StatCard icon={GraduationCap} label="Scholarships" value={counts.scholarships} color="bg-teal-500" />
      </div>
      {counts.pending > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
          <div>
            <p className="font-medium text-orange-800 dark:text-orange-300">
              {counts.pending} submission{counts.pending !== 1 ? "s" : ""} awaiting review
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400">Go to the Reviews tab to evaluate them.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Problems Tab ─────────────────────────────────────────────────────────────
function ProblemsTab() {
  const [problems, setProblems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProblems = async () => {
    const { data } = await supabase.from("problems").select("*").order("created_at", { ascending: false });
    setProblems(data || []);
  };

  useEffect(() => { fetchProblems(); }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from("problems").insert({
      title: form.get("title") as string,
      difficulty: form.get("difficulty") as string,
      track: form.get("track") as string,
      tags: ((form.get("tags") as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
      statement: form.get("statement") as string,
      sample_input: form.get("sample_input") as string,
      sample_output: form.get("sample_output") as string,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Problem added!" });
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      fetchProblems();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("problems").delete().eq("id", deleteId);
    if (!error) { toast({ title: "Problem deleted" }); fetchProblems(); }
    setDeleteId(null);
  };

  const diffColor: Record<string, string> = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Problems <span className="ml-1 text-sm font-normal text-muted-foreground">({problems.length})</span></h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Problem</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Problem</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3 pt-1">
              <div><Label>Title</Label><Input name="title" placeholder="Problem title" required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Difficulty</Label>
                  <select name="difficulty" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <Label>Track</Label>
                  <select name="track" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                    <option value="IMO">IMO (Math)</option>
                    <option value="IOI">IOI (Informatics)</option>
                  </select>
                </div>
              </div>
              <div><Label>Tags <span className="text-muted-foreground text-xs">(comma separated)</span></Label><Input name="tags" placeholder="Algebra, Geometry" className="mt-1" /></div>
              <div><Label>Problem Statement</Label><Textarea name="statement" rows={5} required className="mt-1 font-mono text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Sample Input</Label><Textarea name="sample_input" rows={2} className="mt-1 font-mono text-sm" /></div>
                <div><Label>Sample Output</Label><Textarea name="sample_output" rows={2} className="mt-1 font-mono text-sm" /></div>
              </div>
              <Button type="submit" className="w-full gold-gradient border-0 font-semibold text-navy">Add Problem</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {problems.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{p.title}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{p.track}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${diffColor[p.difficulty] ?? ""}`}>{p.difficulty}</span>
                {(p.tags ?? []).map((t: string) => (
                  <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
            <Button size="icon" variant="ghost" className="ml-3 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(p.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {problems.length === 0 && <p className="py-12 text-center text-muted-foreground">No problems yet.</p>}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this problem?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the problem and all its submissions. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Submissions Review Tab ────────────────────────────────────────────────────
function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("pending");
  const { toast } = useToast();

  const fetchSubs = async () => {
    const { data } = await supabase
      .from("submissions")
      .select("*, problems(title), profiles:user_id(full_name)")
      .order("submitted_at", { ascending: false });
    setSubmissions(data || []);
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleEvaluate = async (id: string, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("submissions")
      .update({ status, evaluated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "accepted" ? "✅ Accepted!" : "❌ Rejected" });
      fetchSubs();
    }
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Submissions <span className="ml-1 text-sm font-normal text-muted-foreground">({filtered.length})</span></h2>
        <div className="flex gap-1.5">
          {(["pending", "all", "accepted", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{(s.problems as any)?.title || "Unknown Problem"}</p>
                    {s.status === "accepted" && <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Accepted</Badge>}
                    {s.status === "rejected" && <Badge variant="destructive">Rejected</Badge>}
                    {s.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    by <span className="font-medium">{(s.profiles as any)?.full_name || "Unknown"}</span>
                    {" · "}{new Date(s.submitted_at).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <pre className="mt-2 max-h-28 overflow-auto rounded-md bg-muted p-2.5 text-xs text-foreground">{s.answer}</pre>
                </div>
                {s.status === "pending" && (
                  <div className="flex shrink-0 flex-col gap-2">
                    <Button size="sm" variant="outline" className="gap-1 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400" onClick={() => handleEvaluate(s.id, "accepted")}>
                      <CheckCircle2 className="h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400" onClick={() => handleEvaluate(s.id, "rejected")}>
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">No {filter === "all" ? "" : filter} submissions.</p>}
      </div>
    </div>
  );
}

// ── Blog Tab ─────────────────────────────────────────────────────────────────
function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    const { error } = await supabase.from("blog_posts").insert({
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      content: form.get("content") as string,
      category: form.get("category") as string,
      excerpt: form.get("excerpt") as string,
      published: (form.get("published") as string) === "true",
      author_id: user?.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Post saved!" });
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      fetchPosts();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", deleteId);
    if (!error) { toast({ title: "Post deleted" }); fetchPosts(); }
    setDeleteId(null);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("blog_posts").update({ published: !current }).eq("id", id);
    fetchPosts();
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Blog Posts <span className="ml-1 text-sm font-normal text-muted-foreground">({posts.length})</span></h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader><DialogTitle>New Blog Post</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3 pt-1">
              <div><Label>Title</Label><Input name="title" placeholder="Post title" required className="mt-1" /></div>
              <div>
                <Label>Category</Label>
                <select name="category" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                  <option value="STEM Programs">STEM Programs</option>
                  <option value="Academic Profile">Academic Profile</option>
                  <option value="Olympiad Strategy">Olympiad Strategy</option>
                  <option value="Research">Research Opportunities</option>
                  <option value="Extracurriculars">Extracurriculars</option>
                  <option value="Certifications">Certifications</option>
                </select>
              </div>
              <div><Label>Excerpt</Label><Input name="excerpt" placeholder="Brief summary..." className="mt-1" /></div>
              <div><Label>Content</Label><Textarea name="content" rows={8} required className="mt-1" /></div>
              <div>
                <Label>Status</Label>
                <select name="published" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
              <Button type="submit" className="w-full gold-gradient border-0 font-semibold text-navy">Save Post</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{p.title}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">{p.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-1">
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary" title={p.published ? "Unpublish" : "Publish"} onClick={() => togglePublish(p.id, p.published)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="py-12 text-center text-muted-foreground">No posts yet.</p>}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the blog post. Cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Scholarships Tab ─────────────────────────────────────────────────────────
function ScholarshipsTab() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScholarships = async () => {
    const { data } = await supabase.from("scholarships").select("*").order("created_at", { ascending: false });
    setScholarships(data || []);
  };

  useEffect(() => { fetchScholarships(); }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from("scholarships").insert({
      name: form.get("name") as string,
      country: form.get("country") as string,
      eligibility: form.get("eligibility") as string,
      deadline: form.get("deadline") as string,
      coverage: form.get("coverage") as string,
      apply_link: form.get("apply_link") as string,
      category: form.get("category") as string,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Scholarship added!" });
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      fetchScholarships();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("scholarships").delete().eq("id", deleteId);
    if (!error) { toast({ title: "Scholarship deleted" }); fetchScholarships(); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Scholarships <span className="ml-1 text-sm font-normal text-muted-foreground">({scholarships.length})</span></h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Scholarship</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Scholarship</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3 pt-1">
              <div><Label>Scholarship Name</Label><Input name="name" placeholder="e.g. NUST Merit Scholarship" required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Country</Label><Input name="country" placeholder="Pakistan" required className="mt-1" /></div>
                <div>
                  <Label>Category</Label>
                  <select name="category" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                    <option value="National">National</option>
                    <option value="International">International</option>
                    <option value="STEM Only">STEM Only</option>
                    <option value="Fully Funded">Fully Funded</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Eligibility</Label><Input name="eligibility" placeholder="Grade 8+" className="mt-1" /></div>
                <div><Label>Deadline</Label><Input name="deadline" placeholder="March 2026" className="mt-1" /></div>
              </div>
              <div><Label>Coverage</Label><Input name="coverage" placeholder="Full Tuition + Stipend" className="mt-1" /></div>
              <div><Label>Application Link</Label><Input name="apply_link" type="url" placeholder="https://..." className="mt-1" /></div>
              <Button type="submit" className="w-full gold-gradient border-0 font-semibold text-navy">Add Scholarship</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {scholarships.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{s.name}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">{s.country}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s.category}</span>
                {s.deadline && <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Due: {s.deadline}</span>}
              </div>
            </div>
            <Button size="icon" variant="ghost" className="ml-3 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(s.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {scholarships.length === 0 && <p className="py-12 text-center text-muted-foreground">No scholarships yet.</p>}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this scholarship?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the scholarship listing. Cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
