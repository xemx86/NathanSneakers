import Link from "next/link";
import { redirect } from "next/navigation";
import { listProducts, getProductBySlug } from "@/lib/products";
import { getCurrentProfile } from "@/lib/auth";
import { getTotalPageViews, getTopViewedProducts } from "@/lib/analytics";
import { ProductAdminForm } from "@/components/product-admin-form";
import { ProductAdminList } from "@/components/product-admin-list";
import { Locale } from "@/lib/i18n";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  /* Pobranie aktualnego języka z parametru trasy */
  const { lang } = await params;

  /* Pobranie aktualnie zalogowanego profilu */
  const profile = await getCurrentProfile();

  /* Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania */
  if (!profile) {
    redirect(`/${lang}/login`);
  }

  /* Jeśli użytkownik jest zalogowany, ale nie ma roli admin, wyrzuć go poza panel */
  if (profile.role !== "admin") {
    redirect(`/${lang}`);
  }

  /* Pobranie listy produktów do panelu admina */
  const products = await listProducts({ sort: "newest", limit: 100 });

  /* Pobranie łącznej liczby wyświetleń strony */
  const totalPageViews = await getTotalPageViews();

  /* Pobranie rankingu najczęściej oglądanych produktów */
  const topViewedProductsRaw = await getTopViewedProducts(10);

  /* Zamiana slugów na czytelne nazwy produktów */
  const topViewedProducts = await Promise.all(
    topViewedProductsRaw.map(async (item) => {
      /* Szukamy produktu po slug, żeby zamiast samego slug wyświetlić nazwę */
      const product = await getProductBySlug(item.slug);

      return {
        slug: item.slug,
        views: item.views,
        name: product?.name ?? item.slug,
      };
    })
  );

  /* Główny widok panelu admina */
  return (
    <div className="container admin-page">
      <div className="admin-stack">
        {/* Górna karta z informacją o zalogowanym adminie */}
        <section className="admin-card">
          <div className="admin-toolbar">
            <div>
              <div className="eyebrow">Panel admina</div>

              <h1 style={{ marginTop: 10, marginBottom: 8 }}>
                Zarządzanie sklepem
              </h1>

              <div className="footer-muted">
                Zalogowany jako {profile.email}
              </div>
            </div>

            <div className="inline-actions">
              {/* Szybkie przejście do sklepu */}
              <Link href={`/${lang}/sklep`} className="button-secondary">
                Podejrzyj sklep
              </Link>

              {/* Szybkie przejście do koszyka */}
              <Link href={`/${lang}/koszyk`} className="button-secondary">
                Sprawdź koszyk
              </Link>
            </div>
          </div>
        </section>

        {/* Karta z podstawową analityką strony */}
        <section className="admin-card">
          <div className="admin-toolbar">
            <div>
              <h2>Analityka strony</h2>
              <div className="footer-muted">
                Lokalny licznik zapisany w pliku JSON
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gap: 16,
            }}
          >
            {/* Box z łączną liczbą wyświetleń */}
            <div
              style={{
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(0, 0, 0, 0.08)",
                background: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <div className="footer-muted">Łączna liczba wyświetleń strony</div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                {totalPageViews}
              </div>
            </div>
          </div>
        </section>

        {/* Ranking najczęściej oglądanych produktów */}
        <section className="admin-card">
          <div className="admin-toolbar">
            <div>
              <h2>Najczęściej oglądane produkty</h2>
              <div className="footer-muted">
                Ranking oparty na wejściach na stronę produktu
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gap: 12,
            }}
          >
            {/* Jeśli nie ma danych, pokaż pusty komunikat */}
            {topViewedProducts.length === 0 ? (
              <div className="footer-muted">
                Brak danych o wyświetleniach produktów.
              </div>
            ) : (
              /* Jeśli dane są, pokaż listę top produktów */
              topViewedProducts.map((item, index) => (
                <div
                  key={item.slug}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    padding: 16,
                    borderRadius: 14,
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    background: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {index + 1}. {item.name}
                    </div>

                    <div className="footer-muted">{item.slug}</div>
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {item.views}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Formularz dodawania nowego produktu */}
        <section className="admin-card">
          <h2>Dodaj nowy produkt</h2>
          <ProductAdminForm mode="create" />
        </section>

        {/* Lista wszystkich produktów */}
        <section className="admin-card">
          <div className="admin-toolbar">
            <div>
              <h2>Produkty</h2>
              <div className="footer-muted">{products.length} pozycji</div>
            </div>
          </div>

          <ProductAdminList products={products} />
        </section>
      </div>
    </div>
  );
}
