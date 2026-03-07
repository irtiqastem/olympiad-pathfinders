import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Video, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  file_url: string | null;
  file_name: string | null;
};

const typeIcons: Record<string, React.ElementType> = {
  book: BookOpen,
  worksheet: FileText,
  video: Video,
};

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = typeIcons[resource.type] || FileText;
  return (
    <div className="card-hover flex gap-4 rounded-xl border bg-card p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{resource.title}</h3>
        {resource.description && (
          <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
        )}
        {resource.file_url && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 gap-1 px-0 text-primary hover:text-primary/80"
            asChild
          >
            <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" /> Download / View
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      setResources((data as Resource[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const mathBooks = resources.filter((r) => r.category === "math" && r.type === "book");
  const mathWorksheets = resources.filter((r) => r.category === "math" && r.type === "worksheet");
  const infoBooks = resources.filter((r) => r.category === "informatics" && r.type === "book");
  const infoWorksheets = resources.filter((r) => r.category === "informatics" && r.type === "worksheet");

  return (
    <>
      <section className="hero-gradient py-16 md:py-20">
        <div className="container-narrow px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-3 text-3xl font-bold text-primary-foreground md:text-5xl">
              Learning Resources
            </h1>
            <p className="max-w-2xl text-lg text-primary-foreground/80">
              Curated books, worksheets, and materials for both Mathematics and Informatics Olympiad preparation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : resources.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No resources uploaded yet. Check back soon!
            </p>
          ) : (
            <Tabs defaultValue="math">
              <TabsList className="mb-8 grid w-full max-w-sm grid-cols-2">
                <TabsTrigger value="math">Math Olympiad</TabsTrigger>
                <TabsTrigger value="informatics">Informatics</TabsTrigger>
              </TabsList>

              {[
                { key: "math", books: mathBooks, worksheets: mathWorksheets },
                { key: "informatics", books: infoBooks, worksheets: infoWorksheets },
              ].map(({ key, books, worksheets }) => (
                <TabsContent key={key} value={key}>
                  {books.length > 0 && (
                    <div className="mb-6">
                      <h2 className="mb-1 text-xl font-bold text-foreground">Books</h2>
                      <p className="mb-4 text-sm text-muted-foreground">Recommended reading for structured learning.</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        {books.map((r, i) => (
                          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                            <ResourceCard resource={r} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {worksheets.length > 0 && (
                    <div>
                      <h2 className="mb-1 text-xl font-bold text-foreground">Worksheets & Problem Sets</h2>
                      <p className="mb-4 text-sm text-muted-foreground">Practice materials organized by topic and difficulty.</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        {worksheets.map((r, i) => (
                          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                            <ResourceCard resource={r} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {books.length === 0 && worksheets.length === 0 && (
                    <p className="py-12 text-center text-muted-foreground">No {key} resources yet.</p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>
    </>
  );
}
