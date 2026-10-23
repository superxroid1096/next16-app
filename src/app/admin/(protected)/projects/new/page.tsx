import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">
          إضافة مشروع جديد
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          أدخل تفاصيل المشروع ودراسة الحالة التقنية، وارفع الصور المصاحبة
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
