export const xmlToJson = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  const parseNode = (node: Element): any => {
    const obj: any = {};
    
    if (node.attributes.length > 0) {
        obj.attributes = {};
        Array.from(node.attributes).forEach(attr => {
          obj.attributes[attr.name] = attr.value;
        });
      }

    const children = Array.from(node.childNodes);
    const childMap: { [key: string]: any[] } = {};

    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childName = child.nodeName;
        const parsedChild = parseNode(child as Element);
        
        if (!childMap[childName]) {
          childMap[childName] = [];
        }
        childMap[childName].push(parsedChild);
      }
    });

    Object.entries(childMap).forEach(([key, values]) => {
      obj[key] = values.length === 1 ? values[0] : values;
    });

    return obj;
  };

  return parseNode(xmlDoc.documentElement);
};