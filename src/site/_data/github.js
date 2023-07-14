// const fetch = require("node-fetch");
// const read_url = async (url) => {
//       return fetch(url = url)
//         .then(res => {
//             if (res.status != 200){
//                 console.log(res);
//                 const return_message = `Content retrieval error ${res.status} ${res.statusText}`
//                 return return_message;
//             } else {
//                 return res.text()
//             }
//         })
//         .then(text => {
//             return text;
//         })
//         .catch(err => {
//           console.log("retrieval error catch")
//           const return_message = `Configured content URL is not reacheable at ${url}`
//           return return_message;
//         })
// }
//
// module.exports = async function() {
//     let return_content = {}
//
//     urls = {
//         return_url_02: "https://raw.githubusercontent.com/pluralitybook/plurality/main/introduction.md",
//         return_url_03: "https://raw.githubusercontent.com/pluralitybook/plurality/main/pluralworld.md",
//         return_url_03_02_en: "https://raw.githubusercontent.com/pluralitybook/plurality/main/LostDao.md",
//         return_url_02_de: "https://raw.githubusercontent.com/pluralitybook/plurality/German-translation/introduction.md",
//         return_url_02_zh_tw: "https://raw.githubusercontent.com/pluralitybook/plurality/main/第二章%20資訊技術與民主：日益擴大的鴻溝.md"
//     }
//
//     for (let url_item in urls) {
//         console.log(url_item, urls[url_item]);
//         return_content[url_item] = await read_url(urls[url_item])
//     }
//     return return_content;
// }