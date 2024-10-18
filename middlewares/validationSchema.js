
const {body} = require("express-validator");

const validationResultSchema = () => {
       return [
            body("title")
              .notEmpty()
              .isLength({ min: 2 })
              .withMessage(" title at least 2 digits"),
            body("price").notEmpty().withMessage("Price is required"),
            ]
    }

    module.exports = { validationResultSchema }