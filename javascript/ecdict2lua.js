const { parse } = require('csv-parse/sync');
const fs = require("fs");

const ecdictRaw = fs.readFileSync("_shared/ecdict.csv");

const ecdictData = parse(ecdictRaw.toString(), {
    columns: true,
    skip_empty_lines: true
}).filter(x => !x.word.includes(" "))

const CHUNK_SIZE = 100000;
for (let i = 0; i * CHUNK_SIZE < ecdictData.length; i++) {
    let output = `DictSourceCN2_part${i}={`;
    for (let j = i * CHUNK_SIZE; j < Math.min((i + 1) * CHUNK_SIZE, ecdictData.length); j++) {
        if (j % 1000 === 0) console.log(`Processing ${j} items...`);

        const { word, phonetic, translation } = ecdictData[j];
        output += `["${word.replaceAll('"', '\\"')}"]={["pron"]="| ${phonetic.replaceAll('"', '\\"').replaceAll("ә", 'ə').replaceAll("ә", 'ə')} |",["def"]="${translation.replaceAll('"', '\\"')}"},\n`;
    }

    output += `};\ntable.insert(DictSourceCN2, DictSourceCN2_part${i});\n`;

    fs.writeFileSync(`../dict.ecdict.part${i}.lua`, output);
}

