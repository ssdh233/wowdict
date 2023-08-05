const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

const dictJson = fs.readFileSync("./_shared/en_en_source.dict.json").toString();
const dictData = JSON.parse(dictJson);

const parser = new XMLParser({
   preserveOrder: true,
   ignoreAttributes: false,
   trimValues: false
});

const CHUNK_SIZE = 50000;

for (let i = 0; i * CHUNK_SIZE < dictData.length; i++) {
   let output = `DictSourceEN_part${i}={`;
   for (let j = i * CHUNK_SIZE; j < Math.min((i + 1) * CHUNK_SIZE, dictData.length); j++) {
      if (j % 1000 === 0) console.log(`Processing ${j} items...`);

      const { word, definition } = dictData[j];
      const obj = parser.parse(definition);
      const result = extract(obj);
      const { def, pron } = result;
      output += `["${word}"]={["pron"]=[[${pron.replaceAll("\n", " ")}]],["def"]=[[${def}]]},`
   }

   output += `};\ntable.insert(DictSourceEN, DictSourceEN_part${i});\n`;

   fs.writeFileSync(`../dict.en.part${i}.lua`, output);
}

function extract(node, options = {}) {
   let def = "";
   let pron = "";
   if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
         const { def: childDef, pron: childPron } = extract(node[i]);
         def += childDef;
         pron += childPron;
         if (options.isEntry) {
            def += "\n"
         }
      }
   } else if (typeof node === "object" && node !== null) {
      let key = Object.keys(node)[0];
      if (key === ":@") {
         key = Object.keys(node)[1];
      }

      const value = node[key];
      const attr = node[":@"];
      if (key === "#text") {
         def = value;
      } else if (key === "span") {
         if (attr?.["@_class"] === "hg x_xh0") {
            const { def: childDef } = extract(value);
            def = "";
            pron = childDef;
         } else if (attr?.["@_class"]?.includes("tg_pos")) {
            const { def: childDef, pron: childPron } = extract(value);
            def = childDef + "\n";
            pron = childPron;
         } else if (attr?.["@_class"]?.includes("tg_subEntryBlock") || attr?.["@_class"]?.includes("tg_etym")) {
            const { def: childDef, pron: childPron } = extract(value);
            def = childDef + "\n" + "------------------------------" + "\n";
            pron = childPron;
         } else if (attr?.["@_class"] === "l x_xoh") {
            const { def: childDef, pron: childPron } = extract(value);
            def = childDef + "\n";
            pron = childPron;
         } else if (attr?.["@_class"] === "eg") {
            const { def: childDef, pron: childPron } = extract(value);
            def = "|cffffffff" + childDef + "|r";
            pron = childPron;
         } else if (attr?.["@_class"] === "gg") {
            def = "";
            pron = "";
         } else if (attr?.["@_id"] && attr?.["@_id"].startsWith("m_en_gbu")) {
            const { def: childDef, pron: childPron } = extract(value);
            def = childDef + "\n";
            pron = childPron;
         } else {
            const { def: childDef, pron: childPron } = extract(value);
            def = childDef;
            pron = childPron;
         }
      } else if (key === "d:entry") {
         const { def: childDef, pron: childPron } = extract(value, { isEntry: true });
         def = childDef;
         pron = childPron;
      } else {
         const { def: childDef, pron: childPron } = extract(value);
         def = childDef;
         pron = childPron;
      }
   }

   return { def, pron }
}
