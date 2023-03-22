const { httpCall } = require('../../utils/Utils');
const mdl_comman_data = require('../../modal/mdl_comman_data')
const { Constants } = require('../../utils/Constants');
const { Config } = require('../../utils/Config');


const recursionCall = async (req, res) => {
    await cleanNewsData()
    for await (const countryCode of Constants.news_country) {
        req.body = { country_code: countryCode }
        await newsApiCall(req, res)
    }
    res.send({ message: Constants.news_save })

}

const newsApiCall = async (req, res) => {
    const userAgent = req.get('user-agent');
    const { country_code = "in", news_type = "top-headlines" } = req.body
    const options = {
        host: 'newsapi.org',
        //  path: `/v2/${news_type}?country=${country_code}&pageSize=100&apiKey=${Config.newsApis}`,
        path: `/v2/${news_type}?country=${country_code}&pageSize=100`,
        headers: {
            'User-Agent': userAgent,
            'X-Api-Key': Config.newsApis
        }
    }
    let data = await httpCall({ options: options })

    await newsCallStore({ req: req, res: res, data: data, countryCode: country_code })
}

const cleanNewsData = async () => {
    mdl_comman_data.cleanNewsData();
}

const newsCallStore = async ({ req, res, data, countryCode }) => {
    for await (element of data) {
        element.author = element.author ? element.author : "No Author"
        element.title = element.title ? element.title : "No Title"
        element.description = element.description ? element.description : "No  Description"
        element.url = element.url ? element.url : "No Url"
        element.urlToImage = element.urlToImage ? element.urlToImage : "No Url To Image"
        element.publishedAt = element.publishedAt ? element.publishedAt : "No Published At"
        element.content = element.content ? element.content : "No content"
        element.source.name = element.source.name ? element.source.name : " No Source name"
        element.countryCode = countryCode ? countryCode :"No Country Code"
        mdl_comman_data.saveNews(element);
    }
}

module.exports = { recursionCall }; 