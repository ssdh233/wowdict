const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

// const dictJson = fs.readFileSync("./_share/en_en_source.dict.sample.json").toString();
const dictJson = fs.readFileSync("./_share/en_en_source.dict.json").toString();
const dictData = JSON.parse(dictJson);

const parser = new XMLParser({
   preserveOrder: true,
   ignoreAttributes: false,
   trimValues: false
});

const middleNumber = 50000;

let output1 = "DictSourceEN1={";
for (let i = 0; i < middleNumber; i++) {
   if (i % 1000 === 0) console.log(`Processing ${i} items...`);

   const { word, definition } = dictData[i];
   const obj = parser.parse(definition);
   const result = extract(obj);
   const { def, pron } = result;
   output1 += `["${word}"]={["pron"]=[[${pron.replaceAll("\n", " ")}]],["def"]=[[${def}]]},`
}

output1 += "}";

// fs.writeFileSync("./_share/dict.sample.lua", output1);
fs.writeFileSync("./_share/dict.en1.lua", output1);


let output2 = "DictSourceEN2={";
for (let i = middleNumber; i < dictData.length; i++) {
   if (i % 1000 === 0) console.log(`Processing ${i} items...`);

   const { word, definition } = dictData[i];
   const obj = parser.parse(definition);
   const { def, pron } = extract(obj);
   output2 += `["${word}"]={["pron"]=[[${pron.replaceAll("\n", "")}]],["def"]=[[${def}]]},`
}

output2 += "}";

// fs.writeFileSync("./_share/dict.sample.lua", output2);
fs.writeFileSync("./_share/dict.en2.lua", output2);

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
