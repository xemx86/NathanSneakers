import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n";

type ContactPageProps = {
  params: Promise<{ lang: string }>;
};

function PhoneIcon() {
  return (
    <img
      src="/icons/phone.png"
      alt="Phone"
      style={{ width: 120, height: 120, objectFit: "contain", display: "block" }}
    />
  );
}

function WhatsAppIcon() {
  return (
    <img
      src="/icons/whatsapp.png"
      alt="WhatsApp"
      style={{ width: 120, height: 120, objectFit: "contain", display: "block" }}
    />
  );
}

function MessengerIcon() {
  return (
    <img
      src="/icons/messenger.png"
      alt="Messenger"
      style={{ width: 120, height: 120, objectFit: "contain", display: "block" }}
    />
  );
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang as Locale);

const titleMain = dictionary.contact?.titleMain ?? "Contact";
const titleAccent = dictionary.contact?.titleAccent ?? "us";
  const titleParts = contactTitle.split(contactAccent);

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-10">
      <section className="w-full max-w-6xl rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex rounded-full bg-neutral-100 px-4 py-1 text-sm font-semibold text-[#c07a3d]">
            {dictionary.contact?.badge ?? "Contact"}
          </div>

 <h1 className="mx-auto max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">
  <span style={{ color: "#1e1713" }}>
    {dictionary.contact?.titleMain ?? "Contact"}
  </span>{" "}
  <span style={{ color: "#b37543" }}>
    {dictionary.contact?.titleAccent ?? "us."}
  </span>
</h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600">
  <span style={{ color: "#b37543", fontWeight: 700 }}>
    Choose the contact method
  </span>{" "}
  <span style={{ color: "#1e1713", fontWeight: 700 }}>
    that suits you best
  </span>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "32px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          <a
            href="tel:+15705551234"
            style={{
              minWidth: "220px",
              textAlign: "left",
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <PhoneIcon />
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
              {dictionary.contact?.phone ?? "Phone"}
            </div>
            <div style={{ marginTop: "6px", fontSize: "16px", color: "#b37543" }}>
              +1 (570) 555-1234
            </div>
          </a>

          <a
            href="https://wa.me/15705551234"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              minWidth: "220px",
              textAlign: "left",
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <WhatsAppIcon />
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
              {dictionary.contact?.whatsapp ?? "WhatsApp"}
            </div>
            <div style={{ marginTop: "6px", fontSize: "16px", color: "#b37543" }}>
              +1 (570) 555-1234
            </div>
          </a>

          <a
            href="https://m.me/twojprofil"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              minWidth: "220px",
              textAlign: "left",
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <MessengerIcon />
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
              {dictionary.contact?.messenger ?? "Messenger"}
            </div>
            <div style={{ marginTop: "6px", fontSize: "16px", color: "#b37543" }}>
              {dictionary.contact?.sendMessage ?? "Send message"}
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}