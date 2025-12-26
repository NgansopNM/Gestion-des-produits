import React, { useState } from "react";

export default function ADDProduct({ onAdded, onCancel } = {}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    const numPrice = Number(price);
    if (price === "" || Number.isNaN(numPrice)) {
      setError("Prix invalide.");
      return;
    }
    const numQty = quantity === "" ? 0 : parseInt(quantity, 10);

    setLoading(true);
    try {
      const protocol = window.location.protocol;
      const host = window.location.hostname || "localhost";
      const url = `${protocol}//${host}:8080/api/products`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: Number(numPrice),
          quantity: Number.isNaN(numQty) ? 0 : numQty,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      const created = await res.json().catch(() => null);
      setSuccess(true);
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      if (typeof onAdded === "function") onAdded(created);
    } catch (err) {
      console.error("Add product failed:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg mx-auto bg-white/5 p-4 rounded-md">
      <h3 className="text-white font-semibold mb-3">Ajouter un produit</h3>

      <div className="mb-2">
        <label className="text-sm text-white/80">Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-white/10 text-white"
          required
        />
      </div>

      <div className="mb-2">
        <label className="text-sm text-white/80">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-white/10 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-sm text-white/80">Prix</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-white/10 text-white"
            placeholder="ex: 19.99"
            required
          />
        </div>
        <div>
          <label className="text-sm text-white/80">Quantité</label>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-white/10 text-white"
            placeholder="ex: 10"
            type="number"
            min="0"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-400 text-sm mb-2">Produit ajouté.</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 rounded text-white disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={() => {
            setName("");
            setDescription("");
            setPrice("");
            setQuantity("");
            setError(null);
            setSuccess(false);
          }}
          className="px-4 py-2 bg-white/10 rounded text-white"
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof onCancel === "function") onCancel();
          }}
          className="px-4 py-2 bg-gray-600 rounded text-white"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
