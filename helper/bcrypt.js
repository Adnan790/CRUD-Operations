var controller = {};
var saltRound = 2;
const bcrypt = require('bcrypt');
var promise = require('promise');

// controller.getHash = (input) => {
//     return new promise((resolve, reject) => {
//         bcrypt.hash(input, saltRound).then(data => {
//             resolve(data)
//         }).catch(err => {
//             reject(err)
//         })
//     })

// }


controller.getHash = (input) => {
    return new promise((resolve, reject) => {
        bcrypt.hash(input, saltRound, function(err, hash) {
            if (!err) {
                resolve(hash)
            } else {
                reject(err)
            }
        })
    })

}



controller.compare = (pass, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, hash, function(err, res) {
            if (err) {
                return reject(false);
            } else if (res) {
                return resolve(true);
            } else {
                return resolve(false);
            }

        });
    })
}


// controller.compare = (password, hash) => {

//     return new promise(async(resolve, reject) => {
//         bcrypt.compare(password, hash).then(data => {
//             if (data) {
//                 return resolve(true)
//             } else if (!data) {
//                 return reject(false)
//             }
//             return reject(false)

//         }).catch(err => {
//             reject(err)
//         })
//     })

// }

module.exports = controller;