const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

const dictJson = fs.readFileSync("./_shared/en_cn_source.dict.json").toString();
const dictData = JSON.parse(dictJson);

const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    trimValues: false
});


const CHUNK_SIZE = 50000;

for (let i = 0; i * CHUNK_SIZE < dictData.length; i++) {
   let output = `DictSourceCN1_part${i}={`;
   for (let j = i * CHUNK_SIZE; j < Math.min((i + 1) * CHUNK_SIZE, dictData.length); j++) {
      if (j % 1000 === 0) console.log(`Processing ${j} items...`);

      const { word, definition } = dictData[j];
      const obj = parser.parse(definition);
      const result = extract(obj);
      const { def, pron } = result;
      output += `["${word}"]={["pron"]=[[ ${pron.replaceAll("\n", " ")} ]],["def"]=[[ ${def.replace("\n", "").replaceAll("▸", "-").replaceAll("‹", "<").replaceAll("›", ">").trim()} ]]},`
    }

   output += `};\ntable.insert(DictSourceCN1, DictSourceCN1_part${i});\n`;

   fs.writeFileSync(`../dict.cn1.part${i}.lua`, output);
}

function extract(node, options = {}) {
    let def = "";
    let pron = "";
    if (Array.isArray(node)) {
        let result = "";
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
            const { def: childDef, pron: childPron } = extract(value);

            def = childDef;
            pron = childPron;
            if (attr?.["@_class"] === "hwg x_xh0") {
                def = "";
                pron = childDef;
            }

            if (attr?.["@_lexid"]) {
                def = "\n" + childDef;
            }

            if (attr?.["@_class"].includes("x_xdh")) {
                def = "\n" + childDef;
            }

            if (attr?.["@_class"].includes("ty_pinyin")) {
                def = "";
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