"use client";

import { useActionState } from "react";
import {
  deleteProductAction,
  type ProductActionState
} from "@/lib/actions/products";

const initialState: ProductActionState = {
  status: "idle",
  message: ""
};

export function DeleteProductButton({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(deleteProductAction, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="button-danger"
        disabled={isPending}
      >
        {isPending ? "Usuwanie..." : "Usuń"}
      </button>
      {state.status === "error" ? (
        <div className="notice notice--danger" style={{ marginTop: 10 }}>
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
