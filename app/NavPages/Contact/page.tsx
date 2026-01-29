export const metadata = {
  title: "Contact | DMS Unified",
  description: "Contact DMS Unified Headquarters and Emergency Support",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Page Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="text-muted-foreground">
            Reach out to DMS Unified for emergency coordination, system support,
            or general inquiries. Our operations team is always ready to assist.
          </p>
        </header>

        {/* Headquarters */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">📍 Headquarters</h2>
          <p>
            <strong>DMS Unified – Disaster Management System</strong>
          </p>
          <p>Birtamode, Jhapa District</p>
          <p>Province No. 1, Nepal</p>
        </section>

        {/* Emergency Contacts */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">☎ Emergency & Support</h2>
          <ul className="space-y-2">
            <li><strong>Emergency Hotline:</strong> 100 / 112</li>
            <li><strong>Fire & Rescue:</strong> 101</li>
            <li><strong>Medical Emergency:</strong> 102</li>
            <li><strong>DMS Operations Desk:</strong> +977-23-XXXXXX</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Emergency lines are monitored 24/7.
          </p>
        </section>

        {/* Email & Office Hours */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-2">📧 Email</h2>
            <p>General Inquiries: <strong>support@dmsunified.gov.np</strong></p>
            <p>Incident Coordination: <strong>operations@dmsunified.gov.np</strong></p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-2">🕒 Office Hours</h2>
            <p>Sunday – Friday: 9:00 AM – 6:00 PM</p>
            <p>Emergency Operations: <strong>24/7</strong></p>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-sm text-muted-foreground">
          <p>
            For non-emergency feedback, system improvement suggestions, or
            partnership requests, please contact us via email.
          </p>
        </section>

      </div>
    </main>
  );
}
