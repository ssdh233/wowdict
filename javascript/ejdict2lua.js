const fs = require("fs");

const ejdictRaw = fs.readFileSync("_shared/ejdict-hand-utf8.txt");

const ejdictData = ejdictRaw.toString().split("\n");

const CHUNK_SIZE = 100000;
for (let i = 0; i * CHUNK_SIZE < ejdictData.length; i++) {
    let output = `DictSourceJA_part${i}={`;
    for (let j = i * CHUNK_SIZE; j < Math.min((i + 1) * CHUNK_SIZE, ejdictData.length); j++) {
        if (j % 1000 === 0) console.log(`Processing ${j} items...`);

        const [word, translation] = ejdictData[j].split("\t");
        output += `["${word.replaceAll('"', '\\"')}"]={["pron"]="",["def"]=[[${translation?.replaceAll(" / ","\n").replaceAll("・","、")  ?? ""} ]]},\n`;
    }

    output += `};\ntable.insert(DictSourceJA, DictSourceJA_part${i});\n`;

    fs.writeFileSync(`../classic/dict.ejdict.part${i}.lua`, output);
    fs.writeFileSync(`../retail/dict.ejdict.part${i}.lua`, output);
}

