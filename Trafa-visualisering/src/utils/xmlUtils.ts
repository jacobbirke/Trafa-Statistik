export const xmlToJson = (xmlString: string): any => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
    const traverse = (node: Element): any => {
      const obj: any = {};
  
      // Hantera attribut
      if (node.attributes.length > 0) {
        obj["@attributes"] = {};
        Array.from(node.attributes).forEach(attr => {
          obj["@attributes"][attr.name] = attr.value;
        });
      }
  
      // Hantera barnnoder
      const childNodes = Array.from(node.childNodes);
      for (const child of childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          return child.textContent.trim();
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childName = child.nodeName;
          const childObj = traverse(child as Element);
          
          if (obj[childName]) {
            if (Array.isArray(obj[childName])) {
              obj[childName].push(childObj);
            } else {
              obj[childName] = [obj[childName], childObj];
            }
          } else {
            obj[childName] = childObj;
          }
        }
      }
  
      return obj;
    };
  
    return traverse(xmlDoc.documentElement);
  };