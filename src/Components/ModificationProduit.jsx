import React, { useState, useEffect } from "react";

export default function ModificationProduit({ product, onSaved, onCancel } = {}) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [quantity, setQuantity] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (product) {
			setName(product.name ?? "");
			setDescription(product.description ?? "");
			setPrice(product.price ?? "");
			setQuantity(product.quantity ?? 0);
			setError(null);
		}
	}, [product]);

	const submit = async (e) => {
		e.preventDefault();
		if (!product || !product.id) return;
		setLoading(true);
		setError(null);

		const payload = {
			name: name.trim(),
			description: description.trim() || null,
			price: Number(price),
			quantity: Number.isNaN(Number(quantity)) ? 0 : Number(quantity),
		};

		try {
			const protocol = window.location.protocol;
			const host = window.location.hostname || "localhost";
			const url = `${protocol}//${host}:8080/api/products/${product.id}`;

			const res = await fetch(url, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const txt = await res.text().catch(() => "");
				throw new Error(txt || `HTTP ${res.status}`);
			}
			const updated = await res.json().catch(() => ({ ...product, ...payload }));
			if (typeof onSaved === "function") onSaved(updated);
		} catch (err) {
			console.error("Update failed:", err);
			setError(err.message || String(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={submit} className="max-w-lg mx-auto bg-white/5 p-4 rounded-md mb-4">
			<h3 className="text-white font-semibold mb-3">Modifier le produit</h3>

			<div className="mb-2">
				<label className="text-sm text-white/80">Nom</label>
				<input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10 text-white" required />
			</div>

			<div className="mb-2">
				<label className="text-sm text-white/80">Description</label>
				<input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10 text-white" />
			</div>

			<div className="grid grid-cols-2 gap-2 mb-2">
				<div>
					<label className="text-sm text-white/80">Prix</label>
					<input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10 text-white" placeholder="ex: 19.99" required />
				</div>
				<div>
					<label className="text-sm text-white/80">Quantité</label>
					<input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/10 text-white" placeholder="ex: 10" type="number" min="0" />
				</div>
			</div>

			{error && <p className="text-red-400 text-sm mb-2">{error}</p>}

			<div className="flex gap-2">
				<button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 rounded text-white">
					{loading ? "Sauvegarde..." : "Sauver"}
				</button>
				<button type="button" onClick={() => typeof onCancel === "function" && onCancel()} className="px-4 py-2 bg-white/10 rounded text-white">
					Annuler
				</button>
			</div>
		</form>
	);
}
