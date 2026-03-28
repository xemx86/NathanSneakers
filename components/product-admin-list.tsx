"use client";

import { useState } from "react";
import { ProductRow } from "@/types/store";
import { ProductAdminForm } from "@/components/product-admin-form";
import { DeleteProductButton } from "@/components/product-delete-button";

export function ProductAdminList({ products }: { products: ProductRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (products.length === 0) {
    return <div className="empty-state">Nie ma jeszcze żadnych produktów.</div>;
  }

  return (
    <div className="admin-products">
      {products.map((product) => {
        const isEditing = editingId === product.id;

        return (
          <article className="admin-product-item" key={product.id}>
            <div className="admin-product-item__head">
              <div>
                <strong>{product.name}</strong>
                <div className="footer-muted">
                  {product.category} · {product.color} · {product.material}
                </div>
              </div>

              <div className="inline-actions">
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => setEditingId(isEditing ? null : product.id)}
                >
                  {isEditing ? "Zamknij edycję" : "Edytuj"}
                </button>

                <DeleteProductButton id={product.id} />
              </div>
            </div>

            {isEditing ? (
              <ProductAdminForm
                mode="update"
                product={product}
                onSaved={() => setEditingId(null)}
              />
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
