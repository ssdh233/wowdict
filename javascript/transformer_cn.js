const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

// const dictJson = fs.readFileSync("./_share/en_cn_source.dict.sample.json").toString();
const dictJson = fs.readFileSync("./_share/en_cn_source.dict.json").toString();
const dictData = JSON.parse(dictJson);

const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    trimValues: false
});

const middleNumber = 50000;

let output1 = "DictSourceCN1={";
for (let i = 0; i < middleNumber; i++) {
    if (i % 1000 === 0) console.log(`Processing ${i} items...`);

    const { word, definition } = dictData[i];
    const obj = parser.parse(definition);
    const result = extract(obj);
    const { def, pron } = result;
    output1 += `["${word}"]={["pron"]=[[ ${pron.replaceAll("\n", " ")} ]],["def"]=[[ ${def.replace("\n", "").replaceAll("▸", "-").replaceAll("‹", "<").replaceAll("›", ">").trim()} ]]},`
}

output1 += "}";


// fs.writeFileSync("./_share/dict.cn.sample.lua", output);
fs.writeFileSync("./_share/dict.cn1.lua", output1);


let output2 = "DictSourceCN2={";
for (let i = middleNumber; i < dictData.length; i++) {
    if (i % 1000 === 0) console.log(`Processing ${i} items...`);

    const { word, definition } = dictData[i];
    const obj = parser.parse(definition);
    const result = extract(obj);
    const { def, pron } = result;
    output2 += `["${word}"]={["pron"]=[[ ${pron.replaceAll("\n", " ")} ]],["def"]=[[ ${def.replace("\n", "").replaceAll("▸", "-").replaceAll("‹", "<").replaceAll("›", ">").trim()} ]]},`
}

output2 += "}";

// fs.writeFileSync("./_share/dict.cn.sample.lua", output);
fs.writeFileSync("./_share/dict.cn2.lua", output2);

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