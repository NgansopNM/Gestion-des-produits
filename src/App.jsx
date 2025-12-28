import React, { useEffect, useState } from "react";
import ADDProduct from "./Components/ADDProduct";
import Todo from "./Components/To-do.jsx";
import ModificationProduit from "./Components/ModificationProduit";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [editProduct, setEditProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const protocol = window.location.protocol;
      const host = window.location.hostname || "localhost";
      const url = `${protocol}//${host}:8080/api/products`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          if (mounted) setError(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Formatage du prix en euros
  const formatPrice = (price) => {
    const n = Number(price);
    if (Number.isNaN(n)) return String(price ?? "");
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(n);
  };

  // suppression d'un produit
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Supprimer ce produit ?")) return;
    setError(null);
    setLoading(true);
    try {
      const protocol = window.location.protocol;
      const host = window.location.hostname || "localhost";
      const url = `${protocol}//${host}:8080/api/products/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // callback when ADDProduct adds a product
  const handleAdded = (created) => {
    // fermer le formulaire
    setShowAddForm(false);
    if (created && created.id) {
      setProducts((prev) => [created, ...prev]);
    } else {
      // fallback: refetch products si nécessaire
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const protocol = window.location.protocol;
          const host = window.location.hostname || "localhost";
          const url = `${protocol}//${host}:8080/api/products`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  // ouvrir le formulaire d'édition
  const handleEditClick = (prod) => {
    setEditProduct(prod ?? null);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  // appelé par ModificationProduit lorsque l'édition est sauvée
  const handleEditSaved = (updated) => {
    setShowEditForm(false);
    setEditProduct(null);
    if (updated && updated.id) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  // annuler édition
  const handleEditCancel = () => {
    setShowEditForm(false);
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
     

      <div className="max-w-3xl mx-auto mt-6">
        {/* Formulaire d'ajout (affiché seulement quand showAddForm) */}
        {showAddForm && <ADDProduct onAdded={handleAdded} onCancel={() => setShowAddForm(false)} />}

        {/* Formulaire de modification */}
        {showEditForm && editProduct && (
          <ModificationProduit product={editProduct} onSaved={handleEditSaved} onCancel={handleEditCancel} />
        )}

        {loading ? (
          <p className="text-white/80 text-center">Chargement des produits...</p>
        ) : error ? (
          <div className="text-red-500 text-center">
            <p>Erreur: {error.message}</p>
            <p className="text-sm text-red-300">({error.name})</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-white/20 rounded"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-white text-2xl mb-4">
              Produits ({products.length})
            </h2>
            <ul className="space-y-3">
              {products.map((prod) => (
                <li
                  key={prod.id}
                  className="bg-white/10 p-4 rounded-lg text-white flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{prod.name}</div>
                    {prod.description && (
                      <div className="text-sm text-white/70">
                        {prod.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4 flex items-center gap-3">
                    <div>
                      <div className="font-bold">{formatPrice(prod.price)}</div>
                      <div className="text-sm text-white/60">
                        {prod.quantity ?? 0} en stock
                      </div>
                    </div>

                    {/* NEW: bouton Modifier placé à côté de Supprimer */}
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="px-3 py-1 bg-yellow-500 rounded text-white"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="px-3 py-1 bg-red-600 rounded text-white"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
              {products.length === 0 && (
                <p className="text-white/70 text-center">Aucun produit trouvé.</p>
              )}
            </ul>

            {/* Bouton Ajouter placé à la fin */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setEditProduct(null);
                  setShowAddForm(true);
                }}
                className="px-4 py-2 bg-indigo-600 rounded text-white"
              >
                Ajouter
              </button>
            </div>
          </>
        )}
      </div>
      <div className="mt-24">
      <Todo/>
      </div>
    </div>
  );
}
