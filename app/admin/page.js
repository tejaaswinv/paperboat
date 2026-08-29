import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Paper Boat Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="page-hero">
      <div className="shell">
        <p className="eyebrow">organizer console</p>
        <h1>schedule the<br /><em>next boat.</em></h1>
        <p className="page-lede">
          Create events, publish registration pages, and see every signup stored in Firebase.
        </p>
        <AdminDashboard />
      </div>
    </section>
  );
}
