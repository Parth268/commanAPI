const { getNews } = require('../../modal/mdl_comman_data');

const news = async (req, res) => {
    const { country_code } = req.body
    console.log("country_code ", country_code)
    let condition = ""
    if (country_code) {
        condition = ` where countryCode='${country_code}'`
    }
    let data = await getNews(condition)
    res.send(data)
}
module.exports = { news };