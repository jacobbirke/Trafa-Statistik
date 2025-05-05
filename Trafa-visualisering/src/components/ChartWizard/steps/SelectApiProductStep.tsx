import React, { useEffect, useState } from "react";
import { WizardStep } from "../../../types/chartTypes";
import { Card } from "../../UI/Card";
import { Button } from "../../UI/Button";


export const SelectApiProductStep: React.FC<{
    setStep: (step: WizardStep) => void;
    setSelectedProduct: (product: string) => void;
  }> = ({ setStep, setSelectedProduct }) => {
    const [products, setProducts] = useState<Array<{ id: string; label: string }>>([]);
  
    useEffect(() => {
      const fetchStructure = async () => {
        try {
          const response = await fetch("https://api.trafa.se/api/structure");
          const text = await response.text();
          const data = xmlToJson(text);
          
          const items = data?.StructureResponseWrapper?.StructureItems?.StructureItem || [];
          const products = items
            .filter((item: any) => item.Type === "P")
            .map((item: any) => ({
              id: item.Name,
              label: item.Label,
            }));
          
          setProducts(products);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
    
      fetchStructure();
    }, []);

  function xmlToJson(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    function traverse(node: any) {
      let result: any = {};
      if (node.attributes && node.attributes.length > 0) {
        result["@attributes"] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attribute = node.attributes.item(i);
          result["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
      if (node.childNodes && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === 3) {
            if (child.nodeValue.trim()) {
              result = child.nodeValue.trim();
            }
          } else {
            const childName = child.nodeName;
            const childObj = traverse(child);
            if (result[childName] === undefined) {
              result[childName] = childObj;
            } else {
              if (!Array.isArray(result[childName])) {
                result[childName] = [result[childName]];
              }
              result[childName].push(childObj);
            }
          }
        }
      }
      return result;
    }

    const json = traverse(xmlDoc.documentElement);
    return json;
  }

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">Välj statistikkälla</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <Button
            key={product.id}
            onClick={() => {
              setSelectedProduct(product.id);
              setStep("configure-api-query");
            }}
            variant="secondary"
          >
            {product.label}
          </Button>
        ))}
      </div>
      <Button onClick={() => setStep("input-source")} className="mt-4">
        Tillbaka
      </Button>
      <Button onClick={() => setStep("configure-api-query")} className="mt-4">
        Nästa
      </Button>
    </Card>
  );
};
