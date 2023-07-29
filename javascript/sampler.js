const fs = require("fs");

const dictJson = fs.readFileSync("./_share/en_cn_source.dict.json").toString();
const dictData = JSON.parse(dictJson);

fs.writeFileSync("./_share/en_cn_source.dict.sample.json", JSON.stringify(dictData.slice(0, 100)));