export default function AndroidPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">
        Privacy Policy for AI Narrative Painting
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          Information Collection and Use
        </h2>
        <p className="mb-4">
          AI Narrative Painting does not collect any personal information. We
          respect your privacy and are committed to protecting it.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Log Data</h2>
        <p className="mb-4">
          We want to inform you that whenever you use our app, we do not collect
          any log data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Security</h2>
        <p className="mb-4">
          We value your trust in providing us your information, thus we are
          striving to use commercially acceptable means of protecting it.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. Thus, you are
          advised to review this page periodically for any changes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us.
        </p>
      </section>

      <footer className="text-sm text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  )
}
