const path = require("path");
const fs = require("fs");
const moment = require("moment");
const filesDirectory = "./tmp" //path.join(process.cwd());
// const file_dir = `${filesDirectory}/_update_interval`;
const file_dir = `${filesDirectory}/_update_interval`;
const updateFile = (filename) => {

    if (fs.existsSync(file_dir)!=true) {
        console.log('create folder');
        try {
            fs.mkdirSync(dir=file_dir,{recursive:true});
        } catch {
            console.log(`${file_dir} already exists`)
        }
    }

    const fullName = `${file_dir}/${filename}`;
    const content = `${moment().format("YYYYMMDD hh:mm:ss")}`;
    try {
        fs.writeFileSync(fullName, content, "utf8");
        return content;
    } catch (err) {
        return "Error: " + err.message;
    }
};

exports.handler = async function(event, context) {
    console.log("Received event:", event);
    const update_result = updateFile('ts')
    console.log("Received event (file created)", update_result);

    return {
        statusCode: 200,
    };
};