const path = require("path");
const fs = require("fs");
const moment = require("moment");
const filesDirectory = "./src" //path.join(process.cwd());
const file_dir = `${filesDirectory}/site/_update_interval`;
// const file_dir = `.`;
const updateFile = (filename) => {

    console.log(`looking up folder - ${file_dir}`);
    if (fs.existsSync(file_dir)!=true) {
        console.log(`create folder - ${file_dir}`);
        try {
            fs.mkdirSync(file_dir,{recursive:true});
            console.log(`folder (${file_dir})  created`)
        } catch (err) {
            console.log(err.name + ':' +err.message)
            console.log(`creation of folder (${file_dir}) failed`)
        }
    }

    const fullName = `${file_dir}/${filename}`;
    const content = `${moment().format("YYYYMMDD hh:mm:ss")}`;
    try {
        fs.writeFileSync(fullName, content, "utf8" );
        console.log(`file (${fullName}) created `);
        return content;
    } catch (err) {
        console.log(`file (${fullName}) not created with error ${err.message}`);
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