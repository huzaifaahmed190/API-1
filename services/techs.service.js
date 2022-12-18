const { tech } = require("../models/tech.model");
const { category } = require("../models/category.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");


async function createTech(params, callback) {
    if (!params.techName) {
        return callback(
            {
                message: "Tech Name required",
            },
            ""
        );
    }
    if (!params.category) {
        return callback(
            {
                message: "Category required",
            },
            ""
        );
    }
    const techModel = new tech(params);
    techModel.save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getTechs(params, callback) {
    const techName = params.techName;
    const categoryId = params.categoryId;
    var condition = {};

    if (techName) {
        condition["techName"] = {
            $regex: new RegExp(techName), $options: "i"
        };
    }
    if (categoryId) {
        condition["category"] = categoryId;
    }

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    tech
        .find(condition, "techId techName techShortDescription techPrice techSalePrice techImage techType techStatus")
        .populate("category", "categoryName categoryImage")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });


}


async function getTechById(params, callback) {
    const techId = params.techId;

    tech
        .findById(techId)
        .populate("category", "categoryName categoryImage")
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}



async function updateTech(params, callback) {
    const techId = params.techId;

    tech
        .findByIdAndUpdate(techId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                callback(`Cannot update Tech with id ${techId}`)
            }

            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}


async function deleteTech(params, callback) {
    const techId = params.techId;

    tech
        .findByIdAndRemove(techId)
        .then((response) => {
            if (!response) {
                callback(`Cannot delete tech with id ${techId}`)
            }

            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}


module.exports = {
    createTech,
    getTechs,
    getTechById,
    updateTech,
    deleteTech
};