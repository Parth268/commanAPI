const { Constants } = require('../utils/Constants');
const { mySql } = require('../utils/Utils');


let saveNews = async (data) => {
    return new Promise(function (resolve, reject) {
        let insertQuery = `INSERT INTO tbl_news( author,title, description,url,urlToImage,publishedAt,content,name,countryCode)  VALUES ( ?, ?, ?, ?,?, ?,?, ?, ?) `;
        let queryValues = [data.author, data.title, data.description, data.url, data.urlToImage, data.publishedAt, data.content, data.source.name, data.countryCode];
        mySql.query(insertQuery, queryValues, function (err, result, fields) {
            if (err) { reject({ status: false, message: Constants.something_wrong }) }
            else if (result.affectedRows == 1) { resolve({ status: true, message: Constants.news_save }) }
            else { reject({ status: false, message: Constants.news_not_save }) }
        });
    });

}

let getNews = async (condition) => {
    return new Promise(function (resolve, reject) {
        let listQuery = `SELECT * FROM tbl_news ${condition}`
        console.log("list Query ",listQuery)
        mySql.query(listQuery, function (err, result, fields) {

            if (err) { reject({ status: false, message: Constants.something_wrong, size: 0}) }
            else if (result.length == 0) { reject({ status: false, data: [], size: 0, }) }
            else { resolve({ status: true, size: result.length, data: result, message: Constants.news_listed_success }) }

        });
    });

}

let cleanNewsData = async () => {
    return new Promise(function (resolve, reject) {
        let query = `TRUNCATE TABLE tbl_news`;

        mySql.query(query, function (err, result, fields) {
            if (err) { reject({ status: false, message: Constants.something_wrong }) }
            else {
                resolve({ status: true, message: "Deleted" })
            }
        });
    })
}

module.exports = {
    saveNews,
    getNews,
    cleanNewsData
};