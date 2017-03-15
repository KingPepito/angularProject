/**
 * Created by Antoine Chan on 15/03/2017.
 */

const ColorGenerator = class ColorGenerator{

    constructor() {
        let precision = 32;

        this.getRandomColor = function () {
            let r = Math.floor(Math.random() * 8 +1)* precision;
            let g = Math.floor(Math.random() * 8 +1)* precision;
            let b = Math.floor(Math.random() * 8 +1)* precision;

            return{
                r:r,
                g:g,
                b:b
            }
        };
    }


};

module.exports = ColorGenerator;