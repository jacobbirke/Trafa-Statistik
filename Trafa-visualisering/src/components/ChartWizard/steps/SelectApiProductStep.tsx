import React, { useEffect, useState } from "react";
import { WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";
import { Button } from "../../UI/Button";
import { xmlToJson } from "../../../utils/xmlUtils";

interface Product {
  id: string;
  label: string;
}

export const SelectApiProductStep: React.FC<{
  setStep: (step: WizardStep) => void;
  setSelectedProduct: (product: string) => void;
}> = ({ setStep, setSelectedProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await fetch("https://api.trafa.se/api/structure?lang=sv");
        const text = await resp.text();

        let items: any[] = [];
        try {
          const json = JSON.parse(text);
          items = json.StructureItems || [];
        } catch {
          const parsed = xmlToJson(text);
          items =
            parsed?.StructureResponseWrapper?.StructureItems?.StructureItem ||
            [];
        }

        const prods: Product[] = items
          .filter((it) => it.Type === "P" || it["@attributes"]?.Type === "P")
          .map((it) => ({
            id: it.Name || it["@attributes"]?.Name,
            label:
              it.Label ||
              it["@attributes"]?.Label?.Value ||
              it.FullLabel ||
              it["@attributes"]?.Name,
          }));

        setProducts(prods);
      } catch (e: any) {
        console.error("Error fetching products:", e);
        setError(e.message || "Kunde inte hämta produkter");
      }
    };

    fetchProducts();
  }, []);

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">Välj statistikkälla</h3>
      {error && <p className="text-red-500 mb-2">Fel: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <Button
            key={product.id}
            variant="secondary"
            onClick={() => {
              setSelectedProduct(product.id);
              setStep("configure-api-query");
            }}
          >
            {product.label}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <Button onClick={() => setStep("input-source")} variant="secondary">
          Tillbaka
        </Button>
      </div>
    </Card>
  );
};
