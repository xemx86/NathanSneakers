"use client";

/* Hooki React do obsługi akcji formularza, efektów i lokalnego stanu */
import { useActionState, useEffect, useMemo, useState } from "react";

/* Akcje zapisu produktu */
import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/lib/actions/products";

/* Typ produktu */
import { ProductRow } from "@/types/store";

/* Stan początkowy dla akcji formularza */
const initialState: ProductActionState = {
  status: "idle",
  message: "",
};

/* Zamiana tablicy rozmiarów na tekst do inputa */
function normalizeSizes(value?: string[] | null) {
  return value?.join(", ") ?? "";
}

/* Zamiana tablicy dodatkowych zdjęć na 3 pola input */
function normalizeExtraImageUrls(
  value?: string[] | null,
  mainImage?: string | null
) {
  const main = (mainImage ?? "").trim();

  const cleaned = (value ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item !== main);

  return [cleaned[0] ?? "", cleaned[1] ?? "", cleaned[2] ?? ""];
}

export function ProductAdminForm({
  mode,
  product,
  onSaved,
}: {
  mode: "create" | "update";
  product?: ProductRow;
  onSaved?: () => void;
}) {
  /* Wybór odpowiedniej akcji formularza */
  const action = mode === "create" ? createProductAction : updateProductAction;

  /* Stan akcji formularza */
  const [state, formAction, isPending] = useActionState(action, initialState);

  /* Lokalny stan checkboxa "featured" */
  const [featured, setFeatured] = useState(Boolean(product?.is_featured));

  /* Lokalny stan systemu rozmiarowego */
  const [sizeSystem, setSizeSystem] = useState(
    product?.size_system ?? "unisex"
  );

  /* Początkowe dodatkowe zdjęcia */
  const initialExtraImages = useMemo(
    () => normalizeExtraImageUrls(product?.image_urls ?? null, product?.image_url),
    [product?.image_urls, product?.image_url]
  );

  /* Lokalny stan dodatkowych zdjęć */
  const [extraImages, setExtraImages] = useState<string[]>(initialExtraImages);

  /* Synchronizacja dodatkowych zdjęć po zmianie produktu */
  useEffect(() => {
    setExtraImages(initialExtraImages);
  }, [initialExtraImages]);

  /* Po udanym zapisie odpalamy callback */
  useEffect(() => {
    if (state.status === "success" && onSaved) {
      onSaved();
    }
  }, [state.status, onSaved]);

  return (
    <form action={formAction} className="admin-form">
      {/* Ukryte ID przy edycji produktu */}
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {/* Nazwa i slug */}
      <div className="form-grid">
        <div className="field">
          <label>
            Nazwa
            <input name="name" required defaultValue={product?.category ?? ""} />
          </label>
        </div>

        <div className="field">
          <label>
            Slug
            <input
              name="slug"
              required
              defaultValue={product?.slug}
              placeholder="np. kickrush-barefoot-sand"
            />
          </label>
        </div>
      </div>

      {/* Marka, kategoria i kolor */}
      <div className="form-grid-3">
        <div className="field">
          <label>
            Marka
            <input name="brand" required defaultValue={product?.brand ?? "KickRush"} />
          </label>
        </div>

        <div className="field">
          <label>
            Kategoria
            <input name="category" required defaultValue={product?.category ?? ""} />
          </label>
        </div>

        <div className="field">
          <label>
            Kolor
            <input name="color" required defaultValue={product?.color ?? ""} />
          </label>
        </div>
      </div>

      {/* Materiał i ceny */}
      <div className="form-grid-3">
        <div className="field">
          <label>
            Materiał
            <input name="material" required defaultValue={product?.material ?? ""} />
          </label>
        </div>

        <div className="field">
          <label>
            Cena
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product?.price}
            />
          </label>
        </div>

        <div className="field">
          <label>
            Cena promocyjna
            <input
              name="sale_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.sale_price ?? ""}
            />
          </label>
        </div>
      </div>

<div className="field">
  <label>
    Opis produktu
    <textarea
      name="description"
      defaultValue={product?.description ?? ""}
      placeholder="Opis produktu..."
      rows={4}
    />
  </label>
</div>
      {/* Rozmiary, audience i system rozmiarowy */}
      <div className="form-grid-3">
        <div className="field">
          <label>
            Rozmiary
            <input
              name="sizes"
              defaultValue={normalizeSizes(product?.sizes)}
              placeholder="36, 37, 38, 39"
            />
          </label>
        </div>



        <div className="field">
          <label>
            System rozmiarowy
            <select
              name="size_system"
              value={sizeSystem}
              onChange={(e) => setSizeSystem(e.target.value)}
            >
              <option value="unisex">Unisex</option>
              <option value="men">Męski</option>
              <option value="women">Damski</option>
              <option value="kids">Dziecięcy</option>
              <option value="men_women">Męski i damski</option>
            </select>
          </label>
        </div>
      </div>

      {/* Dodatkowe pola tylko dla systemu męski + damski */}
      {sizeSystem === "men_women" && (
        <div className="form-grid">
          <div className="field">
            <label>
              Rozmiary męskie
              <input
                name="sizes_men"
                defaultValue={
                  Array.isArray(product?.sizes_men)
                    ? product.sizes_men.join(", ")
                    : ""
                }
                placeholder="7, 8, 9, 10"
              />
            </label>
          </div>

          <div className="field">
            <label>
              Rozmiary damskie
              <input
                name="sizes_women"
                defaultValue={
                  Array.isArray(product?.sizes_women)
                    ? product.sizes_women.join(", ")
                    : ""
                }
                placeholder="8.5, 9.5, 10.5"
              />
            </label>
          </div>
        </div>
      )}

      {/* Główne zdjęcie pod rozmiarami */}
      <div className="field">
        <label>
          Główne zdjęcie URL
          <input
            name="image_url"
            defaultValue={product?.image_url ?? ""}
            placeholder="https://..."
          />
        </label>
      </div>

      {/* Dodatkowe zdjęcia */}
      <div className="field">
        <label style={{ marginBottom: 10, display: "block" }}>
          Dodatkowe zdjęcia URL
        </label>

        <div className="url-list">
          {extraImages.map((value, index) => (
            <div key={index} className="url-row">
              <input
                name="image_urls"
                value={value}
                onChange={(event) => {
                  const next = [...extraImages];
                  next[index] = event.target.value;
                  setExtraImages(next);
                }}
                placeholder={`https://... (zdjęcie ${index + 2})`}
              />

              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  if (extraImages.length === 1) {
                    setExtraImages([""]);
                    return;
                  }

                  setExtraImages(extraImages.filter((_, i) => i !== index));
                }}
              >
                Usuń
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setExtraImages([...extraImages, ""])}
          >
            Dodaj kolejne zdjęcie
          </button>
        </div>
      </div>

      {/* Checkbox featured */}
      <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          name="is_featured"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Pokaż na stronie głównej
      </label>

      {/* Komunikat akcji */}
      {state.message ? (
        <div className={state.status === "error" ? "notice notice--danger" : "notice"}>
          {state.message}
        </div>
      ) : null}

      {/* Przycisk zapisu */}
      <button className="button" disabled={isPending} type="submit">
        {isPending ? "Zapisywanie..." : mode === "create" ? "Dodaj produkt" : "Zapisz zmiany"}
      </button>
    </form>
  );
}
