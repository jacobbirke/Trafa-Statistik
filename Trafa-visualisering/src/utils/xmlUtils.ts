export const xmlToJson = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const parseNode = (node: Element): any => {
    const obj: any = {};
    
    if (node.attributes.length > 0) {
      obj["@attributes"] = {};
      Array.from(node.attributes).forEach(attr => {
        obj["@attributes"][attr.name] = attr.value;
      });
    }

    const textContent = Array.from(node.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent?.trim())
      .join(" ")
      .trim();

    if (textContent) {
      obj["#text"] = textContent;
    }

    const childElements = Array.from(node.children);
    const childMap: { [key: string]: any[] } = {};

    childElements.forEach(child => {
      const childName = child.nodeName;
      const parsedChild = parseNode(child);
      
      if (!childMap[childName]) {
        childMap[childName] = [];
      }
      childMap[childName].push(parsedChild);
    });

    Object.entries(childMap).forEach(([key, values]) => {
      obj[key] = values.length === 1 ? values[0] : values;
    });

    return obj;
  };

  return parseNode(xmlDoc.documentElement);
};