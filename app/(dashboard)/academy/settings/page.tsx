import { getSettings } from "@/actions/settings";
import { SettingsForm } from "@/components/academy/settings-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const data = await getSettings();

    if (!data) {
        redirect("/login");
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <SectionHeading
                title="Configuration Matrix"
                subtitle="SYSTEM PREFERENCES"
            />

            <SettingsForm initialData={data} />
        </div>
    );
}
